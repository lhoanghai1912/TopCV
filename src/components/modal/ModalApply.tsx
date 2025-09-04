import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../services/user';
import Toast from 'react-native-toast-message';
import { applyJob } from '../../services/job';
import { spacing } from '../../utils/spacing';
import { colors } from '../../utils/color';
import AppButton from '../AppButton';
import { navigate } from '../../navigation/RootNavigator';
import { Screen_Name } from '../../navigation/ScreenName';
import { navigate } from '../../navigation/RootNavigator';
import { applyJob } from '../../services/job';
import { useSelector } from 'react-redux';
import { setLoading } from '../../store/reducers/loadingSlice';
import Toast from 'react-native-toast-message';

interface ModalApplyProps {
  visible: boolean;
  onClose: () => void;
  jobDetails: any;
}

const ModalApply: React.FC<ModalApplyProps> = ({
  visible,
  onClose,
  jobDetails,
}) => {
  const { t } = useTranslation();
  const { token } = useSelector((state: any) => state.user);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCV, setSelectedCV] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [applyType, setApplyType] = useState<'cv' | 'upload'>('cv');
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  useEffect(() => {
    fetchUserData();
    console.log('jobDetails', jobDetails);
  }, []);
  const fetchUserData = async () => {
    if (token) {
      const res = await getUserInfo();
      console.log('userInfo', res);

      if (res) {
        setFullname(res.fullName);
        setEmail(res.email);
        setPhoneNumber(res.phoneNumber);
      }
    }
  };
  const handlePickPdf = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      if (res && res.length > 0) {
        setPdfUri(res[0].uri);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Toast.show({ type: 'error', text2: 'Không thể chọn file PDF!' });
      }
    }
  };
  const handleSubmit = async () => {
    // Chỉ cho chọn 1 hình thức: CV có sẵn hoặc upload file PDF
    if (applyType === 'cv' && !selectedCV) {
      Toast.show({ type: 'error', text2: 'Vui lòng chọn CV có sẵn!' });
      return;
    }
    if (applyType === 'upload' && !pdfUri) {
      Toast.show({ type: 'error', text2: 'Vui lòng chọn file PDF!' });
      return;
    }
    try {
      setLoading(true);
      const start = Date.now();
      let res;
      try {
        res = await applyJob({
          JobId: jobDetails?.id,
          FullName: fullname,
          Email: email,
          PhoneNumber: phoneNumber,
          CvId: applyType === 'cv' ? selectedCV?.id : undefined,
          CoverLetter: '',
          CvFile:
            applyType === 'upload' && pdfUri
              ? { uri: pdfUri, type: 'application/pdf', name: 'file.pdf' }
              : undefined,
        });
      } finally {
        const elapsed = Date.now() - start;
        if (elapsed < 500) {
          await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
        }
      }
      console.log(res);
      if (res.success)
        Toast.show({
          type: 'success',
          text2: `${t('message.apply_success')}`,
        });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View>
            <Text style={AppStyles.label}>{t('label.fullname')}</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullname}
              onChangeText={setFullname}
            />
          </View>
          <View>
            <Text style={AppStyles.label}>{t('label.email')}</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View>
            <Text style={AppStyles.label}>{t('label.phone')}</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
          {/* Radio chọn hình thức apply */}
          <View style={{ flexDirection: 'row', marginBottom: spacing.medium }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 16,
              }}
              onPress={() => setApplyType('cv')}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 6,
                }}
              >
                {applyType === 'cv' && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </View>
              <Text>{t('button.pickCv')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setApplyType('upload')}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 6,
                }}
              >
                {applyType === 'upload' && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </View>
              <Text>{t('button.pickFile') || 'Chọn file PDF'}</Text>
            </TouchableOpacity>
          </View>
          {/* Chọn CV có sẵn */}
          {applyType === 'cv' && (
            <AppButton
              title={selectedCV?.title || `${t(`button.pickCv`)}`}
              customStyle={{ marginBottom: spacing.medium }}
              onPress={() => {
                navigate(Screen_Name.CV_Screen, {
                  pickMode: true,
                  onPickCV: cvSelected => {
                    setSelectedCV(cvSelected);
                  },
                });
              }}
            />
          )}
          {/* Upload file PDF */}
          {applyType === 'upload' && (
            <AppButton
              title={
                pdfUri
                  ? 'Đã chọn file PDF'
                  : `${t('button.pickFile') || 'Chọn file PDF'}`
              }
              customStyle={{ marginBottom: spacing.medium }}
              onPress={handlePickPdf}
            />
          )}
          {applyType === 'upload' && pdfUri && (
            <View style={{ height: 300, marginBottom: spacing.medium }}>
              <Pdf source={{ uri: pdfUri }} style={{ flex: 1 }} />
            </View>
          )}
          <View style={styles.buttonRow}>
            <AppButton title="Hủy" onPress={onClose} />
            <AppButton title="Xác nhận" onPress={() => handleSubmit()} />
          </View>
        </View>
      </View>
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      )}
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ModalApply;
