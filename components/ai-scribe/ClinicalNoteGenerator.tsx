import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { ClinicalNote, generateClinicalNotes, validateClinicalNote } from '../../lib/ai/openai-client';

interface ClinicalNoteGeneratorProps {
  transcribedText: string;
  patientContext?: {
    name: string;
    condition: string;
    currentSymptoms?: string[];
    medications?: string[];
  };
  onNoteGenerated: (note: ClinicalNote) => void;
  onError: (error: string) => void;
  autoGenerate?: boolean;
}

export default function ClinicalNoteGenerator({
  transcribedText,
  patientContext,
  onNoteGenerated,
  onError,
  autoGenerate = false
}: ClinicalNoteGeneratorProps) {
  const [generatedNote, setGeneratedNote] = useState<ClinicalNote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    missingFields: string[];
    suggestions: string[];
  } | null>(null);

  // Auto-generate note when transcription is available
  useEffect(() => {
    if (autoGenerate && transcribedText && transcribedText.length > 20) {
      generateNote();
    }
  }, [transcribedText, autoGenerate]);

  const generateNote = async () => {
    if (!transcribedText || transcribedText.length < 10) {
      onError('Transcription too short to generate meaningful notes');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('🤖 Generating clinical note from transcription...');
      
      const note = await generateClinicalNotes(transcribedText, patientContext);
      setGeneratedNote(note);
      
      // Validate the generated note
      const validation = validateClinicalNote(note);
      setValidationResult(validation);
      
      // Notify parent component
      onNoteGenerated(note);
      
      console.log('✅ Clinical note generated successfully');
      
    } catch (error) {
      console.error('❌ Failed to generate clinical note:', error);
      onError('Failed to generate clinical note. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateNote = () => {
    Alert.alert(
      'Regenerate Note',
      'This will create a new clinical note from the transcription. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Regenerate', onPress: generateNote }
      ]
    );
  };

  if (!transcribedText) {
    return (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Ionicons name="document-text-outline" size={48} color="#bdc3c7" />
        <Text style={{ 
          marginTop: 8, 
          fontSize: 16, 
          color: '#666', 
          textAlign: 'center' 
        }}>
          Complete a voice recording to generate clinical notes
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16 
      }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2c3e50' }}>
          Clinical Notes
        </Text>
        
        <Pressable
          onPress={generateNote}
          disabled={isGenerating}
          style={{
            backgroundColor: '#3498db',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="refresh" size={16} color="white" />
          )}
          <Text style={{ color: 'white', marginLeft: 8, fontWeight: '600' }}>
            {isGenerating ? 'Generating...' : 'Generate'}
          </Text>
        </Pressable>
      </View>

      {/* Validation Status */}
      {validationResult && (
        <View style={{
          backgroundColor: validationResult.isValid ? '#d4edda' : '#f8d7da',
          borderColor: validationResult.isValid ? '#c3e6cb' : '#f5c6cb',
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginBottom: 16
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Ionicons 
              name={validationResult.isValid ? 'checkmark-circle' : 'alert-circle'} 
              size={20} 
              color={validationResult.isValid ? '#155724' : '#721c24'} 
            />
            <Text style={{ 
              marginLeft: 8, 
              fontWeight: 'bold',
              color: validationResult.isValid ? '#155724' : '#721c24'
            }}>
              {validationResult.isValid ? 'Complete Documentation' : 'Incomplete Documentation'}
            </Text>
          </View>
          
          {!validationResult.isValid && validationResult.missingFields.length > 0 && (
            <Text style={{ color: '#721c24', fontSize: 14 }}>
              Missing: {validationResult.missingFields.join(', ')}
            </Text>
          )}
        </View>
      )}

      {/* Generated Note Display */}
      {generatedNote ? (
        <View>
          {/* SOAP Note */}
          {generatedNote.soap && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#2c3e50' }}>
                SOAP Note
              </Text>
              
              {/* Subjective */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#34495e', marginBottom: 4 }}>
                  Subjective
                </Text>
                <View style={{ backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8 }}>
                  <Text style={{ fontSize: 14, lineHeight: 20 }}>
                    {generatedNote.soap.subjective}
                  </Text>
                </View>
              </View>

              {/* Objective */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#34495e', marginBottom: 4 }}>
                  Objective
                </Text>
                <View style={{ backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8 }}>
                  <Text style={{ fontSize: 14, lineHeight: 20 }}>
                    {generatedNote.soap.objective}
                  </Text>
                </View>
              </View>

              {/* Assessment */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#34495e', marginBottom: 4 }}>
                  Assessment
                </Text>
                <View style={{ backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8 }}>
                  <Text style={{ fontSize: 14, lineHeight: 20 }}>
                    {generatedNote.soap.assessment}
                  </Text>
                </View>
              </View>

              {/* Plan */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#34495e', marginBottom: 4 }}>
                  Plan
                </Text>
                <View style={{ backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8 }}>
                  <Text style={{ fontSize: 14, lineHeight: 20 }}>
                    {generatedNote.soap.plan}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Visit Summary */}
          {generatedNote.visitSummary && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#2c3e50' }}>
                Visit Summary
              </Text>
              <View style={{ backgroundColor: '#e8f5e8', padding: 12, borderRadius: 8 }}>
                <Text style={{ fontSize: 14, lineHeight: 20 }}>
                  {generatedNote.visitSummary}
                </Text>
              </View>
            </View>
          )}

          {/* Recommendations */}
          {generatedNote.recommendations && generatedNote.recommendations.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#2c3e50' }}>
                Recommendations
              </Text>
              {generatedNote.recommendations.map((recommendation, index) => (
                <View key={index} style={{ 
                  flexDirection: 'row', 
                  marginBottom: 8,
                  backgroundColor: '#fff3cd',
                  padding: 8,
                  borderRadius: 6
                }}>
                  <Text style={{ color: '#856404', marginRight: 8 }}>•</Text>
                  <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: '#856404' }}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Follow-up Actions */}
          {generatedNote.followUpActions && generatedNote.followUpActions.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#2c3e50' }}>
                Follow-up Actions
              </Text>
              {generatedNote.followUpActions.map((action, index) => (
                <View key={index} style={{ 
                  flexDirection: 'row', 
                  marginBottom: 8,
                  backgroundColor: '#d1ecf1',
                  padding: 8,
                  borderRadius: 6
                }}>
                  <Ionicons name="checkbox-outline" size={16} color="#0c5460" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: '#0c5460' }}>
                    {action}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Clinical Entities */}
          {generatedNote.clinicalEntities && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#2c3e50' }}>
                Clinical Entities
              </Text>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {generatedNote.clinicalEntities.symptoms?.map((symptom, index) => (
                  <View key={`symptom-${index}`} style={{
                    backgroundColor: '#f8d7da',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ fontSize: 12, color: '#721c24' }}>
                      {symptom}
                    </Text>
                  </View>
                ))}
                
                {generatedNote.clinicalEntities.medications?.map((medication, index) => (
                  <View key={`med-${index}`} style={{
                    backgroundColor: '#d4edda',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ fontSize: 12, color: '#155724' }}>
                      {medication}
                    </Text>
                  </View>
                ))}

                {generatedNote.clinicalEntities.interventions?.map((intervention, index) => (
                  <View key={`intervention-${index}`} style={{
                    backgroundColor: '#d1ecf1',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ fontSize: 12, color: '#0c5460' }}>
                      {intervention}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: '#e9ecef'
          }}>
            <Pressable
              onPress={regenerateNote}
              style={{
                backgroundColor: '#6c757d',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Ionicons name="refresh" size={16} color="white" />
              <Text style={{ color: 'white', marginLeft: 8, fontWeight: '600' }}>
                Regenerate
              </Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: '#28a745',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Ionicons name="checkmark" size={16} color="white" />
              <Text style={{ color: 'white', marginLeft: 8, fontWeight: '600' }}>
                Approve & Save
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={{ alignItems: 'center', padding: 32 }}>
          <Ionicons name="document-text-outline" size={64} color="#bdc3c7" />
          <Text style={{ 
            marginTop: 16, 
            fontSize: 16, 
            color: '#666', 
            textAlign: 'center' 
          }}>
            {isGenerating 
              ? 'AI is generating your clinical notes...' 
              : 'Tap "Generate" to create clinical notes from your transcription'
            }
          </Text>
        </View>
      )}
    </ScrollView>
  );
} 