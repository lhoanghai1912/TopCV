import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import AppButton from '../AppButton';
import { useDispatch } from 'react-redux';
import { setVerificationToken } from '../../store/reducers/userSlice';
import { enterOtp } from '../../services/auth';

interface EnterOtpProp {
  visible: boolean;
  onClose: () => void;
  onSuccess: (otpString: string) => void;
  contact: string;
}

const ModalEnterOtp: React.FC<EnterOtpProp> = ({
  visible,
  onClose,
  onSuccess,
  contact,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false); // Lỗi nếu mã OTP không hợp lệ
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Lưu trữ 6 ký tự OTP
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    setOtp(['', '', '', '', '', '']);
  }, [visible]);
  const handleChange = (text: string, index: number) => {
    if (/^[0-9]$/.test(text) || text === '') {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      try {
        console.log('📤 Gửi OTP verify:', {
          contact,
          otp: otpString,
        });
        const otpRes = await enterOtp(contact, otpString);
        dispatch(
          setVerificationToken({ verificationToken: otpRes.verificationToken }),
        );
        console.log('otpRes', otpRes);

        onSuccess(otpString);
      } catch (error) {
        console.log('error', error);
      }
    } else {
      setError(true); // Nếu mã OTP không hợp lệ, hiển thị lỗi
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          // alignItems: 'center',
          backgroundColor: 'rgba(52, 52, 52,0.5)',
          paddingHorizontal: 13,
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t('message.enter_otp')}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  inputsRef.current[index] = ref;
                }}
                style={[styles.otpInput, error && styles.errorInput]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
              />
            ))}
          </View>
          {error && <Text style={styles.errorText}>{`abc`}</Text>}
          <View
            style={{
              marginVertical: 9,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignSelf: 'center',
              width: '95%',
            }}
          >
            <AppButton
              title="Hủy bỏ"
              onPress={onClose}
              customStyle={[{ width: '30%' }]}
            />
            <AppButton
              title="Xác nhận"
              onPress={handleSubmit}
              customStyle={[{ width: '30%' }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 5,
    marginLeft: 9,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ModalEnterOtp;
