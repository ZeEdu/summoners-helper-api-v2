import { GuideDto } from "@org/contracts";
import { useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import GuideCard from "../../../../../components/GuideCard";
import useI18n from "../../../../../contexts/i18n/useI18n";

type GuideListItemProps = {
  guide: GuideDto,
  editGuide: (guide: GuideDto) => void
  viewGuide: (guide: GuideDto) => void
}

export default function GuideListItem({ guide, editGuide, viewGuide }: GuideListItemProps) {
  const i18n = useI18n()

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
          <Menu.Item title={i18n.t('guideListItem.view')} onPress={view} />
          <Menu.Item title={i18n.t('guideListItem.edit')} onPress={edit} />
        </Menu>
      }} />
  )
}