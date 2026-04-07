import { View, Text, ScrollView, ImageBackground, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import WorkoutLevelFilter from "@/components/workout/WorkoutLevelFilter";
import WorkoutVideoCard from "@/components/workout/WorkoutVideoCard";
import { Level, WORKOUT_VIDEOS } from "@/components/constants/workoutData";
import Ionicons from "@expo/vector-icons/build/Ionicons";

const AiWorkoutCoach = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const filtered = selectedLevel 
    ? WORKOUT_VIDEOS.filter((v) => v.level === selectedLevel)
    : WORKOUT_VIDEOS;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="h-72 w-full overflow-hidden mb-6">
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' }}
            className="flex-1 justify-end p-6"
            resizeMode="cover"
          >
            <View className="absolute inset-0 bg-black/50" />
            
            <View className="mb-2">
              <Text className="text-[#39FF14] text-xs font-bold uppercase tracking-widest mb-1.5">
                Ai Workout Coach
              </Text>
              <Text className="text-white text-4xl font-black italic uppercase leading-[42px] tracking-tight">
                AI WORKOUT{"\n"}COACH
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View className="px-5 pb-40">
          <Text className="text-white text-xl font-bold mb-5 tracking-tight">
            Recommended Workout Videos
          </Text>

          <View className="mb-6">
            <WorkoutLevelFilter
              selected={selectedLevel}
              onSelect={setSelectedLevel}
            />
          </View>

          <View className="space-y-4">
            {filtered.map((video) => (
              <WorkoutVideoCard key={video.id} video={video} />
            ))}
          </View>

          {filtered.length === 0 && (
            <View className="py-20 items-center justify-center border border-white/5 rounded-3xl mt-4">
              <Ionicons name="videocam-off-outline" size={40} color="#333" />
              <Text className="text-gray-600 mt-3 font-medium">No videos in this level.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AiWorkoutCoach;