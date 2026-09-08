import { ActivityIndicator } from "react-native";
import { useTheme } from "react-native-paper";

export default function LoadingIndicator() {
  const theme = useTheme()

  return (
    <ActivityIndicator animating={true} color={theme.colors.primary} />
  )
}

