import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '../../hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
const backgroundColor = lightColor || darkColor || require('../constants/theme').Colors.base.black;
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
