import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WorkoutVideo, LEVEL_CONFIG } from '@/components/constants/workoutData';

type Props = { video: WorkoutVideo };

const WorkoutVideoCard = ({ video }: Props) => {
  // ─── การดึงข้อมูลเดิม (ห้ามเปลี่ยน) ───
  const dotColor = LEVEL_CONFIG[video.level].color;
  const thumbnailUrl = video.thumbnailUrl;
  // ──────────────────────────────────────

  return (
    <TouchableOpacity
      // ปรับปรุงสไตล์ Container ให้ดู Premium Dark
      className="flex-row bg-[#111111] rounded-3xl mb-4 overflow-hidden border border-white/5 shadow-lg"
      activeOpacity={0.9}
      onPress={() => Linking.openURL(video.resourceUrl)}
    >
      {/* ─── Thumbnail Section (ด้านซ้าย) ─── */}
      <View className="w-32 h-[125px] relative">
        <Image
          source={{ uri: thumbnailUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* Play Overlay (รียูส Ionicons และปรับ UI ให้เหมือนรูป) */}
        <View className="absolute inset-0 bg-black/40 justify-center items-center">
          <View className="bg-white/20 p-2.5 rounded-full border border-white/30 shadow-md">
            <Ionicons name="play" size={20} color="white" />
          </View>
        </View>
      </View>

      {/* ─── Info Section (ด้านขวา) ─── */}
      <View className="flex-1 p-4 justify-between">
        <View>
          {/* Title + dot (ปรับ Layout ใหม่อิงตามรูป) */}
          <View className="flex-row items-center justify-between gap-2 mb-1.5">
            <Text className="text-white font-semibold text-base flex-1 leading-5 tracking-tight" numberOfLines={2}>
              {video.title}
            </Text>
            {/* จุดสีแสดงระดับ (รียูสโค้ดเดิม) */}
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: dotColor }}
            />
          </View>

          {/* Duration + Calories (รียูส Icons และปรับสไตล์ให้ Clean) */}
          <View className="flex-row items-center gap-3 mb-3">
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons name="timer-sand" size={14} color="#666" />
              <Text className="text-gray-500 text-xs font-medium">{video.duration}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons name="fire" size={14} color="#666" />
              <Text className="text-gray-500 text-xs font-medium">{video.calories} kcal</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-[11px] font-medium">Source: {video.source}</Text>
        </View>

        {/* ─── Play Now Button (ปรับ UI ใหม่ให้พรีเมียม) ─── */}
        <View className="bg-[#1A1A1A] rounded-full py-2 items-center border border-white/5 active:bg-[#222]">
          <Text className="text-white text-xs font-bold uppercase tracking-wider">
            Play Now
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutVideoCard;