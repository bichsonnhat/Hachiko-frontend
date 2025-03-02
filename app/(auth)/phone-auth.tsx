import { View, Text, TouchableOpacity, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { StyleSheet, type ViewStyle, Alert } from 'react-native';
import { OTPInput, type SlotProps } from 'input-otp-native';
import type { OTPInputRef } from 'input-otp-native';
import { useRef } from 'react';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    useSharedValue,
  } from 'react-native-reanimated';
  import { useEffect } from 'react';

export default function PhoneAuth() {
    const insets = useSafeAreaInsets();
    const ref = useRef<OTPInputRef>(null);
    const [otp, setOtp] = useState('');
    const onComplete = () => {
        // Check if the OTP is correct
        Alert.alert('Completed with code:', otp);
    };
    const { phoneNumber } = useLocalSearchParams();
    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <TouchableOpacity onPress={() => router.back()} className="absolute top-10 right-5">
                <Image source={require('@/assets/images/auth/back.png')} className="size-10" />
            </TouchableOpacity>
            {/* I want the position of the view to be 1/3 of the screen */}
            <View className="flex items-center h-screen justify-center">
                <View className="flex items-center gap-1 h-2/3">
                    <Text className="text-2xl font-bold">Xác nhận mã OTP</Text>
                    <Text className="text-lg">Mã xác thực gồm 6 số đã được gửi đến số điện thoại</Text>
                    <Text className="text-lg">{phoneNumber}</Text>
                    <Text className="text-lg mt-12">Nhập mã để tiếp tục</Text>
                    <View className="flex flex-row gap-2 mt-5">
                        <OTPInput
                            ref={ref}
                            value={otp}
                            onChange={setOtp}
                            containerStyle={styles.container}
                            maxLength={4}
                            render={({ slots }) => (
                            <View style={styles.slotsContainer}>
                                {slots.map((slot, idx) => (
                                <Slot key={idx} {...slot} />
                                ))}
                            </View>
                            )}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#E47905'
                    }}
                    className="py-3 rounded-lg w-2/3"
                    activeOpacity={0.8}
                    onPress={onComplete}
                    >
                    <Text className="text-white text-center font-medium text-base">
                        Tiếp tục
                    </Text>
                    </TouchableOpacity>
            </View>

        </View>
    );
}


function Slot({ char, isActive, hasFakeCaret }: SlotProps) {
  return (
    <View style={[styles.slot, isActive && styles.activeSlot]}>
      {char !== null && <Text style={styles.char}>{char}</Text>}
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeCaret({ style }: { style?: ViewStyle }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.fakeCaretContainer}>
      <Animated.View style={[styles.fakeCaret, style, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  slot: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },
  activeSlot: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  char: {
    fontSize: 24,
    fontWeight: '500',
    color: '#111827',
  },
  /* Caret */
  fakeCaretContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeCaret: {
    width: 2,
    height: 28,
    backgroundColor: '#000',
    borderRadius: 1,
  },
});