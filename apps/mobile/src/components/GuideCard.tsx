import { Image, StyleSheet, View } from "react-native"
import { Card, Chip, MD3Theme, Text, useTheme } from "react-native-paper"

import { GuideDto } from "@org/contracts"

import { ReactNode } from "react"
import { usePatchVersion } from "../contexts/patchVersion/usePatchVersion"
import DataDragonService from "../services/data-dragon/data-dragon.service"


type GuideCardProps = {
  onPress: () => void,
  guide: GuideDto,
  cardTitleRight?: () => ReactNode
}

export default function GuideCard({ guide, onPress, cardTitleRight }: GuideCardProps) {
  const usePatch = usePatchVersion()

  const styles = makeStyles(useTheme())

  return (
    <Card onPress={onPress}>
      <Card.Title
        title={guide.title}
        left={() => {
          const uri = DataDragonService.championThumbnail(guide.champion, usePatch.version)
          return <Image style={styles.cardTitleImage} source={{ uri }} />
        }}
        right={cardTitleRight}
      />
      <Card.Content>
        <Text variant='bodyMedium' numberOfLines={3}>
          {guide.introduction}
        </Text>
        <View
          style={styles.chipRow}
        >
          <Chip>{guide.champion}</Chip>
          <Chip>{guide.patchVersion}</Chip>
        </View>
      </Card.Content>
    </Card>
  )
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    cardTitleImage: {
      width: 48,
      height: 48,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.primary
    },
    chipRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 8
    },
  })
}