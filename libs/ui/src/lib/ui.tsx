import { Button, Text, TextInput } from "react-native-paper";


type AppButtonProps = React.ComponentProps<typeof Button>

export function AppButton(props: AppButtonProps) {
  return <Button mode='contained' {...props} />
}

export function AppTextInput(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput mode='outlined' {...props} />
}

export function AppText(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} />
}