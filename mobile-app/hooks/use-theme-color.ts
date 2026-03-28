import { Colors } from '../app/constants/theme';
import { useColorScheme } from './use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: 'black' | 'white' | 'green' // ระบุชื่อสีที่คุณใช้บ่อยๆ
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // แก้ไขให้ดึงจากโครงสร้างใหม่ของคุณ
    if (colorName === 'green') return Colors.neon.green;
    if (colorName === 'black') return Colors.base.black;
    return Colors.base.white; 
  }
}