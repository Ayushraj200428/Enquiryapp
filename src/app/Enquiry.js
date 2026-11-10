import { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert, KeyboardAvoidingView, Platform, Image, TouchableOpacity } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Appbar,
  HelperText,
  RadioButton,
  Divider,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function EnquiryScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [enquiryType, setEnquiryType] = useState('general');
  const [academicYear, setAcademicYear] = useState('');
  const [courseName, setCourseName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickPhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Enter a valid 10-digit number';
    if (!dob.trim()) newErrors.dob = 'Date of birth is required';
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) newErrors.dob = 'Enter a valid date (DD/MM/YYYY)';
    if (!gender) newErrors.gender = 'Please select a gender';
    if (!academicYear.trim()) newErrors.academicYear = 'Academic year is required';
    else if (!/^\d{4}-\d{4}$/.test(academicYear)) newErrors.academicYear = 'Enter a valid year (e.g. 2024-2025)';
    if (!courseName.trim()) newErrors.courseName = 'Course name is required';
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      Alert.alert(
        'Enquiry Submitted!',
        `Thank you ${name}, we will get back to you soon.`,
        [{ text: 'OK', onPress: () => resetForm() }]
      );
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDob('');
    setGender('');
    setAcademicYear('');
    setCourseName('');
    setSubject('');
    setMessage('');
    setEnquiryType('general');
    setPhoto(null);
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Appbar.Header>
        <Appbar.Content title="Enquiry Form" />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Student Information
        </Text>

        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={handlePhotoUpload} style={styles.photoButton}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderIcon}>📷</Text>
                <Text style={styles.photoPlaceholderText}>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {photo && (
            <Button
              mode="text"
              onPress={handlePhotoUpload}
              compact
              style={styles.changePhotoBtn}
            >
              Change Photo
            </Button>
          )}
        </View>

        <TextInput
          label="Full Name *"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          error={!!errors.name}
        />
        <HelperText type="error" visible={!!errors.name}>
          {errors.name}
        </HelperText>

        <TextInput
          label="Email Address *"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          error={!!errors.email}
        />
        <HelperText type="error" visible={!!errors.email}>
          {errors.email}
        </HelperText>

        <TextInput
          label="Phone Number *"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
          error={!!errors.phone}
        />
        <HelperText type="error" visible={!!errors.phone}>
          {errors.phone}
        </HelperText>

        <TextInput
          label="Date of Birth * (DD/MM/YYYY)"
          value={dob}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9]/g, '');
            let formatted = cleaned;
            if (cleaned.length >= 3 && cleaned.length <= 4) {
              formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
            } else if (cleaned.length >= 5) {
              formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
            }
            setDob(formatted);
          }}
          mode="outlined"
          keyboardType="numeric"
          maxLength={10}
          placeholder="DD/MM/YYYY"
          style={styles.input}
          error={!!errors.dob}
        />
        <HelperText type="error" visible={!!errors.dob}>
          {errors.dob}
        </HelperText>

        <Text variant="bodyMedium" style={styles.radioLabel}>
          Gender *
        </Text>
        <RadioButton.Group onValueChange={setGender} value={gender}>
          <View style={styles.radioRow}>
            <RadioButton.Item label="Male" value="male" />
            <RadioButton.Item label="Female" value="female" />
            <RadioButton.Item label="Other" value="other" />
          </View>
        </RadioButton.Group>
        <HelperText type="error" visible={!!errors.gender}>
          {errors.gender}
        </HelperText>

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Course Details
        </Text>

        <TextInput
          label="Academic Year * (e.g. 2024-2025)"
          value={academicYear}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9-]/g, '');
            setAcademicYear(cleaned);
          }}
          mode="outlined"
          keyboardType="numeric"
          maxLength={9}
          placeholder="YYYY-YYYY"
          style={styles.input}
          error={!!errors.academicYear}
        />
        <HelperText type="error" visible={!!errors.academicYear}>
          {errors.academicYear}
        </HelperText>

        <TextInput
          label="Course Name *"
          value={courseName}
          onChangeText={setCourseName}
          mode="outlined"
          style={styles.input}
          error={!!errors.courseName}
        />
        <HelperText type="error" visible={!!errors.courseName}>
          {errors.courseName}
        </HelperText>

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Enquiry Details
        </Text>

        <Text variant="bodyMedium" style={styles.radioLabel}>
          Enquiry Type *
        </Text>
        <RadioButton.Group
          onValueChange={setEnquiryType}
          value={enquiryType}
        >
          <View style={styles.radioRow}>
            <RadioButton.Item label="General" value="general" />
            <RadioButton.Item label="Support" value="support" />
            <RadioButton.Item label="Sales" value="sales" />
          </View>
        </RadioButton.Group>

        <TextInput
          label="Subject *"
          value={subject}
          onChangeText={setSubject}
          mode="outlined"
          style={styles.input}
          error={!!errors.subject}
        />
        <HelperText type="error" visible={!!errors.subject}>
          {errors.subject}
        </HelperText>

        <TextInput
          label="Message *"
          value={message}
          onChangeText={setMessage}
          mode="outlined"
          multiline
          numberOfLines={5}
          style={styles.input}
          error={!!errors.message}
        />
        <HelperText type="error" visible={!!errors.message}>
          {errors.message}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
        >
          Submit Enquiry
        </Button>

        <Button
          mode="outlined"
          onPress={resetForm}
          style={styles.resetButton}
          contentStyle={styles.buttonContent}
        >
          Reset Form
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
    flexGrow: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    color: '#333',
  },
  input: {
    marginBottom: 2,
    backgroundColor: '#fff',
  },
  radioLabel: {
    marginTop: 8,
    marginBottom: 4,
    color: '#555',
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  resetButton: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photoButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6200ee',
    borderStyle: 'dashed',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0ebff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  photoPlaceholderText: {
    fontSize: 11,
    color: '#6200ee',
    fontWeight: '600',
  },
  changePhotoBtn: {
    marginTop: 6,
  },
});
