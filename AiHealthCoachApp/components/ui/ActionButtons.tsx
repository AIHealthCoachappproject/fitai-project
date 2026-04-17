import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import CustomButton from './CustomButton';

interface ActionButtonsProps {
  onComplete?: () => void;
  onCancel: () => void;
  completeLabel?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onComplete,
  onCancel,
  completeLabel = 'Complete Workout',
  isLoading = false,
  isDisabled = false,
  disabledReason,
}) => {
  return (
    <View className="gap-3 mt-2">
      {isDisabled && disabledReason && (
        <View
          className="rounded-2xl px-4 py-3 flex-row items-center"
          style={{ backgroundColor: 'rgba(255,165,0,0.1)', borderColor: 'rgba(255,165,0,0.2)', borderWidth: 1 }}
        >
          <MaterialCommunityIcons name="alert-circle" size={16} color="rgba(255,165,0,0.8)" />
          <Text style={{ fontSize: 12, color: 'rgba(255,165,0,0.8)', marginLeft: 8, flex: 1 }}>
            {disabledReason}
          </Text>
        </View>
      )}

      {onComplete && (
        <TouchableOpacity
          disabled={isDisabled || isLoading}
          onPress={onComplete}
          className="rounded-full py-4 justify-center items-center flex-row gap-2"
          style={{ backgroundColor: COLORS.primary, opacity: isDisabled || isLoading ? 0.5 : 1 }}
        >
          <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.black} />
          <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.black }}>
            {completeLabel}
          </Text>
        </TouchableOpacity>
      )}

      <CustomButton
        title="Cancel"
        variant="outline"
        onPress={onCancel}
      />
    </View>
  );
};

export default ActionButtons;
