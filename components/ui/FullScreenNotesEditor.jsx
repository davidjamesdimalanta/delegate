import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function FullScreenNotesEditor({ 
  visible, 
  onClose, 
  onSave,
  patient,
  initialNotes = ''
}) {
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState(initialNotes);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textInputRef = useRef(null);
  
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const outlineColor = useThemeColor({}, 'outline');

  // Update notes when initialNotes change
  useEffect(() => {
    setNotes(initialNotes);
    setHasUnsavedChanges(false);
  }, [initialNotes]);

  // Focus text input when modal opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  const handleNotesChange = (text) => {
    setNotes(text);
    setHasUnsavedChanges(text !== initialNotes);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(notes);
    }
    setHasUnsavedChanges(false);
    handleClose();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      // Could add an alert here asking to confirm losing changes
      setNotes(initialNotes);
      setHasUnsavedChanges(false);
    }
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor }]}
      >
        {/* Status bar spacing */}
        <View style={{ height: insets.top }} />

        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor: surfaceColor, borderBottomColor: outlineColor }]}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <ThemedText variant="bodyLarge" style={{ color: onSurfaceColor }}>
              Cancel
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <ThemedText variant="titleMedium" style={{ color: onSurfaceColor }}>
              Patient Notes
            </ThemedText>
            {patient && (
              <ThemedText variant="bodySmall" style={{ color: onSurfaceColor, opacity: 0.7 }}>
                {patient.name} ({patient.id})
              </ThemedText>
            )}
          </View>

          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.headerButton, styles.saveButton, { backgroundColor: primaryColor }]}
            disabled={!hasUnsavedChanges && notes === initialNotes}
          >
            <ThemedText variant="bodyLarge" style={{ color: 'white', fontWeight: '600' }}>
              Save
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Text Input Area */}
        <View style={styles.textContainer}>
          <TextInput
            ref={textInputRef}
            style={[
              styles.textInput,
              {
                color: onSurfaceColor,
                backgroundColor: surfaceColor,
                borderColor: outlineColor,
              }
            ]}
            value={notes}
            onChangeText={handleNotesChange}
            placeholder="Add notes about the patient's condition, treatment, observations, or any relevant information..."
            placeholderTextColor={onSurfaceColor + '60'}
            multiline
            textAlignVertical="top"
            maxLength={2000}
            returnKeyType="default"
            blurOnSubmit={false}
            scrollEnabled={true}
          />
        </View>

        {/* Footer with character count and status */}
        <ThemedView style={[styles.footer, { backgroundColor: surfaceColor, borderTopColor: outlineColor }]}>
          <View style={styles.footerContent}>
            <ThemedText variant="labelSmall" style={{ color: onSurfaceColor, opacity: 0.6 }}>
              {notes.length}/2000 characters
            </ThemedText>
            {hasUnsavedChanges && (
              <ThemedText variant="labelSmall" style={{ color: primaryColor, fontStyle: 'italic' }}>
                Unsaved changes
              </ThemedText>
            )}
          </View>
        </ThemedView>

        {/* Bottom safe area */}
        <View style={{ height: insets.bottom }} />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  headerButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  saveButton: {
    // Primary color background applied inline
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  textContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}); 