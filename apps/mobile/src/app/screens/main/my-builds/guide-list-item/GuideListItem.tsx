import { IGuide } from "@org/contracts";
import { useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { Card, IconButton, Menu, useTheme } from "react-native-paper";
import useDataDragonContext from "../../../../../contexts/data-dragon/useDataDragonContext";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import DataDragonService from "../../../../../services/data-dragon/data-dragon.service";

// É possível passar a função de navegação para este componente, sem ter a necessidade de coloca-lo na navegação do app
type GuideListItemProps = {
  guide: IGuide,
  editGuide: (guide: IGuide) => void
}

export default function GuideListItem({ guide, editGuide }: GuideListItemProps) {
  const [showMenu, setShowMenu] = useState(false)

  const theme = useTheme();
  const patchVersion = usePatchVersion()
  const dataDragonContext = useDataDragonContext();
  const champion = dataDragonContext.getChampion(guide.champion)


  const openMenu = () => {
    setShowMenu(true)
  }

  const hideMenu = () => {
    setShowMenu(false)
  }


  const edit = () => {
    hideMenu()
    editGuide(guide)
  }

  return (
    <Pressable style={({ pressed }) => {
      return { backgroundColor: pressed ? theme.colors.inversePrimary : 'transparent' }
    }}>
      <Card.Title
        key={guide._id.toString()}
        title={guide.title}
        subtitle={`Campeão: ${champion?.name}. Patch: ${guide.patchVersion}.`}
        left={() => (
          <Image
            style={styles.imageProportions}
            source={{ uri: DataDragonService.champion(guide.champion, patchVersion.version) }}
          />
        )}
        right={() => {
          return (
            <Menu
              visible={showMenu}
              onDismiss={hideMenu}
              anchor={<IconButton icon={'dots-vertical'} onPress={openMenu} />}
            >
              <Menu.Item title={'Editar guia'} onPress={edit} />
            </Menu>
          )
        }}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  imageProportions: {
    width: 48,
    height: 48,
  }
})