import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  role: 'user' | 'ai';
  content: string;
  time: string;
  children?: React.ReactNode; // สำหรับ goal options
};

const ChatMessage = ({ role, content, time, children }: Props) => {
  const isAI = role === 'ai';

  return (
    <View className={`mb-6 ${isAI ? 'items-start' : 'items-end'}`}>
      <View className="flex-row items-start gap-3 px-2">
        {/* AI Avatar with glow effect */}
        {isAI && (
          <View 
            className="w-10 h-10 rounded-full bg-gradient-to-b from-[#1A1A2E] to-[#0F0F1E] border border-white/15 justify-center items-center mt-1 flex-shrink-0"
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
        )}

        <View className={`${isAI ? 'flex-1' : ''}`}>
          {/* Bubble with better shadows */}
          {content !== '' && (
            <View
              style={{
                elevation: isAI ? 2 : 3,
                shadowColor: isAI ? '#000' : '#39FF14',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isAI ? 0.2 : 0.2,
                shadowRadius: isAI ? 4 : 6,
              }}
              className={`rounded-3xl px-5 py-3 max-w-[85%] ${
                isAI
                  ? 'bg-[#1A1A1A] rounded-tl-sm border border-white/5'
                  : 'bg-[#39FF14] rounded-tr-sm'
              }`}
            >
              <Text
                className={`text-base leading-6 font-medium ${
                  isAI ? 'text-white/90' : 'text-black font-bold'
                }`}
              >
                {content}
              </Text>
            </View>
          )}

          {/* Goal Options หรือ children อื่นๆ */}
          <View className="mt-2">
            {children}
          </View>

          {/* Timestamp - improved visibility */}
          <Text className="text-white/40 text-[11px] mt-1.5 ml-2 font-medium">{time}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatMessage;