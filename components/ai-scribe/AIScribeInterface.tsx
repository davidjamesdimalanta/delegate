import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, SafeAreaView, Text, View } from 'react-native';
import { ClinicalNote } from '../../lib/ai/openai-client';
import { createClinicalNote } from '../../lib/database-clinical-notes';
import ClinicalNoteGenerator from './ClinicalNoteGenerator';
import SpeechRecognitionButton from './SpeechRecognitionButton';

interface AIScribeInterfaceProps {
  isVisible: boolean;
  onClose: () => void;
  onNoteSaved?: (note: ClinicalNote, transcription: string) => void;
  patientContext?: {
    id: string;
    name: string;
    condition: string;
    currentSymptoms?: string[];
    medications?: string[];
  };
  visitId?: string;
  currentUserId?: string;
}

interface WorkflowStep {
  step: 'recording' | 'transcription' | 'generation' | 'review';
  title: string;
  description: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 'recording',
    title: 'Record Visit',
    description: 'Record your voice notes during the patient visit'
  },
  {
    step: 'transcription',
    title: 'Transcription',
    description: 'AI converts your speech to text'
  },
  {
    step: 'generation',
    title: 'Generate Notes',
    description: 'AI creates structured clinical documentation'
  },
  {
    step: 'review',
    title: 'Review & Approve',
    description: 'Review and approve the generated clinical notes'
  }
];

