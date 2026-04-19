import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { analyzeFoodImage, FoodAnalysis } from '@/lib/gemini';
import type { InsertFoodLog } from '@/lib/types';

interface FoodScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (food: Omit<InsertFoodLog, 'user_id'>) => Promise<void>;
}

type Step = 'idle' | 'analyzing' | 'confirm';

export default function FoodScannerModal({ visible, onClose, onConfirm }: FoodScannerModalProps) {
  const [step, setStep] = useState<Step>('idle');
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setStep('idle');
    setResult(null);
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const processImage = async (uri: string) => {
    setStep('analyzing');
    try {
      const compressed = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
      );

      console.log('[FoodScanner] base64 length:', compressed.base64?.length ?? 'MISSING');

      const analysis = await analyzeFoodImage(compressed.base64!);
      setResult(analysis);
      setFoodName(analysis.food_name_th || analysis.food_name);
      setCalories(String(analysis.calories));
      setProtein(String(analysis.protein_g));
      setCarbs(String(analysis.carbs_g));
      setFat(String(analysis.fat_g));
      setStep('confirm');
    } catch (error) {
      console.error('[FoodScanner] analyzeFoodImage error:', error);
      Alert.alert('วิเคราะห์ไม่สำเร็จ', 'ไม่สามารถระบุอาหารได้ กรุณาลองใหม่');
      setStep('idle');
    }
  };

  const handleScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('ต้องการสิทธิ์กล้อง', 'กรุณาอนุญาตการใช้กล้องในการตั้งค่า');
      return;
    }

    const picked = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (picked.canceled) return;
    await processImage(picked.assets[0].uri);
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('ต้องการสิทธิ์แกลลอรี่', 'กรุณาอนุญาตการเข้าถึงรูปภาพในการตั้งค่า');
      return;
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (picked.canceled) return;
    await processImage(picked.assets[0].uri);
  };

  const handleConfirm = async () => {
    if (!foodName.trim()) {
      Alert.alert('กรุณาใส่ชื่ออาหาร');
      return;
    }
    setSaving(true);
    try {
      await onConfirm({
        food_name: foodName.trim(),
        calories: parseFloat(calories) || 0,
        protein_g: parseFloat(protein) || 0,
        carbs_g: parseFloat(carbs) || 0,
        fat_g: parseFloat(fat) || 0,
        meal_type: 'Snack',
      });
      reset();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: '#050505' }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#2A2A2A',
          }}
        >
          <Text style={{ color: '#F5F5F5', fontSize: 18, fontWeight: '700' }}>
            {step === 'confirm' ? 'ยืนยันข้อมูลอาหาร' : 'สแกนอาหาร'}
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#A3A3A3" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          {/* Idle / Analyzing */}
          {step !== 'confirm' && (
            <View style={{ alignItems: 'center', gap: 24, paddingTop: 40 }}>
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 24,
                  backgroundColor: COLORS.primary + '22',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {step === 'analyzing' ? (
                  <ActivityIndicator size="large" color={COLORS.primary} />
                ) : (
                  <Ionicons name="camera" size={48} color={COLORS.primary} />
                )}
              </View>
              <Text style={{ color: '#A3A3A3', textAlign: 'center', fontSize: 14 }}>
                {step === 'analyzing'
                  ? 'AI กำลังวิเคราะห์อาหาร...'
                  : 'ถ่ายรูปอาหารเพื่อให้ AI คำนวณแคลอรี่อัตโนมัติ'}
              </Text>
              {step === 'idle' && (
                <View style={{ gap: 12, alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={handleScan}
                    style={{
                      backgroundColor: COLORS.primary,
                      paddingVertical: 14,
                      paddingHorizontal: 40,
                      borderRadius: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Ionicons name="camera" size={18} color="#000" />
                    <Text style={{ color: '#000', fontWeight: '700', fontSize: 16 }}>
                      เปิดกล้อง
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleGallery}
                    style={{
                      paddingVertical: 14,
                      paddingHorizontal: 40,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Ionicons name="image-outline" size={18} color={COLORS.primary} />
                    <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 16 }}>
                      เลือกรูปจากแกลลอรี่
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Confirm Form */}
          {step === 'confirm' && (
            <View style={{ gap: 12 }}>
              {result && (
                <Text style={{ color: '#A3A3A3', fontSize: 12, marginBottom: 4 }}>
                  ความมั่นใจ AI: {Math.round(result.confidence * 100)}% · {result.serving_size}
                </Text>
              )}

              <Field label="ชื่ออาหาร" value={foodName} onChangeText={setFoodName} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Field label="แคลอรี่ (kcal)" value={calories} onChangeText={setCalories} keyboardType="numeric" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="โปรตีน (g)" value={protein} onChangeText={setProtein} keyboardType="numeric" />
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Field label="คาร์บ (g)" value={carbs} onChangeText={setCarbs} keyboardType="numeric" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="ไขมัน (g)" value={fat} onChangeText={setFat} keyboardType="numeric" />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <TouchableOpacity
                  onPress={() => setStep('idle')}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#2A2A2A',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#F5F5F5', fontWeight: '600' }}>ถ่ายใหม่</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={saving}
                  style={{
                    flex: 2,
                    paddingVertical: 14,
                    borderRadius: 16,
                    backgroundColor: COLORS.primary,
                    alignItems: 'center',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={{ color: '#000', fontWeight: '700', fontSize: 16 }}>
                      บันทึกอาหาร
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: '#A3A3A3', fontSize: 12 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={{
          backgroundColor: '#171717',
          borderWidth: 1,
          borderColor: '#2A2A2A',
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          color: '#F5F5F5',
          fontSize: 15,
        }}
        placeholderTextColor="#555"
      />
    </View>
  );
}
