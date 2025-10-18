/**
 * PickerSelect Component
 * Custom select/picker control using Modal for reliable dropdown behavior
 */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';

export interface PickerSelectOption {
  label: string;
  value: string | number;
}

interface PickerSelectProps {
  options: PickerSelectOption[];
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Stylized select control using Modal dialog
 * Provides reliable iOS/Android-style picker with proper reopen behavior
 */
export function PickerSelect({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
}: PickerSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useTheme();

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  const handleSelect = (value: string | number) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <>
      {/* Button/Trigger */}
      <Pressable
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        style={({ pressed }) => [
          styles.triggerButton,
          pressed && !disabled && styles.triggerButtonPressed,
          disabled && styles.triggerButtonDisabled,
        ]}
      >
        <Text
          style={[
            styles.triggerLabel,
            disabled && styles.triggerLabelDisabled,
          ]}
        >
          {selectedLabel}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </Pressable>

      {/* Modal Picker */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select an option</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            <Divider />
            <ScrollView style={styles.optionsList}>
              {options.map((option, index) => {
                const isSelected = option.value === selectedValue;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    style={({ pressed }) => [
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                      pressed && styles.optionItemPressed,
                      index < options.length - 1 && styles.optionItemBorder,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  /* Trigger Button Styles */
  triggerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(74, 189, 172, 0.35)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  triggerButtonPressed: {
    backgroundColor: 'rgba(74, 189, 172, 0.1)',
  },
  triggerButtonDisabled: {
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderColor: 'rgba(200, 200, 200, 0.3)',
  },
  triggerLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F4D47',
  },
  triggerLabelDisabled: {
    color: 'rgba(100, 100, 100, 0.6)',
  },
  chevron: {
    fontSize: 12,
    color: '#1F4D47',
    marginLeft: 8,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F4D47',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
    paddingHorizontal: 8,
  },
  optionsList: {
    maxHeight: 400,
  },

  /* Option Item Styles */
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
  },
  optionItemPressed: {
    backgroundColor: 'rgba(74, 189, 172, 0.05)',
  },
  optionItemSelected: {
    backgroundColor: 'rgba(74, 189, 172, 0.08)',
  },
  optionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
  },
  optionLabelSelected: {
    fontWeight: '600',
    color: '#4ABDAC',
  },
  checkmark: {
    fontSize: 18,
    color: '#4ABDAC',
    fontWeight: '600',
    marginLeft: 12,
  },
});
