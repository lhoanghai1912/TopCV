// src/screens/CreateCV/EditCVScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { spacing } from '../../../utils/spacing';
import { colors } from '../../../utils/color';
import { Fonts } from '../../../utils/fontSize';
import AppButton from '../../../components/AppButton';

const formatDate = (d: Date) => {
  return d.toISOString().slice(0, 10); // yyyy-mm-dd
};

const EditCVScreen = ({ route, navigation }) => {
  const { title, fields, onSave } = route.params;

  const [form, setForm] = useState<Record<string, string>>({});
  const [datePickerFor, setDatePickerFor] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());

  const setValue = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form); // gọi onSave từ màn trước
    navigation.goBack(); // trở lại màn trước
  };

  const isDateField = (key: string) => {
    return (
      key.toLowerCase().includes('start') ||
      key.toLowerCase().includes('end') ||
      key.toLowerCase() === 'time'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>{'<'} Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.body}>
        {fields.map((field, index) => {
          const isDate = isDateField(field.key);

          return (
            <View key={index} style={styles.inputWrap}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              {isDate ? (
                <View>
                  <TouchableOpacity onPress={() => setDatePickerFor(field.key)}>
                    <TextInput
                      style={styles.input}
                      value={form[field.key] || ''}
                      editable={false}
                      placeholder="Chọn ngày"
                    />
                  </TouchableOpacity>
                  {datePickerFor === field.key && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={(e, selectedDate) => {
                        setDatePickerFor(null);
                        if (selectedDate) {
                          setDate(selectedDate);
                          setValue(field.key, formatDate(selectedDate));
                        }
                      }}
                    />
                  )}
                </View>
              ) : (
                <TextInput
                  style={styles.input}
                  value={form[field.key] || ''}
                  onChangeText={text => setValue(field.key, text)}
                  placeholder={field.placeholder}
                />
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton title="Lưu" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
  },
  backBtn: { fontSize: Fonts.normal, color: colors.primary },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: Fonts.large,
    fontWeight: 'bold',
  },
  body: { padding: spacing.large },
  inputWrap: { marginBottom: spacing.medium },
  inputLabel: { marginBottom: 4, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: spacing.medium,
    borderRadius: 6,
    backgroundColor: colors.white,
    fontSize: Fonts.normal,
  },
  footer: {
    padding: spacing.medium,
    borderTopWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
});

export default EditCVScreen;
