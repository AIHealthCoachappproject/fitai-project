import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import FormField from '@/components/ui/FormField';
import CustomButton from '@/components/ui/CustomButton';
import SelectButton from '@/components/ui/SelectButton';
import { ACTIVITY_LEVELS } from '@/components/constants/healthData';

interface EditHealthModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (height: string, activityLevel: string) => void;
  initialHeight: string;
  initialActivityLevel: string;
}

const EditHealthModal: React.FC<EditHealthModalProps> = ({
  visible,
  onClose,
  onSave,
  initialHeight,
  initialActivityLevel,
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [activityLevel, setActivityLevel] = useState(initialActivityLevel);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let newErrors: any = {};
    if (!height.trim()) newErrors.height = 'Please fill in height';
    else if (!/^\d+$/.test(height.trim())) newErrors.height = 'Please enter numbers only';
    if (!activityLevel) newErrors.activityLevel = 'Please select activity level';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    onSave(height, activityLevel);
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setHeight(initialHeight);
    setActivityLevel(initialActivityLevel);
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4" style={{ borderBottomWidth: 1, borderBottomColor: COLORS.secondary }}>
          <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>
            Edit Health Info
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View className="flex-1 px-5 pt-6 pb-6">
          {/* Height Section */}
          <View className="mb-6">
            <FormField
              title="Height (cm)"
              value={height}
              placeholder="cm"
              keyboardType="numeric"
              handleChangeText={(e) => {
                const numericValue = e.replace(/[^0-9]/g, '');
                setHeight(numericValue);
                if (errors.height) setErrors({ ...errors, height: undefined });
              }}
            />
            {errors.height && (
              <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.height}
              </Text>
            )}
          </View>

          {/* Activity Level */}
          <View className="mb-8 flex-1">
            <Text className="text-primary font-bold text-sm mb-4 ml-1 uppercase">
              Activity Level
            </Text>
            <View style={{ gap: 12 }}>
              {ACTIVITY_LEVELS.map((level) => (
                <SelectButton
                  key={level.label}
                  label={level.label}
                  isSelected={activityLevel === level.label}
                  onPress={() => {
                    setActivityLevel(level.label);
                    if (errors.activityLevel)
                      setErrors({ ...errors, activityLevel: undefined });
                  }}
                  containerStyles="w-full h-20 items-start px-5 py-3 rounded-2xl"
                  description={level.desc}
                />
              ))}
            </View>
            {errors.activityLevel && (
              <Text className="text-red-500 text-xs mt-2 ml-1 font-medium">
                {errors.activityLevel}
              </Text>
            )}
          </View>
        </View>

        {/* Save Button */}
        <View className="px-5 py-4" style={{ borderTopWidth: 1, borderTopColor: COLORS.secondary }}>
          <CustomButton
            title={isSubmitting ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            isLoading={isSubmitting}
            containerStyles="rounded-full h-14"
          />
        </View>
      </View>
    </Modal>
  );
};

export default EditHealthModal;
