// src/screens/CreateCV/EditCVScreen.tsx
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { spacing } from '../../../utils/spacing';
import { colors } from '../../../utils/color';
import { Fonts } from '../../../utils/fontSize';
import AppButton from '../../../components/AppButton';
import NavBar from '../../../components/Navbar';
import { ScrollView } from 'react-native-gesture-handler';

const formatDate = (d: Date) => {
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(-2);
  return `${month}/${year}`;
};

const EditCVScreen = ({ route, navigation }) => {
  const { title, fields, onSave, initialData } = route.params;

  // Xử lý initialData: nếu là mảng thì dùng luôn, nếu là object thì bọc vào mảng, nếu rỗng thì [{}]
  let initialForms: Record<string, string>[] = [{}];
  if (initialData) {
    if (Array.isArray(initialData)) {
      initialForms = initialData.map(item => ({ ...item }));
    } else if (typeof initialData === 'object') {
      initialForms = [{ ...initialData }];
    } else if (typeof initialData === 'string') {
      initialForms = [{ [fields[0]?.key || 'value']: initialData }];
    }
  }
  const [forms, setForms] = useState<Record<string, string>[]>(initialForms);
  const [datePickerFor, setDatePickerFor] = useState<{
    idx: number;
    key: string;
  } | null>(null);
  const [date, setDate] = useState<Date>(new Date());

  const setValue = (idx: number, key: string, value: string) => {
    setForms(prev => {
      const newForms = [...prev];
      newForms[idx] = { ...newForms[idx], [key]: value };
      return newForms;
    });
  };

  // Chỉ cho phép thêm bản ghi mới nếu không phải card hoặc userProfile
  const isSingleRecordSection =
    title === 'Card' || title === 'Thông tin cá nhân';
  const handleAdd = () => {
    if (!isSingleRecordSection) {
      setForms(prev => [...prev, {}]);
    }
  };

  const handleRemove = idx => {
    setForms(prev => prev.filter((_, i) => i !== idx));
  };

  const isDefaultOrEmpty = (value: string, defaultValue: string) => {
    return !value || value === defaultValue;
  };

  const handleSave = () => {
    // Validate tất cả các form
    let invalid = false;
    for (let form of forms) {
      for (let field of fields) {
        const val = form[field.key];
        if (isDefaultOrEmpty(val, field.placeholder || '')) {
          invalid = true;
          break;
        }
      }
      if (invalid) break;
    }
    if (invalid) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập đầy đủ thông tin hợp lệ!',
      });
      return;
    }
    // Nếu là mục tiêu nghề nghiệp thì chỉ lưu object đầu tiên
    if (title === 'Mục tiêu nghề nghiệp') {
      onSave(forms[0]);
    } else {
      onSave(forms);
    }

    navigation.goBack();
  };

  const isDateField = (key: string) => {
    return (
      key.toLowerCase().includes('start') ||
      key.toLowerCase().includes('end') ||
      key.toLowerCase() === 'time' ||
      key.toLowerCase() === 'birthday'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <NavBar title={title} onPress={() => navigation.goBack()} />
        <View style={styles.body}>
          {forms.map((form, idx) => (
            <View key={idx} style={styles.recordCard}>
              <TouchableOpacity
                style={[
                  styles.removeBtn,
                  { display: forms.length === 1 ? 'none' : 'flex' },
                ]}
                onPress={() => handleRemove(idx)}
              >
                <Text style={{ color: 'red', fontWeight: 'bold' }}>🗑️</Text>
              </TouchableOpacity>
              {fields.map((field, fidx) => {
                const isDate = isDateField(field.key);
                // Custom input cho birthday và gender
                if (field.key === 'birthday') {
                  return (
                    <View key={fidx} style={styles.inputWrap}>
                      <Text style={styles.inputLabel}>{field.label}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          setDatePickerFor({ idx, key: field.key })
                        }
                      >
                        <TextInput
                          style={styles.input}
                          value={form[field.key] || ''}
                          editable={false}
                          placeholder="Chọn ngày sinh"
                        />
                      </TouchableOpacity>
                      {datePickerFor &&
                        datePickerFor.idx === idx &&
                        datePickerFor.key === field.key && (
                          <View
                            style={{ backgroundColor: '#fff', borderRadius: 8 }}
                          >
                            <DateTimePicker
                              value={
                                form[field.key]
                                  ? new Date(form[field.key])
                                  : new Date()
                              }
                              mode="date"
                              display="default"
                              onChange={(event, selectedDate) => {
                                setDatePickerFor(null);
                                if (selectedDate) {
                                  const d = new Date(selectedDate);
                                  const dateStr = `${d
                                    .getDate()
                                    .toString()
                                    .padStart(2, '0')}/${(d.getMonth() + 1)
                                    .toString()
                                    .padStart(2, '0')}/${d.getFullYear()}`;
                                  setValue(idx, field.key, dateStr);
                                }
                              }}
                              maximumDate={new Date()}
                              minimumDate={new Date(1950, 0, 1)}
                            />
                          </View>
                        )}
                    </View>
                  );
                }
                if (field.key === 'gender') {
                  return (
                    <View key={fidx} style={styles.inputWrap}>
                      <Text style={styles.inputLabel}>{field.label}</Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 6,
                        }}
                      >
                        <Picker
                          selectedValue={form[field.key] || ''}
                          onValueChange={value =>
                            setValue(idx, field.key, value)
                          }
                        >
                          <Picker.Item label="Chọn giới tính" value="" />
                          <Picker.Item label="Nam" value="Nam" />
                          <Picker.Item label="Nữ" value="Nữ" />
                          <Picker.Item label="Khác" value="Khác" />
                        </Picker>
                      </View>
                    </View>
                  );
                }
                // ...các input khác giữ nguyên...
                return (
                  <View key={fidx} style={styles.inputWrap}>
                    <Text style={styles.inputLabel}>{field.label}</Text>
                    {isDate ? (
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            setDatePickerFor({ idx, key: field.key })
                          }
                        >
                          <TextInput
                            style={styles.input}
                            value={form[field.key] || ''}
                            editable={false}
                            placeholder="Chọn ngày"
                          />
                        </TouchableOpacity>
                        {datePickerFor &&
                          datePickerFor.idx === idx &&
                          datePickerFor.key === field.key && (
                            <MonthPicker
                              onChange={(event, selectedDate) => {
                                setDatePickerFor(null);
                                if (selectedDate) {
                                  setDate(selectedDate);
                                  setValue(
                                    idx,
                                    field.key,
                                    formatDate(selectedDate),
                                  );
                                }
                              }}
                              value={date}
                              minimumDate={new Date(1950, 0)}
                              maximumDate={new Date(Date.now())}
                              locale="vi"
                            />
                          )}
                      </View>
                    ) : (
                      <TextInput
                        style={styles.input}
                        value={form[field.key] || ''}
                        onChangeText={text => setValue(idx, field.key, text)}
                        placeholder={field.placeholder}
                        multiline={true}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          {title !== 'Mục tiêu nghề nghiệp' && !isSingleRecordSection && (
            <AppButton
              customStyle={{ width: '48%' }}
              title={`Thêm ${title.toLowerCase()}`}
              onPress={handleAdd}
            />
          )}
          <AppButton
            customStyle={{
              width:
                title !== 'Mục tiêu nghề nghiệp' && !isSingleRecordSection
                  ? '48%'
                  : '100%',
            }}
            title="Lưu"
            onPress={handleSave}
          />
        </View>
      </ScrollView>
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
  body: { padding: spacing.large, backgroundColor: colors.white },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
    padding: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
  },
  formCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: 16,
  },
  inputWrap: { marginBottom: spacing.medium },
  inputLabel: { marginBottom: 4, fontWeight: '600' },
  inputValue: { fontSize: Fonts.normal, color: '#222', marginBottom: 2 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: spacing.medium,
    borderRadius: 6,
    backgroundColor: colors.white,
    fontSize: Fonts.normal,
    flexWrap: 'wrap',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.medium,
    borderTopWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
});

export default EditCVScreen;
