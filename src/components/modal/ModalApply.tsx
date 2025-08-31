import React, { useState, useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Modal, View, Text, TextInput, StyleSheet, Image } from 'react-native';
import AppButton from '../AppButton';
import { spacing } from '../../utils/spacing';
import { colors } from '../../utils/color';
import { getUserInfo } from '../../services/user';
import { useTranslation } from 'react-i18next';
import { Screen_Name } from '../../navigation/ScreenName';
import { navigate } from '../../navigation/RootNavigator';
import { applyJob } from '../../services/job';

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
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedCV, setSelectedCV] = useState<any>();

  useEffect(() => {
    fetchUserData();
    console.log('jobDetails', jobDetails);
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
    // Handle form submission
    try {
      console.log('Submitting form with:', {
        fullname,
        email,
        phoneNumber,
        selectedCV: selectedCV?.id,
        jobId: jobDetails?.id,
      });
      const res = await applyJob({
        JobId: jobDetails?.id,
        FullName: fullname,
        Email: email,
        PhoneNumber: phoneNumber,
        CvId: selectedCV?.id,
        CoverLetter: '',
        CvFile: selectedImage,
      });
      console.log(res);
    } catch (error) {}
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
          <AppButton
            title={
              selectedImage
                ? t('button.imagePicked')
                : `${t(`button.pickImage`)}`
            }
            customStyle={{ marginBottom: spacing.medium }}
            onPress={handleUploadImage}
          />
          {selectedImage && (
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
            <AppButton title="Xác nhận" onPress={() => handleSubmit()} />
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
