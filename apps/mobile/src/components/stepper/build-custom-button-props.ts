import { StyleSheet } from "react-native";
import { ButtonProps } from "react-native-paper";

type ButtonPropsWithOptionalChildren = Omit<ButtonProps, 'children'> & {
  children?: React.ReactNode,
  t: (key: string) => string,
}

export const buildCustomButtonProps = ({ t, ...buttonProps }: ButtonPropsWithOptionalChildren): ButtonProps => {
  return {
    children: t('stepper.footer.next'),
    mode: "contained",
    style: styles.footerButton,
    ...buttonProps,
  }
}

const styles = StyleSheet.create({
  footerButton: {
    flex: 1
  }
})