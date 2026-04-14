import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackProgress() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center">
        <Text className="text-whiteText text-2xl font-bold">Progress</Text>
        <Text className="text-secondary-text text-sm mt-2">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}