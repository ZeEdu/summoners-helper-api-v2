import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

type AppButtonProps = React.ComponentProps<typeof Button>

type StyledProp = { style?: StyleProp<ViewStyle> } & PropsWithChildren

export function StyledButton(props: AppButtonProps) {
  return <Button mode='contained' {...props} />
}

export function StyledTextInput(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput mode='outlined' {...props} />
}

export function StyledText(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} />
}

export function StyledView({ children, style }: StyledProp) {
  const theme = useTheme()
  return <View style={{ backgroundColor: theme.colors.background, ...style }}>
    {children}
  </View>
}

export { Dropdown } from "./components";

