import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

type StepperItemProps = PropsWithChildren & {
  title: string; // Não é utilizado no componente. Mas é utilizado no Stepper pai
}

export default function StepperItem({ children }: StepperItemProps) {
  return (
    <View style={style.flex}>
      {children}
    </View>
  )
}

const style = StyleSheet.create({
  flex: {
    flex: 1
  }
})