import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ClinicalNoteRecord,
    getClinicalNotesByPatient,
    getClinicalNotesByVisit
} from '../../lib/database-clinical-notes';

interface ClinicalNotesDemoProps {
  visitId?: string;
  patientId?: string;
}

export default function ClinicalNotesDemo({ visitId, patientId }: ClinicalNotesDemoProps) {
  const [notes, setNotes] = useState<ClinicalNoteRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const loadNotes = async () => {
    if (!visitId && !patientId) {
      setError('No visit or patient ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      if (visitId) {
        result = await getClinicalNotesByVisit(visitId);
      } else if (patientId) {
        result = await getClinicalNotesByPatient(patientId);
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      setNotes(result?.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notes';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [visitId, patientId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'reviewed': return '#007bff';
      case 'draft': return '#ffc107';
      case 'archived': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        padding: 16, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingBottom: insets.bottom + 90 // Tab bar height + extra padding
      }}>
        <Text>Loading clinical notes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ 
        flex: 1, 
        padding: 16,
        paddingBottom: insets.bottom + 90 // Tab bar height + extra padding
      }}>
        <View style={{ 
          backgroundColor: '#f8d7da', 
          padding: 12, 
          borderRadius: 8, 
          marginBottom: 16 
        }}>
          <Text style={{ color: '#721c24', fontWeight: 'bold' }}>Error Loading Notes</Text>
          <Text style={{ color: '#721c24' }}>{error}</Text>
        </View>
        <Pressable
          onPress={loadNotes}
          style={{
            backgroundColor: '#007bff',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View style={{ 
        flex: 1, 
        padding: 16, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingBottom: insets.bottom + 90 // Tab bar height + extra padding
      }}>
        <Ionicons name="document-text-outline" size={48} color="#bdc3c7" />
        <Text style={{ marginTop: 8, fontSize: 16, color: '#666', textAlign: 'center' }}>
          No clinical notes found
        </Text>
        <Text style={{ marginTop: 4, fontSize: 14, color: '#999', textAlign: 'center' }}>
          Use the AI Scribe to create your first clinical note
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ 
        padding: 16,
        paddingBottom: insets.bottom + 90 // Tab bar height + extra padding
      }}
      showsVerticalScrollIndicator={false}
    >
      {notes.map((note) => (
        <View 
          key={note.id} 
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#e9ecef',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}
        >
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 12 
          }}>
            <View style={{
              backgroundColor: getStatusColor(note.status),
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12
            }}>
              <Text style={{ 
                color: 'white', 
                fontSize: 12, 
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {note.status}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {formatDate(note.created_at)}
            </Text>
          </View>

          {/* Visit Summary */}
          {note.visit_summary && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
                Visit Summary
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: '#333' }}>
                {note.visit_summary}
              </Text>
            </View>
          )}

          {/* SOAP Note Preview */}
          {note.soap_note && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                SOAP Note
              </Text>
              <View style={{ backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8 }}>
                {note.soap_note.subjective && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>
                      Subjective:
                    </Text>
                    <Text style={{ fontSize: 13, lineHeight: 18 }}>
                      {note.soap_note.subjective.slice(0, 100)}
                      {note.soap_note.subjective.length > 100 ? '...' : ''}
                    </Text>
                  </View>
                )}
                {note.soap_note.objective && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>
                      Objective:
                    </Text>
                    <Text style={{ fontSize: 13, lineHeight: 18 }}>
                      {note.soap_note.objective.slice(0, 100)}
                      {note.soap_note.objective.length > 100 ? '...' : ''}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Metadata */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#e9ecef'
          }}>
            <Text style={{ fontSize: 12, color: '#666' }}>
              AI Model: {note.ai_model_used || 'gpt-4o-mini'}
            </Text>
            {note.confidence_score && (
              <Text style={{ fontSize: 12, color: '#666' }}>
                Confidence: {Math.round(note.confidence_score * 100)}%
              </Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
} 