import React, { useState, useEffect, use } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AppButton from '../AppButton';
import { spacing } from '../../utils/spacing';
import { colors } from '../../utils/color';
import { getUserInfo } from '../../services/user';
import { useTranslation } from 'react-i18next';

interface ModalApplyProps {
  visible: boolean;
  onClose: () => void;
}

const ModalApply: React.FC<ModalApplyProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    const res = await getUserInfo();
    console.log('userInfo', res);

    if (res) {
      setFullname(res.fullName);
      setEmail(res.email);
      setPhoneNumber(res.phoneNumber);
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Apply for Job</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullname}
            onChangeText={setFullname}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <AppButton
            title={`${t(`button.pickCv`)}`}
            customStyle={{ marginBottom: spacing.medium }}
            onPress={() => {}}
          />
          <AppButton
            title={`${t(`button.pickImage`)}`}
            customStyle={{ marginBottom: spacing.medium }}
            onPress={() => {}}
          />
          <View style={styles.buttonRow}>
            <AppButton title="Hủy" onPress={onClose} />
            <AppButton title="Xác nhận" onPress={() => {}} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.large,
    width: '90%',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: spacing.small,
    marginBottom: spacing.medium,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  cvButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  cvButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ModalApply;
