import { Image } from "react-native"
import { Card } from "react-native-paper"
import { IGuide } from "../../../../../../../../libs/contracts/src"
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion"
import DataDragonService from "../../../../../services/data-dragon/data-dragon.service"

type QuickSearchCardProps = {
  guide: IGuide,
  navigateToGuide: (guide: IGuide) => void
}

export default function QuickSearchCard({ guide, navigateToGuide }: QuickSearchCardProps) {
  const usePatch = usePatchVersion()

  return (
    <Card onPress={() => {
      navigateToGuide(guide)
    }}>
      <Card.Title
        title={guide.title}
        subtitle={guide.introduction}
        left={() => (
          <Image
            style={{ width: 48, height: 48 }}
            source={{ uri: DataDragonService.championThumbnail(guide.champion, usePatch.version) }}
          />)}
      />
    </Card>
  )
}