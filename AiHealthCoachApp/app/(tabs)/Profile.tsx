import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useProfile } from '@/context/ProfileContext';
import { useAuthContext } from '@/context/AuthContext';
import EditHealthModal from '@/components/dashboard/EditHealthModal';
import PhotoUploadModal from '@/components/dashboard/PhotoUploadModal';
import MetricCard from '@/components/dashboard/MetricCard';

const Profile = () => {
  const router = useRouter();
  const { profile, updateProfileField, calculateBMI } = useProfile();
  const { profile: authProfile, upsertProfile } = useAuthContext();
  const [showEditHealthModal, setShowEditHealthModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Color Scheme
  const primaryColor = COLORS.primary;     // #39FF14 - green
  const whiteText = '#F5F5F5';             // main content
  const mutedText = COLORS.muted;          // #A3A3A3 - description
  const bgColor = '#0A0A0A';               // darker background

  const handleSaveHealth = async (height: string, weight: string, activityLevel: string) => {
    updateProfileField('height', height);
    updateProfileField('weight', weight);
    updateProfileField('activityLevel', activityLevel);
    setTimeout(() => { calculateBMI(); }, 0);
    await upsertProfile({
      height_cm: parseFloat(height),
      weight_kg: parseFloat(weight),
      activity_level: activityLevel,
    });
  };

  const handleSavePhoto = (imageUri: string) => {
    updateProfileField('profileImage', imageUri);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50, backgroundColor: bgColor }}
      >
        {/* Header with Back Button */}
        <View className="flex-row items-center px-5 py-4 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={primaryColor} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: primaryColor, flex: 1, marginLeft: 12 }}>
            My Profile
          </Text>
        </View>

        {/* Profile Photo Section */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={() => setShowPhotoModal(true)}
            className="relative"
            activeOpacity={0.7}
          >
            <View
              className="w-32 h-32 rounded-full justify-center items-center border-4 mb-3"
              style={{
                borderColor: primaryColor,
                backgroundColor: COLORS.secondary,
              }}
            >
              {profile.profileImage ? (
                <Image
                  source={{ uri: profile.profileImage }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Ionicons name="person" size={50} color={primaryColor} />
              )}
            </View>
            {/* Edit Icon */}
            <View
              className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full justify-center items-center border-2"
              style={{
                borderColor: bgColor,
                backgroundColor: primaryColor,
              }}
            >
              <Ionicons name="camera" size={16} color={COLORS.black} />
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 12, color: mutedText, marginTop: 8 }}>
            Tap to change photo
          </Text>
        </View>

        {/* User Info Cards - Individual */}
        <View className="mx-5 mb-6">
          {/* Name Card */}
          <View className="mb-3 p-5 rounded-2xl border" style={{ backgroundColor: COLORS.secondary, borderColor: 'rgba(255,255,255,0.05)' }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: primaryColor, marginBottom: 8, letterSpacing: 0.5 }}>
              NAME
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: whiteText }}>
              {authProfile?.name || profile.name || 'Not Set'}
            </Text>
          </View>

          {/* Age & Gender Row */}
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 p-5 rounded-2xl border" style={{ backgroundColor: COLORS.secondary, borderColor: 'rgba(255,255,255,0.05)' }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: primaryColor, marginBottom: 8, letterSpacing: 0.5 }}>
                AGE
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: whiteText }}>
                {authProfile?.age || profile.age || 'Not Set'}
              </Text>
            </View>
            <View className="flex-1 p-5 rounded-2xl border" style={{ backgroundColor: COLORS.secondary, borderColor: 'rgba(255,255,255,0.05)' }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: primaryColor, marginBottom: 8, letterSpacing: 0.5 }}>
                GENDER
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: whiteText }}>
                {authProfile?.gender || profile.gender || 'Not Set'}
              </Text>
            </View>
          </View>

          {/* Activity Level Card */}
          <View className="p-5 rounded-2xl border" style={{ backgroundColor: COLORS.secondary, borderColor: 'rgba(255,255,255,0.05)' }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: primaryColor, marginBottom: 8, letterSpacing: 0.5 }}>
              ACTIVITY LEVEL
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: whiteText }}>
              {authProfile?.activity_level || profile.activityLevel || 'Not Set'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <EditHealthModal
        visible={showEditHealthModal}
        onClose={() => setShowEditHealthModal(false)}
        onSave={handleSaveHealth}
        initialHeight={profile.height}
        initialWeight={profile.weight}
        initialActivityLevel={profile.activityLevel}
      />

      <PhotoUploadModal
        visible={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onSave={handleSavePhoto}
        currentImage={profile.profileImage}
      />
    </SafeAreaView>
  );
};

export default Profile;
