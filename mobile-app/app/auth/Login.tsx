import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
            <AntDesign name="left" size={18} color="#39FF14" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Log In</Text>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput 
              style={styles.textInput} 
              placeholder="example@email.com" 
              placeholderTextColor="#4A4A4A"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput 
              style={styles.textInput} 
              placeholder="please enter your password" 
              placeholderTextColor="#4A4A4A"
              secureTextEntry
            />
          </View>

          {/* Checkbox */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, agree && styles.checkboxActive]} 
              onPress={() => setAgree(!agree)}
            >
              {agree && <AntDesign name="check" size={14} color="#000" />}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I agree to the <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or Log In with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Button */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="google" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
             <Text style={styles.footerText}>Already have an account? </Text>
             <TouchableOpacity onPress={() => router.push('/auth/Register')}>
               <Text style={styles.linkTextBold}> Register</Text>
             </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // พื้นหลังดำสนิท
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 150,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#39FF14',
    fontSize: 16,
    marginLeft: 5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A', // สีเทาเข้มแบบในโค้ดที่สอง
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#39FF14',
    marginBottom: 30,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 25,
    backgroundColor: '#121212',
  },
  inputLabel: {
    position: 'absolute',
    top: -10,
    left: 15,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#39FF14',
  },
  textInput: {
    fontSize: 16,
    color: '#FFFFFF',
    
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#39FF14',
    borderColor: '#39FF14',
  },
  checkboxText: {
    color: '#858597',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#39FF14',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#39FF14',
  },
  linkTextBold: {
    color: '#39FF14',
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#4A4A4A',
    fontSize: 12,
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#858597',
  },
});