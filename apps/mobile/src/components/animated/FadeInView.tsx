import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

type FadeInViewProps = PropsWithChildren<{
  style?: ViewStyle,
  config?: Animated.TimingAnimationConfig
}>

export default function FadeInView({ style, config, children }: FadeInViewProps) {
  const fadeAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      ...config
    }).start()
  }, [fadeAnimation])

  return (
    <Animated.View
      style={{
        ...style,
        opacity: fadeAnimation
      }}
    >
      {children}
    </Animated.View>
  )
}