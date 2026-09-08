import { ActivityIndicator, View } from "react-native";
import { MD3Colors, Text } from "react-native-paper";

import { StyledView } from "@org/ui";

export default function Loading() {
  return (
    <StyledView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <ActivityIndicator animating={true} size={'large'} color={MD3Colors.primary100} />
        <Text style={{ padding: 16 }}>Carregando dados do Data Dragon...</Text>
      </View>
    </StyledView>
  )
}