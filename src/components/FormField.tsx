import React, {memo} from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {colors} from '../styles/colors';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
}

const FormField = ({label, error, touched, ...inputProps}: Props) => {
  const showError = touched && !!error;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, showError && styles.inputError]}
        placeholderTextColor={colors.textLight}
        {...inputProps}
      />
      {showError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default memo(FormField);

const styles = StyleSheet.create({
  wrapper: {marginBottom: 14},
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
});
