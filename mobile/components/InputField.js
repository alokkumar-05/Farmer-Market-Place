import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

/**
 * Reusable Input Field Component
 * @param {String} label - Input label
 * @param {String} value - Input value
 * @param {Function} onChangeText - Handler for text change
 * @param {String} placeholder - Placeholder text
 * @param {Boolean} secureTextEntry - Hide text for passwords
 * @param {String} keyboardType - Keyboard type
 * @param {Boolean} multiline - Allow multiple lines
 * @param {Object} style - Additional styles
 */
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});

export default InputField;
