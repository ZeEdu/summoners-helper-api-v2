import { View } from "react-native"
import { Button, Text } from "react-native-paper"

import { StyledView } from "@org/ui"

import useDataDragonContext from "../../../contexts/data-dragon/useDataDragonContext"

export default function Error() {
  const useDataDragon = useDataDragonContext()

  return (
    <StyledView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text style={{ padding: 16 }}>O carregamento dos dados do Data Dragon falhou...</Text>
        <Button mode='contained' onPress={() => {
          useDataDragon.reload()
        }}
        >
          Tentar novamente!
        </Button>
      </View>
    </StyledView>
  )
}