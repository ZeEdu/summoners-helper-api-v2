import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { FlatList, Image, StyleSheet } from "react-native"
import { Card, FAB, MD3Theme, useTheme } from "react-native-paper"

import { StyledView } from "@org/ui"

import { MainTabsParamList, RootStackParamList } from "../../../navigation/types"

export type MyBuildsProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'MyBuilds'>,
  NativeStackScreenProps<RootStackParamList>
>

function getTileEndpoint(championName: string) {
  return `https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/${championName}.png`
}

const mockGuideList = [
  {
    title: 'lorem',
    createdAt: new Date(),
    patch: '16.13.1',
    champion: {
      name: 'Ahri',
      id: "Ahri",
    }
  },
  {
    title: 'ipsum',
    createdAt: new Date(),
    patch: '16.13.1',
    champion: {
      name: 'Aatrox',
      id: "Aatrox",
    }
  }
]

export default function MyBuilds({ navigation }: MyBuildsProps) {
  const theme = useTheme()
  const style = makeStyles(theme)

  const handleCreateGuide = () => {
    navigation.navigate('Modals', {
      screen: 'CreateGuide',
      params: {}
    })
  }

  return (
    <>
      <StyledView>
        <FlatList data={mockGuideList} renderItem={({ item }) => {
          const { champion, title, patch } = item
          return <Card.Title
            key={champion.id}
            title={title}
            subtitle={`Campeão: ${champion.name}. Patch: ${patch}.`}
            left={() => <Image style={style.championSprite} source={{ uri: getTileEndpoint(champion.id) }} />}
          />
        }} />
      </StyledView>
      <FAB style={style.fab} icon={'plus'} onPress={handleCreateGuide}></FAB>
    </>
  )
}

const makeStyles = (_: MD3Theme) => {
  return StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0
    },
    championSprite: {
      width: 48,
      height: 48
    }
  })
}
