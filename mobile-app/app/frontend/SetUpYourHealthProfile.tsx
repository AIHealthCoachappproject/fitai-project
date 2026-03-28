// import "./global.css";
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   TouchableWithoutFeedback,
//   Keyboard,
//   TouchableOpacity,
// } from "react-native";
// import CustomInput from "../components/CustomInput";
// import CustomButton from "../components/CustomButton";
// import Checkbox from "../components/Checkbox";
// import RadioButton from "../components/RadioButton";
// import DateTimePicker from "@react-native-community/datetimepicker";

// // Interface สำหรับข้อมูล Form
// interface FormData {
//   fullName: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
//   address: string;
//   acceptTerms: boolean;
//   gender?: string; 
//   birthDate?: Date | undefined;
// }

// // Interface สำหรับ Error Messages
// interface FormErrors {
//   fullName?: string;
//   email?: string;
//   phone?: string;
//   password?: string;
//   confirmPassword?: string;
//   address?: string;
//   acceptTerms?: string;
//   gender?: string;
//   birthDate?: string;
// }

// // {interface สำหรับ Checkbox}
// interface CheckboxProps{
//   label: string;
//   checked: boolean;
//   onPress: () => void;
//   error?: string;
//   touched?: boolean;
// }


// const genderOptions = [
//       { label: "ชาย", value: "male" },
//       { label: "หญิง", value: "female" },
//       { label: "ไม่ระบุ", value: "other" }
// ];

// export default function Index() {
//   // State สำหรับเก็บข้อมูล Form
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     address: "",
//     acceptTerms: false,
//     gender: "",
//     birthDate: undefined,
//   });

//   // State สำหรับเก็บ Error Messages
//   const [errors, setErrors] = useState<FormErrors>({});

//   // State สำหรับเช็คว่า field ไหนถูก touch แล้ว
//   const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

//   // State สำหรับ loading
//   const [isLoading, setIsLoading] = useState(false);

//   // ฟังก์ชัน Validation สำหรับแต่ละ field
//   const validateField = (name: string, value: string): string | undefined => {
//     switch (name) {
//       case "fullName":
//         if (!value.trim()) {
//           return "กรุณากรอกชื่อ-นามสกุล";
//         }
//         if (value.trim().length < 3) {
//           return "ชื่อ-นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร";
//         }
//         return undefined;

//         case "gender":
//           if (!value) {
//             return "กรุณาเลือกเพศ";
//           }
//           return undefined;
        
//         case "birthDate":
//           if (!value) {
//             return "กรุณาเลือกวันเกิด";
//           }
//           const selectedDate = new Date(value);
//           const today = new Date();
//           let age = today.getFullYear() - selectedDate.getFullYear();
//           const m = today.getMonth() - selectedDate.getMonth();

//           // ตรวจสอบว่าถึงวันเกิดในปีนี้หรือยัง ถ้ายังไม่ถึงให้ลบอายุออก 1 ปี
//           if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
//             age--;
//           }
//           if (age < 13) {
//             return "คุณต้องมีอายุอย่างน้อย 13 ปี";
//           }
//           return undefined;

