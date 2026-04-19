import React, { useState, useRef } from 'react';
import { chatWithGemini } from '@/constants/gemini';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ImageBackground, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ChatMessage from '@/components/aicoachchat/ChatMessage';
import GoalOptionCard from '@/components/aicoachchat/GoalOptionCard';
import QuickReplyBar from '@/components/aicoachchat/QuickReplyBar';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  time: string;
  type?: 'text' | 'goal_options';
};

const now = '10:00';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: 'Hello! Welcome to AI Health 🌿\nyour personal health assistant',
    time: now,
  },
  {
    id: '2',
    role: 'ai',
    content: 'So I can help take care of you effectively… what is your main goal at this time?',
    time: now,
  },
  {
    id: '3',
    role: 'ai',
    content: '',
    time: now,
    type: 'goal_options',
  },
];

const AIHealthCoachChat = () => {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getTime = () => {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const sendMessage = async (text: string) => {
    if (isTyping) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    scrollRef.current?.scrollToEnd({ animated: true });

    try {
      const history = messages
        .filter(m => m.type !== 'goal_options' && m.content)
        .map(m => ({
          role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
          content: m.content,
        }));
      const response = await chatWithGemini(trimmed, history);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'ai', content: response, time: getTime() },
      ]);
    } catch (error) {
      console.error('[Chat error]', error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'ai', content: 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่', time: getTime() },
      ]);
    } finally {
      setIsTyping(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ─── Header ─── */}
        <View className="h-32 w-full overflow-hidden">
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' }}
            className="flex-1"
          >
            <View className="absolute inset-0 bg-black/60" />
            <View className="flex-row items-center justify-between px-4 pt-3">
              <TouchableOpacity onPress={() => router.back()} className="p-1">
                <Ionicons name="chevron-back" size={24} color="#39FF14" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-bold">AI Health Coach</Text>
              <TouchableOpacity className="p-1">
                <Ionicons name="ellipsis-vertical" size={20} color="white" />
              </TouchableOpacity>
            </View>
            {/* Online Badge */}
            <View className="items-center mt-2">
              <View className="flex-row items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                <View className="w-2 h-2 rounded-full bg-[#39FF14]" />
                <Text className="text-white text-xs font-medium">Online</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* ─── Messages ─── */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Date separator */}
          <Text className="text-white/30 text-xs text-center mb-6">Today, 10:00 AM</Text>

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              time={msg.time}
            >
              {msg.type === 'goal_options' && (
                <GoalOptionCard
                  onSelect={(label: string) => sendMessage(label)}
                />
              )}
            </ChatMessage>
          ))}

          {/* AI Typing indicator */}
          {isTyping && (
            <View className="flex-row items-center gap-3 mb-6">
              <View 
                className="w-10 h-10 rounded-full bg-[#1A1A2E] border border-white/15 justify-center items-center"
                style={{
                  shadowColor: '#A78BFA',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Ionicons name="sparkles" size={18} color="#A78BFA" />
              </View>
              <View 
                className="bg-[#1A1A1A] rounded-3xl rounded-tl-sm px-5 py-4 border border-white/5"
                style={{
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}
              >
                <View className="flex-row items-center gap-2">
                  <Animated.View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#A78BFA',
                      opacity: 0.7,
                    }}
                  />
                  <Animated.View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#A78BFA',
                      opacity: 0.5,
                    }}
                  />
                  <Animated.View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#A78BFA',
                      opacity: 0.3,
                    }}
                  />
                </View>
              </View>
            </View>
          )}

          <View className="h-4" />
        </ScrollView>

        {/* ─── Quick Replies (above input bar) ─── */}
        <QuickReplyBar onSelect={(text) => setInputText(text)} />

        {/* ─── Input Bar ─── */}
        <View className="bg-[#0A0A0A] border-t border-white/5 pb-1">
          {/* Input Row */}
          <View className="flex-row items-center gap-3 px-4 py-3">
            {/* + Button */}
            <TouchableOpacity 
              style={{
                elevation: 3,
                shadowColor: '#39FF14',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
              }}
              className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/15 justify-center items-center"
            >
              <Ionicons name="add" size={22} color="#39FF14" />
            </TouchableOpacity>

            {/* Text Input with elevated style */}
            <View 
              style={{
                elevation: 3,
                shadowColor: '#39FF14',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
              }}
              className="flex-1 flex-row items-center bg-[#1A1A1A] rounded-full px-5 py-3 border border-white/15"
            >
              <TextInput
                className="flex-1 text-white text-sm font-medium"
                placeholder="Ask me anything..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                onSubmitEditing={() => sendMessage(inputText)}
              />
              {/* Mic */}
              <TouchableOpacity className="ml-3">
                <Ionicons name="mic-outline" size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>

            {/* Send Button with animation */}
            <TouchableOpacity
              onPress={() => sendMessage(inputText)}
              style={{
                elevation: inputText.trim() ? 6 : 2,
                shadowColor: inputText.trim() ? '#39FF14' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: inputText.trim() ? 0.3 : 0.1,
                shadowRadius: inputText.trim() ? 6 : 3,
              }}
              className="w-11 h-11 rounded-full justify-center items-center"
              disabled={!inputText.trim()}
            >
              <View className={`w-11 h-11 rounded-full justify-center items-center ${
                inputText.trim() ? 'bg-[#39FF14]' : 'bg-[#1A1A1A]'
              }`}>
                <Ionicons
                  name="send"
                  size={18}
                  color={inputText.trim() ? '#000' : 'rgba(255,255,255,0.3)'}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>{/* end Bottom container */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIHealthCoachChat;