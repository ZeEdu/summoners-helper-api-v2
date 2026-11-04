import { useState } from "react"
import { View } from "react-native"
import { IconButton, Menu } from "react-native-paper"

import { ISerializedComment } from "@org/contracts"

import useI18n from "../../../../contexts/i18n/useI18n"

type Props = {
  comment: ISerializedComment,
  reportComment: (comment: ISerializedComment) => void,
  onClick: () => void,
}

export default function SideMenu({ comment, reportComment, onClick }: Props) {
  const i18n = useI18n()

  const [visible, setVisible] = useState(false)

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <IconButton icon='dots-vertical' size={24} onPress={() => setVisible(true)} />
        }>
        <Menu.Item
          onPress={() => {
            onClick()
            setVisible(false)
            reportComment(comment)
          }}
          title={i18n.t('sideMenu.report')}
        />
      </Menu>
    </View>
  )
}