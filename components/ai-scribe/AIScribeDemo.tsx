import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ClinicalNote } from '../../lib/ai/openai-client';
import AIScribeInterface from './AIScribeInterface';

// Demo component to showcase AI Scribe functionality
export default function AIScribeDemo() {
  const [isAIScribeVisible, setIsAIScribeVisible] = useState(false);

  // Sample patient data for demo
  const samplePatient = {
    id: 'patient-001',
    name: 'Mary Johnson',
    condition: 'End-stage COPD with palliative care',
    currentSymptoms: ['dyspnea', 'fatigue', 'anxiety'],
    medications: ['morphine 5mg PRN', 'lorazepam 0.5mg BID', 'albuterol inhaler']
  };

  const handleNotesSaved = (note: ClinicalNote, transcription: string) => {
    console.log('📝 Demo: Clinical notes saved');
    console.log('Note:', note);
    console.log('Transcription:', transcription);
    
    // In a real app, you would save this to your database
    alert('Clinical notes saved successfully!\n\nCheck the console for details.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="mic-circle" size={64} color="#007bff" />
          <Text style={styles.title}>AI Clinical Scribe</Text>
          <Text style={styles.subtitle}>
            Voice-powered clinical documentation for hospice care
          </Text>
        </View>

        <View style={styles.patientInfo}>
          <Text style={styles.patientLabel}>Demo Patient</Text>
          <Text style={styles.patientName}>{samplePatient.name}</Text>
          <Text style={styles.patientCondition}>{samplePatient.condition}</Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Features</Text>
          
          <View style={styles.feature}>
            <Ionicons name="mic" size={20} color="#28a745" />
            <Text style={styles.featureText}>Voice Recording & Transcription</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="document-text" size={20} color="#007bff" />
            <Text style={styles.featureText}>Automated SOAP Note Generation</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="medical" size={20} color="#dc3545" />
            <Text style={styles.featureText}>Medical Entity Extraction</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={20} color="#6f42c1" />
            <Text style={styles.featureText}>Clinical Documentation Validation</Text>
          </View>
        </View>

        <Pressable
          style={styles.launchButton}
          onPress={() => setIsAIScribeVisible(true)}
        >
          <Ionicons name="mic" size={24} color="white" />
          <Text style={styles.launchButtonText}>Start AI Scribe Session</Text>
        </Pressable>

                 <Text style={styles.note}>
           Note: This demo uses simulated transcription. In production, you&apos;ll need to set up your OpenAI API key.
         </Text>
      </View>

      {/* AI Scribe Interface */}
      <AIScribeInterface
        isVisible={isAIScribeVisible}
        onClose={() => setIsAIScribeVisible(false)}
        onNoteSaved={handleNotesSaved}
        patientContext={samplePatient}
        visitId="demo-visit-001"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  patientInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  patientCondition: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  features: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 12,
  },
  launchButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  launchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  note: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
}); 