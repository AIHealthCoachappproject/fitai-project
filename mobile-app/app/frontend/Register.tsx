import React, { useState } from 'react';
import {
  View, Text, TextInput,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';

// ✅ import component
import Checkbox from '../components/ui/checkbox';
import CustomButton from '../components/ui/custombutton';
 

interface FormData {
  username: string;
  email: string;
  password: string;
  accept: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  accept?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  
  // แทนที่ const theme = Colors.dark; ด้วยก้อนนี้:
const theme = {
  primary: Colors.neon.green,      // ใช้สีเขียวจากหมวด neon
  background: Colors.base.black,   // ใช้สีดำจากหมวด base
  border: Colors.border.default,     // (สมมติชื่อ) หรือใช้สีที่คุณตั้งไว้ในหมวด border
  text: Colors.text.main,          // ใช้สีข้อความหลัก
};
  const styles = createStyles(theme);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    accept: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const validateField = (name: keyof FormData, value: any) => {
    switch (name) {
      case 'username':
        if (!value) return 'กรุณากรอก username';
        return;

      case 'email':
        if (!value) return 'กรุณากรอก email';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'รูปแบบ email ไม่ถูกต้อง';
        return;

      case 'password':
        if (!value) return 'กรุณากรอกรหัสผ่าน';
        if (value.length < 6)
          return 'รหัสผ่านต้องมากกว่า 6 ตัว';
        return;

      case 'accept':
        if (!value) return 'กรุณายอมรับ Privacy Policy';
        return;
    }
  };

  const handleChange = (name: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: FormErrors = {};

    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        valid = false;
      }
    });

    setErrors(newErrors);

    const allTouched: any = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert("ข้อมูลไม่ถูกต้อง");
      return;
    }

    try {
      setLoading(true);

      Alert.alert("สำเร็จ 🎉");
      router.push('/frontend/SetUpYourHealthProfile'); // เปลี่ยนเส้นทางไปหน้า SetupYourHealth

    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Register</Text>

          {/* Username */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={formData.username}
              onChangeText={(v) => handleChange('username', v)}
              onBlur={() => handleBlur('username')}
            />
          </View>
          {touched.username && errors.username && (
            <Text style={styles.error}>{errors.username}</Text>
          )}

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(v) => handleChange('email', v)}
              onBlur={() => handleBlur('email')}
            />
          </View>
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry
              value={formData.password}
              onChangeText={(v) => handleChange('password', v)}
              onBlur={() => handleBlur('password')}
            />
          </View>
          {touched.password && errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          {/* ✅ Checkbox ใหม่ */}
          <Checkbox
            label="I agree to Privacy Policy"
            checked={formData.accept}
            onPress={() => handleChange('accept', !formData.accept)}
            error={errors.accept}
            touched={touched.accept}
          />

          {/* ✅ ปุ่ม Register */}
          <CustomButton
            title="Register"
            onPress={handleRegister}
            style={{ backgroundColor: theme.primary }}
            loading={loading}
/>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// styles
// styles
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    
    // เพิ่ม scrollContent ที่หายไป
    scrollContent: {
      flexGrow: 1,
    },

    formContainer: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 25,
      paddingTop: 60,
    },

    title: {
      fontSize: 35,
      fontWeight: '900',
      color: theme.primary,
      marginBottom: 40,
    },

    inputWrapper: {
      borderWidth: 1.5,
      borderColor: theme.border,
      borderRadius: 15,
      paddingHorizontal: 15,
      paddingVertical: 12,
      marginBottom: 25,
      backgroundColor: 'transparent',
    },

    inputLabel: {
      position: 'absolute',
      top: -12,
      left: 12,
      backgroundColor: theme.background,
      paddingHorizontal: 8,
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
    },
    
    textInput: {
      color: '#FFFFFF',
      fontSize: 18,
    },

    // เพิ่ม error ที่หายไป
    error: {
      color: '#EF4444', // สีแดง danger
      fontSize: 12,
      marginTop: -20, // ขยับขึ้นไปชิด inputWrapper
      marginBottom: 15,
      marginLeft: 5,
    },
  });