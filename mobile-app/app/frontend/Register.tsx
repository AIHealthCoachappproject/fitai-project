import React, { useState } from 'react';
import {
  View, Text, TextInput,
  ScrollView, KeyboardAvoidingView,
  Platform, Alert, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';

// ✅ Import Components ตามชื่อเบสิค
import CustomButton from '../components/ui/custombutton';
import Checkbox from '../components/ui/checkbox';

// ข้อมูลงานห้ามเปลี่ยน
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
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    accept: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  // Logic Validation เดิมเป๊ะ ห้ามเปลี่ยน
  const validateField = (name: keyof FormData, value: any) => {
    switch (name) {
      case 'username':
        if (!value) return 'กรุณากรอก username';
        return;
      case 'email':
        if (!value) return 'กรุณากรอก email';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'รูปแบบ email ไม่ถูกต้อง';
        return;
      case 'password':
        if (!value) return 'กรุณากรอกรหัสผ่าน';
        if (value.length < 6) return 'รหัสผ่านต้องมากกว่า 6 ตัว';
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
      if (error) { newErrors[key] = error; valid = false; }
    });
    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert("ข้อมูลไม่ถูกต้อง");
      return;
    }
    try {
      setLoading(true);
      // ตัวอย่างการเชื่อมต่อ Supabase (ข้อมูลงานคงเดิม)
      Alert.alert("สำเร็จ 🎉", "ลงทะเบียนเรียบร้อยแล้ว");
      router.push('./frontend/SetUpYourHealthProfile'); 
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
        className="bg-black"
      >
        <View className="flex-1 p-8 pt-20">
          <Text className="text-5xl font-black text-[#A3E635] mb-12 italic tracking-tighter">
            REGISTER
          </Text>

          {/* ส่วนของ Input Fields */}
          <View className="gap-y-6">
            
            {/* Username */}
            <View>
              <View className={`relative border-2 rounded-2xl px-4 py-3 ${touched.username && errors.username ? 'border-red-500' : 'border-neutral-700'}`}>
                <Text className="absolute -top-3 left-3 bg-black px-2 text-sm font-bold text-[#A3E635]">
                  Username
                </Text>
                <TextInput
                  className="text-white text-lg py-1"
                  value={formData.username}
                  onChangeText={(v) => handleChange('username', v)}
                  onBlur={() => handleBlur('username')}
                  placeholder="Enter your username"
                  placeholderTextColor="#444"
                />
              </View>
              {touched.username && errors.username && (
                <Text className="text-red-500 text-xs mt-1 ml-2">{errors.username}</Text>
              )}
            </View>

            {/* Email */}
            <View>
              <View className={`relative border-2 rounded-2xl px-4 py-3 ${touched.email && errors.email ? 'border-red-500' : 'border-neutral-700'}`}>
                <Text className="absolute -top-3 left-3 bg-black px-2 text-sm font-bold text-[#A3E635]">
                  Email
                </Text>
                <TextInput
                  className="text-white text-lg py-1"
                  value={formData.email}
                  onChangeText={(v) => handleChange('email', v)}
                  onBlur={() => handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="example@mail.com"
                  placeholderTextColor="#444"
                />
              </View>
              {touched.email && errors.email && (
                <Text className="text-red-500 text-xs mt-1 ml-2">{errors.email}</Text>
              )}
            </View>

            {/* Password */}
            <View>
              <View className={`relative border-2 rounded-2xl px-4 py-3 ${touched.password && errors.password ? 'border-red-500' : 'border-neutral-700'}`}>
                <Text className="absolute -top-3 left-3 bg-black px-2 text-sm font-bold text-[#A3E635]">
                  Password
                </Text>
                <TextInput
                  className="text-white text-lg py-1"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(v) => handleChange('password', v)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  placeholderTextColor="#444"
                />
              </View>
              {touched.password && errors.password && (
                <Text className="text-red-500 text-xs mt-1 ml-2">{errors.password}</Text>
              )}
            </View>
          </View>

          {/* --- การเรียกใช้ Checkbox --- */}
          <View className="mt-8">
            <Checkbox
              label="I agree to Privacy Policy"
              checked={formData.accept}
              touched={touched.accept}
              error={errors.accept}
              onPress={() => handleChange('accept', !formData.accept)}
            />
          </View>

          {/* --- การเรียกใช้ CustomButton --- */}
          <View className="mt-4">
            <CustomButton
              title={loading ? "Creating Account..." : "REGISTER"}
              onPress={handleRegister}
              variant="primary"
              loading={loading}
              disabled={loading}
            />
          </View>

          {/* Footer Link */}
          <View className="mt-8 flex-row justify-center items-center">
            <Text className="text-neutral-500 text-base">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('./frontend/login')}>
              <Text className="text-[#A3E635] font-bold text-base">Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}