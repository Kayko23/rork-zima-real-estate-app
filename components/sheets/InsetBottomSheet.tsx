import React, { forwardRef, useMemo } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetProps } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

export type InsetBottomSheetRef = BottomSheet;

type Props = Omit<BottomSheetProps, 'snapPoints'> & {
  snapPoints?: (string | number)[];
};

export default forwardRef<InsetBottomSheetRef, Props>(function InsetBottomSheet(
  { snapPoints: sp, children, ...props },
  ref
) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => sp ?? ['50%', '85%'], [sp]);

  const renderBackdrop = (backdropProps: BottomSheetDefaultBackdropProps) => (
    <BottomSheetBackdrop
      {...backdropProps}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      topInset={insets.top + 12}
      bottomInset={insets.bottom + 80}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ 
        width: 40, 
        height: 4, 
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
      }}
      backgroundStyle={{ 
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
      }}
      {...props}>
      {children}
    </BottomSheet>
  );
});
