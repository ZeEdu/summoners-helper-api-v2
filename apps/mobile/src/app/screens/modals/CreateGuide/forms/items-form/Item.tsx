import { useState } from "react"
import { UseFieldArrayRemove } from "react-hook-form"
import { Image, Pressable, StyleSheet } from "react-native"
import { Button, Dialog, MD3Theme, Portal, Text, useTheme } from "react-native-paper"
import { usePatchVersion } from "../../../../../../contexts/patchVersion/usePatchVersion"

type ItemProps = {
  index: number
  itemId: string,
  removeItem: UseFieldArrayRemove,
}

export default function ArrayItem({ itemId, index, removeItem }: ItemProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const { version } = usePatchVersion()

  const [visible, setVisible] = useState(false)

  return (
    <>
      <Pressable style={styles.button} onPress={() => {
        setVisible(true)
      }}>
        <Image source={{ uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png` }} style={styles.image} />
      </Pressable>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Tem certeza?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">O item será removido da lista</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancelar</Button>
            <Button onPress={() => removeItem(index)}>Tenho certeza</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

const makeStyles = ({ roundness }: MD3Theme) => {
  return StyleSheet.create({
    button: {
      maxWidth: 52
    },
    image: {
      width: 48,
      height: 48,
      borderRadius: roundness
    }
  })
}