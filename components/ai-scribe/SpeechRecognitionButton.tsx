import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';

// Types
interface SpeechRecognitionProps {
  onTranscriptionUpdate: (text: string) => void;
  onTranscriptionComplete: (finalText: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  buttonStyle?: any;
  recordingColor?: string;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  recordingUri?: string;
}

export default function SpeechRecognitionButton({
  onTranscriptionUpdate,
  onTranscriptionComplete,
  onError,
  disabled = false,
  buttonStyle,
  recordingColor = '#e74c3c'
}: SpeechRecognitionProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0
  });
  
  const [permission, setPermission] = useState<boolean>(false);
  const [transcribedText, setTranscribedText] = useState<string>('');
  
  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationTimerRef = useRef<number | null>(null);

  // Initialize audio permissions
  useEffect(() => {
    requestPermissions();
    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant microphone permission to use voice recording.',
          [{ text: 'OK' }]
        );
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
    } catch (error) {
      console.error('Error requesting permissions:', error);
      onError('Failed to request microphone permissions');
    }
  };

  const startRecording = async () => {
    try {
      if (!permission) {
        await requestPermissions();
        return;
      }

      console.log('🎤 Starting recording...');
      
      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        }
      };

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      
      recordingRef.current = recording;
      
      setRecordingState({
        isRecording: true,
        isPaused: false,
        duration: 0
      });

      // Start duration timer
      durationTimerRef.current = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);

      console.log('✅ Recording started');
      onTranscriptionUpdate('Recording started...');

    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      onError('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      console.log('🛑 Stopping recording...');
      
      // Clear timer
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      setRecordingState({
        isRecording: false,
        isPaused: false,
        duration: 0,
        recordingUri: uri || undefined
      });

      console.log('✅ Recording stopped, URI:', uri);

      if (uri) {
        onTranscriptionUpdate('Processing audio...');
        await processRecording(uri);
      } else {
        onError('No audio recorded');
      }

    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      onError('Failed to stop recording');
    }
  };

  const processRecording = async (uri: string) => {
    try {
      console.log('🔄 Processing recording...');
      
      // For now, we'll simulate transcription processing
      // In a real implementation, you would:
      // 1. Convert the audio file to the right format
      // 2. Send to OpenAI Whisper API via your backend
      // 3. Handle the transcription response
      
      // Simulate processing delay
      setTimeout(() => {
        const simulatedTranscription = "This is a simulated transcription. The patient reports moderate pain level of 6 out of 10, particularly in the lower back region. Family is present and concerned about comfort measures. Vital signs appear stable.";
        
        setTranscribedText(simulatedTranscription);
        onTranscriptionComplete(simulatedTranscription);
        
        console.log('✅ Transcription complete (simulated)');
      }, 2000);

      // TODO: Implement actual transcription
      // const audioBlob = await convertToBlob(uri);
      // const transcription = await transcribeAudio(audioBlob);
      // setTranscribedText(transcription.text);
      // onTranscriptionComplete(transcription.text);

    } catch (error) {
      console.error('❌ Failed to process recording:', error);
      onError('Failed to process audio recording');
    }
  };

  const toggleRecording = async () => {
    if (recordingState.isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ alignItems: 'center', padding: 16 }}>
      {/* Recording Button */}
      <Pressable
        onPress={toggleRecording}
        disabled={disabled || !permission}
        style={[
          {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: recordingState.isRecording ? recordingColor : '#3498db',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          },
          buttonStyle,
          disabled && { backgroundColor: '#bdc3c7' }
        ]}
      >
        <Ionicons 
          name={recordingState.isRecording ? 'stop' : 'mic'} 
          size={32} 
          color="white" 
        />
      </Pressable>

      {/* Recording Status */}
      {recordingState.isRecording && (
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: recordingColor,
            marginBottom: 4
          }}>
            Recording...
          </Text>
          <Text style={{ fontSize: 16, color: '#666' }}>
            {formatDuration(recordingState.duration)}
          </Text>
        </View>
      )}

      {/* Transcription Preview */}
      {transcribedText && !recordingState.isRecording && (
        <View style={{ 
          marginTop: 16, 
          padding: 12, 
          backgroundColor: '#f8f9fa', 
          borderRadius: 8,
          maxWidth: '100%'
        }}>
          <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
            {transcribedText.length > 150 
              ? transcribedText.substring(0, 150) + '...' 
              : transcribedText
            }
          </Text>
        </View>
      )}

      {/* Instructions */}
      {!recordingState.isRecording && !transcribedText && (
        <Text style={{ 
          marginTop: 16, 
          fontSize: 14, 
          color: '#666', 
          textAlign: 'center',
          maxWidth: 250
        }}>
          Tap the microphone to start recording your visit notes
        </Text>
      )}
    </View>
  );
}

// Helper function to convert file URI to Blob (for web compatibility)
async function convertToBlob(uri: string): Promise<Blob> {
  try {
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      return await response.blob();
    } else {
      // For mobile, read the file and create a blob-like object
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('Audio file not found');
      }
      
      // Read file as base64
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Convert base64 to binary
      const binaryString = atob(fileContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      return new Blob([bytes], { type: 'audio/wav' });
    }
  } catch (error) {
    console.error('Error converting to blob:', error);
    throw error;
  }
} 