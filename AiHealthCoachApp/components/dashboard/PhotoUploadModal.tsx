import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/theme';
import CustomButton from '@/components/ui/CustomButton';

interface PhotoUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (imageUri: string) => void;
  currentImage: string | null;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  visible,
  onClose,
  onSave,
  currentImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (fromCamera: boolean) => {
    try {
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onSave(selectedImage);
      setIsLoading(false);
      onClose();
    }, 800);
  };

  const handleClose = () => {
    setSelectedImage(currentImage);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-secondary">
          <TouchableOpacity onPress={handleClose} disabled={isLoading}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Change Profile Photo</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center items-center px-5">
          {/* Profile Image Preview */}
          <View className="mb-8">
            <View
              className="w-40 h-40 rounded-full justify-center items-center border-4"
              style={{
                borderColor: COLORS.primary,
                backgroundColor: COLORS.secondary,
              }}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Ionicons name="person" size={60} color={COLORS.muted} />
              )}
            </View>
          </View>

          {/* Buttons */}
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={() => pickImage(true)}
              disabled={isLoading}
              className="flex-row items-center justify-center px-5 py-4 bg-secondary rounded-2xl border border-white/10"
            >
              <Ionicons name="camera" size={22} color={COLORS.primary} />
              <Text className="text-white font-semibold ml-3">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => pickImage(false)}
              disabled={isLoading}
              className="flex-row items-center justify-center px-5 py-4 bg-secondary rounded-2xl border border-white/10"
            >
              <Ionicons name="image-outline" size={22} color={COLORS.primary} />
              <Text className="text-white font-semibold ml-3">Choose from Library</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <View className="px-5 py-4 border-t border-secondary gap-2">
          <CustomButton
            title={isLoading ? 'Saving...' : 'Save Photo'}
            onPress={handleSave}
            isLoading={isLoading}
            containerStyles="rounded-full h-14"
          />
          <TouchableOpacity
            onPress={handleClose}
            disabled={isLoading}
            className="px-5 py-3 bg-secondary rounded-full border border-white/10"
          >
            <Text className="text-white text-center font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PhotoUploadModal;
