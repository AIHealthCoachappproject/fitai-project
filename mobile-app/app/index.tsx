import React from "react";
import { Image, Text, View } from "react-native";
import { useRouter } from "expo-router";

// ✅ เรียกใช้ Component ตามชื่อเบสิค
import CustomButton from "./components/ui/custombutton";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black"> 
      <View className="flex-1 px-8 justify-between py-12"> 
        
        {/* --- ข้อมูลงานคงเดิม: Logo & Title --- */}
        <View className="items-center mt-10">
          {/* <Image 
            source={require("../assets/images/Logo_WDZ.png")} 
            style={{ width: 220, height: 220 }} 
            resizeMode="contain" 
          /> */}
          
          <Text className="text-5xl font-black text-[#A3E635] mt-6 italic tracking-tighter text-center">
            AI HEAL
          </Text>
          <Text className="text-gray-400 text-lg mt-2 text-center font-medium">
            Smart Health Tracking
          </Text>
        </View>

        {/* --- ข้อมูลงานคงเดิม: ปุ่มกด (ใช้โครงสร้าง variant แทนการเขียน class ยาวๆ) --- */}
        <View>
          <View className="gap-5 mb-10">
            <CustomButton 
              title="Register" 
              variant="primary" // ใช้สีหลักที่ตั้งไว้ใน Component
              onPress={() => router.push("./frontend/register")} 
            />

            <CustomButton 
              title="Login" 
              variant="secondary" // ใช้ขอบเขียว พื้นโปร่งใส ตาม Logic เดิม
              onPress={() => router.push("./frontend/login")} 
            />
          </View>

          {/* ข้อมูลงานคงเดิม: Build with Supabase */}
          <Text className="text-gray-600 text-center text-[10px] uppercase tracking-widest mb-4">
            Build with Supabase
          </Text>
        </View>

      </View>
    </View>
  );
}