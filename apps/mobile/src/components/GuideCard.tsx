import { Image, StyleSheet, View } from "react-native"
import { Card, Chip, Text } from "react-native-paper"

import { IGuide } from "@org/contracts"

import { usePatchVersion } from "../contexts/patchVersion/usePatchVersion"
import DataDragonService from "../services/data-dragon/data-dragon.service"


type GuideCardProps = {
  onPress: () => void,
  guide: IGuide
}

export default function GuideCard({ guide, onPress }: GuideCardProps) {
  const usePatch = usePatchVersion()

  return (
    <Card onPress={onPress}>
      <Card.Title
        title={guide.title}
        left={() => {
          const uri = DataDragonService.championThumbnail(guide.champion, usePatch.version)
          return <Image style={styles.cardTitleImage} source={{ uri }} />
        }} />
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

const styles = StyleSheet.create({
  cardTitleImage: {
    width: 48,
    height: 48
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8
  },
})