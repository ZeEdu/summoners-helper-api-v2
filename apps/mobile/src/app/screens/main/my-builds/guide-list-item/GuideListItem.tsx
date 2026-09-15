import { IGuide } from "@org/contracts";
import { useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import GuideCard from "../../../../../components/GuideCard";

type GuideListItemProps = {
  guide: IGuide,
  editGuide: (guide: IGuide) => void
  viewGuide: (guide: IGuide) => void
}

export default function GuideListItem({ guide, editGuide, viewGuide }: GuideListItemProps) {
  const [showMenu, setShowMenu] = useState(false)

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

  const view = () => {
    hideMenu()
    viewGuide(guide)
  }

  return (
    <GuideCard
      onPress={view}
      guide={guide}
      cardTitleRight={() => {
        return <Menu
          visible={showMenu}
          onDismiss={hideMenu}
          anchor={<IconButton icon={'dots-vertical'} onPress={openMenu} />}
        >
          <Menu.Item title={'Visualizar'} onPress={view} />
          <Menu.Item title={'Editar guia'} onPress={edit} />
        </Menu>
      }} />
  )
}