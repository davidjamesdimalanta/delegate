import {
    Card,
    Spacing,
    ThemedText,
    ThemedView,
    ThemeSettings
} from '@/components/ui';
import { ScrollView } from 'react-native';

export default function SettingsScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView 
        style={{
          padding: Spacing.md,
          paddingTop: Spacing.xl,
        }}
      >
        <ThemedText variant="headlineMedium">
          Settings
        </ThemedText>
      </ThemedView>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Settings Card */}
        <Card variant="elevated" style={{ marginBottom: Spacing.lg }}>
          <ThemeSettings />
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

        {/* Bottom spacing */}
        <ThemedView style={{ height: Spacing.xl }} />
      </ScrollView>
    </ThemedView>
  );
} 