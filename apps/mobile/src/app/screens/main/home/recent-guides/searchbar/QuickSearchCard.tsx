import { Image, StyleSheet } from "react-native"
import { Card } from "react-native-paper"

import { GuideDto } from "@org/contracts"

import { usePatchVersion } from "../../../../../../contexts/patchVersion/usePatchVersion"
import DataDragonService from "../../../../../../services/data-dragon/data-dragon.service"

type QuickSearchCardProps = {
  guide: GuideDto,
  navigateToGuide: (guide: GuideDto) => void
}

export default function QuickSearchCard({ guide, navigateToGuide }: QuickSearchCardProps) {
  const usePatch = usePatchVersion()
  const uri = DataDragonService.championThumbnail(guide.champion, usePatch.version)

  return (
    <Card onPress={() => {
      navigateToGuide(guide)
    }}>
      <Card.Title
        title={guide.title}
        subtitle={guide.introduction}
        left={() => (
          <Image
            style={style.imageDimension}
            source={{ uri }}
          />)}
      />
    </Card>
  )
}

const style = StyleSheet.create({
  imageDimension: {
    width: 48,
    height: 48
  }
})