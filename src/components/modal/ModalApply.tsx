import React, { useState, useEffect, useCallback } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AppButton from '../AppButton';
import { spacing } from '../../utils/spacing';
import { colors } from '../../utils/color';
import { getUserInfo } from '../../services/user';
import { Screen_Name } from '../../navigation/ScreenName';
import { navigate } from '../../navigation/RootNavigator';
import { applyJob } from '../../services/job';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import AppStyles from '../AppStyle';
import { useTranslation } from 'react-i18next';
import { pick, keepLocalCopy } from '@react-native-documents/picker';

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
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedCV, setSelectedCV] = useState<any>();
  const [selectedType, setSelectedType] = useState<'cv' | 'image' | 'pdf'>(
    'cv',
  );
  const [selectedPDF, setSelectedPDF] = useState<any>();
  const [loading, setLoading] = useState(false);

  const handleUploadPDF = async () => {
    try {
      const result = await pick({
        type: 'application/pdf',
        multiple: false,
      });
      if (result && result.length > 0) {
        setSelectedPDF(result[0]);
      }
    } catch (err) {
      console.warn('PDF pick error:', err);
    }
  };

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
  const handleUploadImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    if (result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };
  const handleSubmit = async () => {
    console.log('Submitting form with:', {
      fullname,
      email,
      phoneNumber,
      selectedCV: selectedCV?.id,
      selectedImage,
      jobId: jobDetails?.id,
      selectedType,
      selectedPDF,
    });
    setLoading(true);
    const start = Date.now();
    let res;
    try {
      try {
        let payload;
        if (selectedType === 'cv') {
          payload = {
            JobId: jobDetails?.id,
            FullName: fullname,
            Email: email,
            PhoneNumber: phoneNumber,
            CvId: selectedCV?.id,
            CoverLetter: '',
          };
        } else if (selectedType === 'image') {
          payload = {
            JobId: jobDetails?.id,
            FullName: fullname,
            Email: email,
            PhoneNumber: phoneNumber,
            CvId: undefined,
            CoverLetter: '',
            CvFile: selectedImage,
          };
        } else if (selectedType === 'pdf') {
          payload = {
            JobId: jobDetails?.id,
            FullName: fullname,
            Email: email,
            PhoneNumber: phoneNumber,
            CvId: undefined,
            CoverLetter: '',
            CvFile: selectedPDF,
          };
        }
        res = await applyJob(payload);
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
          <View style={{ marginBottom: spacing.medium }}>
            {/* Radio chọn CV */}
            <TouchableOpacity
              onPress={() => setSelectedType('cv')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: spacing.small,
              }}
            >
              <Text
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  backgroundColor:
                    selectedType === 'cv' ? colors.primary : colors.white,
                }}
              />
              <Text
                style={[AppStyles.text, { marginHorizontal: spacing.small }]}
              >
                {t('button.pickCv')}
              </Text>
              <AppButton
                title={selectedCV?.title || `${t(`button.pickCv`)}`}
                customStyle={{
                  opacity: selectedType === 'cv' ? 1 : 0.5,
                }}
                onPress={() => {
                  if (selectedType === 'cv') {
                    navigate(Screen_Name.CV_Screen, {
                      pickMode: true,
                      onPickCV: cvSelected => {
                        setSelectedCV(cvSelected);
                      },
                    });
                  }
                }}
                disabled={selectedType !== 'cv'}
              />
            </TouchableOpacity>
            {/* Radio chọn Ảnh */}
            <TouchableOpacity
              onPress={() => setSelectedType('image')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: spacing.small,
              }}
            >
              <Text
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  backgroundColor:
                    selectedType === 'image' ? colors.primary : colors.white,
                }}
              />
              <Text
                style={[AppStyles.text, { marginHorizontal: spacing.small }]}
              >
                {t('button.pickImage')}
              </Text>
              <AppButton
                title={
                  selectedImage
                    ? t('button.imagePicked')
                    : `${t(`button.pickImage`)}`
                }
                customStyle={{
                  opacity: selectedType === 'image' ? 1 : 0.5,
                }}
                onPress={() => {
                  if (selectedType === 'image') {
                    handleUploadImage();
                  }
                }}
                disabled={selectedType !== 'image'}
              />
            </TouchableOpacity>
            {/* Radio chọn PDF */}
            <TouchableOpacity
              onPress={() => setSelectedType('pdf')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: spacing.small,
              }}
            >
              <Text
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  backgroundColor:
                    selectedType === 'pdf' ? colors.primary : colors.white,
                }}
              />
              <Text
                style={[AppStyles.text, { marginHorizontal: spacing.small }]}
              >
                Chọn file PDF
              </Text>
              <AppButton
                title={
                  selectedPDF
                    ? selectedPDF.name.length > 20
                      ? selectedPDF.name.slice(0, 20) + '...'
                      : selectedPDF.name
                    : 'Chọn file PDF'
                }
                customStyle={{
                  opacity: selectedType === 'pdf' ? 1 : 0.5,
                }}
                onPress={() => {
                  if (selectedType === 'pdf') {
                    handleUploadPDF();
                  }
                }}
                disabled={selectedType !== 'pdf'}
              />
            </TouchableOpacity>
          </View>
          {selectedImage && selectedType === 'image' && (
            <View
              style={{ alignItems: 'center', marginBottom: spacing.medium }}
            >
              <Image
                source={{ uri: selectedImage.uri }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
            </View>
          )}
          <View style={styles.buttonRow}>
            <AppButton title="Hủy" onPress={onClose} />
            <AppButton title="Xác nhận" onPress={handleSubmit} />
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

// ...existing code...
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
