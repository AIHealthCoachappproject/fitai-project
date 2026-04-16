import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "@/components/ui/CustomButton";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 px-8 justify-center items-center">
        
        <View className="items-center mb-16">
          <Text className="text-primary text-5xl font-black italic tracking-tighter text-center">
            AI HEALTH COACH APP
          </Text>
          <View className="h-1 w-12 bg-primary mt-2 rounded-full" />
        </View>

        <View className="w-full max-w-xs space-y-4">
          
          <CustomButton
            title="Register"
            onPress={() => router.push("/(auth)/Register")}
            variant="outline"
            containerStyles="border-primary" 
            textStyles="text-primary"       
          />

          <View className="mt-4">
             <CustomButton
              title="Log In"
              onPress={() => router.push("/(auth)/Login")}
              variant="outline"
              containerStyles="border-primary"
              textStyles="text-primary"
            />
          </View>
        </View>

      </View>
    </View>
  );
}