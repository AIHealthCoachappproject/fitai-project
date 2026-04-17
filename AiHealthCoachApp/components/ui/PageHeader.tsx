import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightIcon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onBack, rightIcon }) => {
  return (
    <View className="flex-row items-center px-5 py-4 mb-3">
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
      </TouchableOpacity>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.primary }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightIcon && <View>{rightIcon}</View>}
    </View>
  );
};

export default PageHeader;
