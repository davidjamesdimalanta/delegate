import ClinicalNotesDemo from '@/components/demo/ClinicalNotesDemo';
import {
    Card,
    Spacing,
    ThemedText,
    ThemedView,
    ThemeSettings
} from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [showClinicalNotes, setShowClinicalNotes] = useState(false);

  if (showClinicalNotes) {
    return (
      <ThemedView style={{ flex: 1 }}>
        {/* Header with Back Button */}
        <ThemedView 
          style={{
            padding: Spacing.md,
            paddingTop: insets.top + Spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#e9ecef',
          }}
        >
          <Pressable
            onPress={() => setShowClinicalNotes(false)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: Spacing.xs,
              marginRight: Spacing.sm,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#007bff" />
          </Pressable>
          <ThemedText variant="headlineMedium">
            Clinical Notes Demo
          </ThemedText>
        </ThemedView>
        
        {/* Clinical Notes Demo Content */}
        <ThemedView style={{ flex: 1 }}>
          <ClinicalNotesDemo patientId="MRN-24680" />
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView 
        style={{
          padding: Spacing.md,
          paddingTop: insets.top + Spacing.md,
        }}
      >
        <ThemedText variant="headlineMedium">
          Settings
        </ThemedText>
      </ThemedView>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: Spacing.md,
          paddingBottom: insets.bottom + 90 // Tab bar height + extra padding
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Settings Card */}
        <Card variant="elevated" style={{ marginBottom: Spacing.lg }}>
          <ThemeSettings style={{}} />
        </Card>

        {/* Clinical Notes Demo Card */}
        <Card variant="elevated" style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📋 Clinical Notes
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
            View and manage clinical documentation for hospice and palliative care patients.
          </ThemedText>
          <ThemedText variant="bodySmall" style={{ marginBottom: Spacing.md, opacity: 0.7 }}>
            Features: SOAP note display, visit summaries, note status tracking, and AI-generated clinical documentation.
          </ThemedText>
          
          <Pressable
            onPress={() => setShowClinicalNotes(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#007bff',
              paddingVertical: Spacing.sm,
              paddingHorizontal: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginTop: Spacing.sm
            }}
          >
            <Ionicons name="document-text" size={20} color="white" style={{ marginRight: Spacing.xs }} />
            <ThemedText 
              variant="labelLarge" 
              style={{ color: 'white', fontWeight: '600' }}
            >
              View Clinical Notes
            </ThemedText>
          </Pressable>
        </Card>

        {/* App Information */}
        <Card variant="outlined" style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            About Medical Delegate
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
            Version: 1.0.0
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
            A comprehensive medical task delegation system designed for healthcare professionals.
          </ThemedText>
          <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
            Built with React Native, Expo, and Material Design principles.
          </ThemedText>
        </Card>

        {/* Design System Information */}
        <Card variant="filled" style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Design System Features
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
            • Material Design 3 color system
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
            • Apple Human Interface Guidelines typography
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
            • Medical-specific color priorities and status indicators
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
            • Consistent spacing and elevation system
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
            • Accessibility-focused design tokens
          </ThemedText>
          <ThemedText variant="bodyMedium">
            • Persistent theme preferences with system integration
          </ThemedText>
        </Card>

        {/* Medical Color Priorities Demo */}
        <Card variant="elevated" style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Medical Priority Colors
          </ThemedText>
          <ThemedView style={{ gap: Spacing.sm }}>
            <ThemedView style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: Spacing.sm,
              borderRadius: Spacing.borderRadius.sm,
              borderLeftWidth: 4,
              borderLeftColor: '#D32F2F',
              backgroundColor: '#D32F2F20',
            }}>
              <ThemedText variant="labelMedium" style={{ color: '#D32F2F' }}>
                CRITICAL
              </ThemedText>
              <ThemedText variant="bodySmall" style={{ marginLeft: Spacing.sm }}>
                Immediate attention required
              </ThemedText>
            </ThemedView>

            <ThemedView style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: Spacing.sm,
              borderRadius: Spacing.borderRadius.sm,
              borderLeftWidth: 4,
              borderLeftColor: '#F57C00',
              backgroundColor: '#F57C0020',
            }}>
              <ThemedText variant="labelMedium" style={{ color: '#F57C00' }}>
                HIGH
              </ThemedText>
              <ThemedText variant="bodySmall" style={{ marginLeft: Spacing.sm }}>
                High priority task
              </ThemedText>
            </ThemedView>

            <ThemedView style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: Spacing.sm,
              borderRadius: Spacing.borderRadius.sm,
              borderLeftWidth: 4,
              borderLeftColor: '#1976D2',
              backgroundColor: '#1976D220',
            }}>
              <ThemedText variant="labelMedium" style={{ color: '#1976D2' }}>
                MEDIUM
              </ThemedText>
              <ThemedText variant="bodySmall" style={{ marginLeft: Spacing.sm }}>
                Standard priority
              </ThemedText>
            </ThemedView>

            <ThemedView style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: Spacing.sm,
              borderRadius: Spacing.borderRadius.sm,
              borderLeftWidth: 4,
              borderLeftColor: '#388E3C',
              backgroundColor: '#388E3C20',
            }}>
              <ThemedText variant="labelMedium" style={{ color: '#388E3C' }}>
                LOW
              </ThemedText>
              <ThemedText variant="bodySmall" style={{ marginLeft: Spacing.sm }}>
                Low priority task
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </Card>
      </ScrollView>
    </ThemedView>
  );
} 