//       case "email":
//         if (!value.trim()) {
//           return "กรุณากรอกอีเมล";
//         }
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(value)) {
//           return "รูปแบบอีเมลไม่ถูกต้อง";
//         }
//         return undefined;

//       case "phone":
//         if (!value.trim()) {
//           return "กรุณากรอกเบอร์โทรศัพท์";
//         }
//         const phoneRegex = /^[0-9]{10}$/;
//         if (!phoneRegex.test(value)) {
//           return "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก";
//         }
//         return undefined;

//       case "password":
//         if (!value) {
//           return "กรุณากรอกรหัสผ่าน";
//         }
//         if (value.length < 6) {
//           return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
//         }
//         return undefined;

//       case "confirmPassword":
//         if (!value) {
//           return "กรุณายืนยันรหัสผ่าน";
//         }
//         if (value !== formData.password) {
//           return "รหัสผ่านไม่ตรงกัน";
//         }
//         return undefined;

//       case "address":
//         if (!value.trim()) {
//           return "กรุณากรอกที่อยู่";
//         }
//         if (value.trim().length < 10) {
//           return "ที่อยู่ต้องมีอย่างน้อย 10 ตัวอักษร";
//         }
//         return undefined;

//         case "acceptTerms":{
//           if (!value) 
//             return "กรุณายอมรับข้อกำหนดและเงื่อนไขก่อนลงทะเบียน";
//         }
//         return undefined;

//       default:
//         return undefined;
//     }
//   };

//   // ฟังก์ชันจัดการเมื่อมีการเปลี่ยนแปลงค่าใน Input
//   const handleChange = (name: keyof FormData, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Validate realtime ถ้า field ถูก touch แล้ว
//     if (touched[name]) {
//       const error = validateField(name, value);
//       setErrors((prev) => ({
//         ...prev,
//         [name]: error,
//       }));
//     }
//   };

//   // ฟังก์ชันจัดการเมื่อ Input ถูก blur (สูญเสียโฟกัส)
//   const handleBlur = (name: keyof FormData) => {
//     setTouched((prev) => ({
//       ...prev,
//       [name]: true,
//     }));

//     // Validate เมื่อ blur
//     const error = validateField(name, formData[name] as any);
//     setErrors((prev) => ({
//       ...prev,
//       [name]: error,
//     }));
//   };

//   // ฟังก์ชัน Validate ทั้ง Form
//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
//     let isValid = true;

//     // ตรวจสอบทุก field
//     (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
//       const error = validateField(key, formData[key] as any);
//       if (error) {
//         newErrors[key] = error;
//         isValid = false;
//       }
//     });

//     setErrors(newErrors);

//     // Mark ทุก field ว่าถูก touch แล้ว
//     const allTouched: { [key: string]: boolean } = {};
//     Object.keys(formData).forEach((key) => {
//       allTouched[key] = true;
//     });
//     setTouched(allTouched);

//     return isValid;
//   };

//   // ฟังก์ชันจัดการเมื่อกด Submit
//   const handleSubmit = async () => {
//     // ปิด Keyboard
//     Keyboard.dismiss();

//     // Validate Form
//     if (!validateForm()) {
//       Alert.alert("ข้อมูลไม่ถูกต้อง", "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง");
//       return;
//     }

//     // จำลองการส่งข้อมูล
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       Alert.alert(
//         "สำเร็จ!",
//         `ลงทะเบียนสำเร็จ\nชื่อ: ${formData.fullName}\nอีเมล: ${formData.email}\nเบอร์: ${formData.phone}\nที่อยู่: ${formData.address}`,
//         [
//           {
//             text: "ตรวจสอบ",
//             onPress: () => console.log("Form Data:", formData),
//           },
//           {
//             text: "รีเซ็ตฟอร์ม",
//             onPress: handleReset,
//             style: "cancel",
//           },
//         ]
//       );
//     }, 2000);
//   };

  
//   // ฟังก์ชันรีเซ็ตฟอร์ม
//   const handleReset = () => {
//     setFormData({
//       fullName: "",
//       email: "",
//       phone: "",
//       password: "",
//       confirmPassword: "",
//       address: "",
//       acceptTerms: false,
//     });
//     setErrors({});
//     setTouched({});

//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1"
//       keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <ScrollView
//           className="flex-1 bg-gray-50"
//           contentContainerClassName="pb-8 " // ใช้ style หรือตรวจสอบ className อีกที
//           keyboardShouldPersistTaps="handled"
//         >

//           {/* Header */}
//           <View className="bg-blue-50">
//             <Text className="text-blue-800 font-bold text-2xl text-center pt-6">
//               ลงทะเบียนสมาชิก
//             </Text>
//             <Text className="text-blue-100 text-base mt-2">
//               กรุณากรอกข้อมูลให้ครบถ้วน
//             </Text>
//           </View>

//           {/* Form Container */}
//           <View className="px-6 mt-6">
//             {/* Full Name */}
//             <CustomInput
//               label="ชื่อ-นามสกุล"
//               placeholder="ระบุชื่อและนามสกุล"
//               value={formData.fullName}
//               onChangeText={(value) => handleChange("fullName", value)}
//               onBlur={() => handleBlur("fullName")}
//               error={errors.fullName || ""}
//               touched={touched.fullName}
//               autoCapitalize="words" //ขึ้นต้นด้วยตัวใหญ่ทุกคำ
//             />

//             {/* Gender */}
//             <RadioButton
//               label="เพศ"
//               options={genderOptions}
//               selectedValue={formData.gender || ""}
//               onSelect={(value) => {
//                 setFormData({ ...formData, gender: value });
//                 const error = validateField("gender", value);
//                 setErrors({ ...errors, gender: error });
//                 setTouched({ ...touched, gender: true });
//               }}
//                 error={errors.gender}
//                 touched={touched.gender}
//             />

//               {/* Birth Date */}
//               <View className="mb-4">
//                 <Text className="text-gray-700 font-medium mb-2 text-base">วันเกิด</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowDatePicker(true)}
//                   activeOpacity={0.7}
//                   className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white justify-center">
//                   <Text className={formData.birthDate ? "text-black text-base" : "text-gray-400 text-base"}>
//                     {formData.birthDate ? formData.birthDate.toLocaleDateString() : "วัน/เดือน/ปี (dd/mm/yyyy)"}
//                   </Text>
//                 </TouchableOpacity>
 
//                 {showDatePicker && (
//                   <DateTimePicker
//                     value={formData.birthDate || new Date()}
//                     mode="date"
//                     display="default"
//                     maximumDate={new Date()} // ไม่ให้เลือกวันเกิดในอนาคต
//                     onChange={(event, selectedDate) => {
//                       setShowDatePicker(false);// ปิด DatePicker หลังเลือกวันเกิด
//                       if (selectedDate) {
//                         setFormData({ ...formData, birthDate: selectedDate });
//                         //ส่งค่าไปเช็ค Errors
//                         const error = validateField("birthDate", selectedDate.toISOString()); // แปลงเป็น ISO string เพื่อส่งไปเช็ค
//                         setErrors({ ...errors, birthDate: error });
//                         setTouched({ ...touched, birthDate: true });
//                       }
//                     }}
//                   />
//                 )}

//                 {errors.birthDate && touched.birthDate && (
//                   <Text className="text-red-500 text-sm mt-1">
//                     {errors.birthDate}
//                   </Text>
//                 )}
//               </View>

//             {/* Address */}
//             <CustomInput
//               label="ที่อยู่"
//               placeholder="กรอกที่อยู่ปัจจุบันของคุณ"
//               value={formData.address}
//               onChangeText={(value) => handleChange("address", value)}
//               onBlur={() => handleBlur("address")}
//               error={errors.address || ""}
//               touched={touched.address}
//               multiline={true}
//               numberOfLines={4}
//               showCharacterCount={true} // เปิดการแสดงตัวเลขนับอักษร
//               maxLength={200} // กำหนดความยาวสูงสุดของที่อยู่
//               style={{ height: 100 }} // กำหนดความสูงของ TextInput
//             />

//             {/* Email */}
//             <CustomInput
//               label="อีเมล"
//               placeholder="email@example.com"
//               value={formData.email}
//               onChangeText={(value) => handleChange("email", value)}
//               onBlur={() => handleBlur("email")}
//               error={errors.email || ""}
//               touched={touched.email}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//             />

//             {/* Phone */}
//             <CustomInput
//               label="เบอร์โทรศัพท์"
//               placeholder="0812345678"
//               value={formData.phone}
//               onChangeText={(value) => handleChange("phone", value)}
//               onBlur={() => handleBlur("phone")}
//               error={errors.phone || ""}
//               touched={touched.phone}
//               keyboardType="phone-pad"
//               maxLength={10}
//             />

//             {/* Password */}
//             <CustomInput
//               label="รหัสผ่าน"
//               placeholder="อย่างน้อย 6 ตัวอักษร"
//               value={formData.password}
//               onChangeText={(value) => handleChange("password", value)}
//               onBlur={() => handleBlur("password")}
//               error={errors.password || ""}
//               touched={touched.password}
//               secureTextEntry
//               autoCapitalize="none"
//             />

//             {/* Confirm Password */}
//             <CustomInput
//               label="ยืนยันรหัสผ่าน"
//               placeholder="กรอกรหัสผ่านอีกครั้ง"
//               value={formData.confirmPassword}
//               onChangeText={(value) => handleChange("confirmPassword", value)}
//               onBlur={() => handleBlur("confirmPassword")}
//               error={errors.confirmPassword || ""}
//               touched={touched.confirmPassword}
//               secureTextEntry
//               autoCapitalize="none"
//             />

//             {/* Accept Terms */}
//             <Checkbox
//               label="ฉันยอมรับข้อกำหนดและเงื่อนไข"
//               checked={formData.acceptTerms}
//               onPress={() => {
//                 const newValue = !formData.acceptTerms;
//                 setFormData({...formData, acceptTerms: newValue});

//                 const error = validateField("acceptTerms", newValue as any);
//                 setErrors({...errors, acceptTerms: error});
//                 setTouched({...touched, acceptTerms: true});
//               }}
//               error={errors.acceptTerms}
//               touched={touched.acceptTerms}
//             />

//             {/* Buttons */}
//             <View className="mt-4 space-y-3">
//               <CustomButton
//                 title="ลงทะเบียน"
//                 onPress={handleSubmit}
//                 variant="primary"
//                 loading={isLoading}
//               />

//               <CustomButton 
//                 title="รีเซ็ตฟอร์ม"
//                 onPress={handleReset}
//                 variant="secondary"
//                 disabled={isLoading}
//               />
//             </View>

            
//           </View> {/* <--- ปิด View ของ Form Content ที่หายไป */}
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// }