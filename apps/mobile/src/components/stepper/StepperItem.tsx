import { PropsWithChildren } from "react";
import { View } from "react-native";

type StepperItemProps = PropsWithChildren & {
  title: string; // Não é utilizado no componente. Mas é utilizado no Stepper pai
}

export default function StepperItem({ children }: StepperItemProps) {
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  )
}