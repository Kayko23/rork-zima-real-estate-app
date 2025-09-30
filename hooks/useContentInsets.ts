import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export function useContentInsets() {
  const insets = useSafeAreaInsets();
  
  const tabHeight = 56;
  
  const top = Math.max(insets.top, Platform.OS === 'android' ? 0 : 12);
  const bottom = insets.bottom + tabHeight + 12;
  
  return { top, bottom, tabHeight, insets };
}