export default function AIScribeInterface({
  isVisible,
  onClose,
  onNoteSaved,
  patientContext,
  visitId,
  currentUserId
}: AIScribeInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep['step']>('recording');
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [generatedNote, setGeneratedNote] = useState<ClinicalNote | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleTranscriptionUpdate = (text: string) => {
    console.log('📝 Transcription update:', text);
    // This could be used for real-time display of transcription progress
  };

  const handleTranscriptionComplete = (finalText: string) => {
    console.log('✅ Transcription complete:', finalText);
    setTranscribedText(finalText);
    setCurrentStep('generation');
  };

  const handleNoteGenerated = (note: ClinicalNote) => {
    console.log('🤖 Note generated:', note);
    setGeneratedNote(note);
    setCurrentStep('review');
  };

  const handleError = (error: string) => {
    console.error('❌ AI Scribe error:', error);
    setErrors(prev => [...prev, error]);
    Alert.alert('AI Scribe Error', error);
  };

  const handleSaveNote = async () => {
    if (!generatedNote || !transcribedText) {
      Alert.alert('Error', 'No clinical note to save');
      return;
    }

    if (!visitId || !patientContext?.id) {
      Alert.alert('Error', 'Missing visit or patient information');
      return;
    }

    // Validate the clinical note before saving
    const validation = validateClinicalNote(generatedNote);
    if (!validation.isValid) {
      Alert.alert(
        'Incomplete Clinical Note',
        `The following sections need attention:\n\n${validation.missingFields.join('\n')}\n\nWould you like to save anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save Anyway', onPress: () => proceedWithSave() }
        ]
      );
      return;
    }

    await proceedWithSave();
  };

  const proceedWithSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Save to database using the clinical notes handler
      const { data, error } = await createClinicalNote(
        visitId!,
        patientContext!.id,
        generatedNote!,
        transcribedText,
        currentUserId // Pass undefined if no user ID available
      );

      if (error) {
        throw new Error(error.message || 'Failed to save clinical note');
      }

      console.log('✅ Clinical note saved to database:', data);
      
      // Call the parent callback if provided
      onNoteSaved?.(generatedNote!, transcribedText);
      
      setSaveSuccess(true);
      
      // Show success message and close after a brief delay
      Alert.alert(
        'Success',
        'Clinical note has been saved to the patient record.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetWorkflow();
              onClose();
            }
          }
        ]
      );

    } catch (error) {
      console.error('❌ Error saving clinical note:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setErrors(prev => [...prev, `Save failed: ${errorMessage}`]);
      
      Alert.alert(
        'Save Failed',
        `Failed to save clinical note: ${errorMessage}`,
        [
          { text: 'OK' },
          {
            text: 'Try Again',
            onPress: () => handleSaveNote()
          }
        ]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to validate clinical note (basic validation)
  const validateClinicalNote = (note: ClinicalNote) => {
    const missingFields: string[] = [];
    
    if (!note.soap?.subjective || note.soap.subjective.length < 10) {
      missingFields.push('• Subjective findings');
    }
    if (!note.soap?.objective || note.soap.objective.length < 10) {
      missingFields.push('• Objective findings');
    }
    if (!note.soap?.assessment || note.soap.assessment.length < 10) {
      missingFields.push('• Assessment');
    }
    if (!note.soap?.plan || note.soap.plan.length < 10) {
      missingFields.push('• Plan');
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  const resetWorkflow = () => {
    setCurrentStep('recording');
    setTranscribedText('');
    setGeneratedNote(null);
    setErrors([]);
    setIsSaving(false);
    setSaveSuccess(false);
  };

  const handleClose = () => {
    if (isSaving) {
      Alert.alert('Please Wait', 'Clinical note is being saved. Please wait before closing.');
      return;
    }

    if (transcribedText || generatedNote) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved work. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              resetWorkflow();
              onClose();
            }
          }
        ]
      );
    } else {
      onClose();
    }
  };

  const goToStep = (step: WorkflowStep['step']) => {
    // Allow going back to previous steps but not forward
    const stepOrder = ['recording', 'transcription', 'generation', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const targetIndex = stepOrder.indexOf(step);
    
    if (targetIndex <= currentIndex) {
      setCurrentStep(step);
    }
  };

  const renderWorkflowIndicator = () => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 8,
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef'
    }}>
      {WORKFLOW_STEPS.map((workflowStep, index) => {
        const isActive = workflowStep.step === currentStep;
        const isCompleted = WORKFLOW_STEPS.findIndex(s => s.step === currentStep) > index;
        const stepNumber = index + 1;

        return (
          <React.Fragment key={workflowStep.step}>
            <Pressable
              onPress={() => goToStep(workflowStep.step)}
              style={{
                alignItems: 'center',
                opacity: isActive || isCompleted ? 1 : 0.5
              }}
            >
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isCompleted ? '#28a745' : (isActive ? '#007bff' : '#6c757d'),
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4
              }}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={18} color="white" />
                ) : (
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                    {stepNumber}
                  </Text>
                )}
              </View>
              <Text style={{
                fontSize: 10,
                color: isActive ? '#007bff' : '#6c757d',
                textAlign: 'center',
                maxWidth: 60
              }}>
                {workflowStep.title}
              </Text>
            </Pressable>
            
            {index < WORKFLOW_STEPS.length - 1 && (
              <View style={{
                flex: 1,
                height: 2,
                backgroundColor: isCompleted ? '#28a745' : '#e9ecef',
                marginHorizontal: 8,
                marginBottom: 16
              }} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'recording':
      case 'transcription':
        return (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <SpeechRecognitionButton
              onTranscriptionUpdate={handleTranscriptionUpdate}
              onTranscriptionComplete={handleTranscriptionComplete}
              onError={handleError}
            />
            
            {transcribedText && (
              <View style={{ margin: 16, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#2c3e50' }}>
                  Transcription Complete
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 20 }}>
                  {transcribedText}
                </Text>
                <Pressable
                  onPress={() => setCurrentStep('generation')}
                  style={{
                    backgroundColor: '#007bff',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    marginTop: 12,
                    alignSelf: 'flex-start'
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>
                    Continue to Notes
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        );

      case 'generation':
      case 'review':
        return (
          <ClinicalNoteGenerator
            transcribedText={transcribedText}
            patientContext={patientContext}
            onNoteGenerated={handleNoteGenerated}
            onError={handleError}
            autoGenerate={currentStep === 'generation'}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e9ecef'
        }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2c3e50' }}>
              AI Clinical Scribe
            </Text>
            {patientContext && (
              <Text style={{ fontSize: 14, color: '#6c757d', marginTop: 2 }}>
                {patientContext.name} • {patientContext.condition}
              </Text>
            )}
          </View>
          
          <Pressable
            onPress={handleClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#f8f9fa',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name="close" size={20} color="#6c757d" />
          </Pressable>
        </View>

        {/* Workflow Indicator */}
        {renderWorkflowIndicator()}

        {/* Error Display */}
        {errors.length > 0 && (
          <View style={{
            backgroundColor: '#f8d7da',
            borderColor: '#f5c6cb',
            borderWidth: 1,
            margin: 16,
            padding: 12,
            borderRadius: 8
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="alert-circle" size={20} color="#721c24" />
              <Text style={{ marginLeft: 8, fontWeight: 'bold', color: '#721c24' }}>
                Errors
              </Text>
            </View>
            {errors.map((error, index) => (
              <Text key={index} style={{ color: '#721c24', fontSize: 14 }}>
                • {error}
              </Text>
            ))}
            <Pressable
              onPress={() => setErrors([])}
              style={{ marginTop: 8, alignSelf: 'flex-start' }}
            >
              <Text style={{ color: '#721c24', textDecorationLine: 'underline' }}>
                Clear errors
              </Text>
            </Pressable>
          </View>
        )}

        {/* Main Content */}
        <View style={{ flex: 1 }}>
          {renderStepContent()}
        </View>

        {/* Footer Actions */}
        {currentStep === 'review' && generatedNote && (
          <View style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: '#e9ecef',
            backgroundColor: '#f8f9fa'
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable
                onPress={resetWorkflow}
                disabled={isSaving}
                style={{
                  backgroundColor: isSaving ? '#6c757d80' : '#6c757d',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Ionicons name="refresh" size={16} color="white" />
                <Text style={{ color: 'white', marginLeft: 8, fontWeight: '600' }}>
                  Start Over
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSaveNote}
                disabled={isSaving || saveSuccess}
                style={{
                  backgroundColor: saveSuccess ? '#28a745' : (isSaving ? '#007bff80' : '#28a745'),
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : saveSuccess ? (
                  <Ionicons name="checkmark" size={16} color="white" />
                ) : (
                  <Ionicons name="save" size={16} color="white" />
                )}
                <Text style={{ color: 'white', marginLeft: 8, fontWeight: '600' }}>
                  {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to Record'}
                </Text>
              </Pressable>
            </View>
            
            {/* Save Status Indicator */}
            {(isSaving || saveSuccess) && (
              <View style={{
                marginTop: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isSaving && (
                  <>
                    <ActivityIndicator size="small" color="#007bff" />
                    <Text style={{ marginLeft: 8, color: '#007bff', fontSize: 14 }}>
                      Saving clinical note to database...
                    </Text>
                  </>
                )}
                {saveSuccess && (
                  <>
                    <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                    <Text style={{ marginLeft: 8, color: '#28a745', fontSize: 14 }}>
                      Clinical note saved successfully!
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
        )}

        {/* Database Status Indicator */}
        {visitId && patientContext && (
          <View style={{
            padding: 8,
            backgroundColor: '#e8f5e8',
            borderTopWidth: 1,
            borderTopColor: '#28a745'
          }}>
            <Text style={{ fontSize: 12, color: '#155724', textAlign: 'center' }}>
              Connected to database • Visit: {visitId.slice(0, 8)}... • Patient: {patientContext.name}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
} 