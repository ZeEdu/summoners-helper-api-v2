import { View } from "react-native"
import { Avatar, List, Text } from "react-native-paper"

import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion"
import useChampionData from "../../../../../hooks/useChampion"
import { GuideIntroductionDto } from "../forms/GuideIntroductionForm"

export default function IntroductionSection({ guideIntroduction }: { guideIntroduction: GuideIntroductionDto }) {
  const usePatch = usePatchVersion()
  const { championData, error, loading } = useChampionData(guideIntroduction.champion)
  const uri = getTileEndpoint(guideIntroduction.champion, usePatch.version)

  return (
    <View>
      {
        loading && (
          <View>
            <Text>Carregando</Text>
          </View>
        )
      }

      {Boolean(error) && (
        <View>
          <Text>Um erro ocorreu no ao carregar os dados </Text>
        </View>
      )}

      {
        !!championData && (
          <List.Section>
            <List.Subheader>
              <Text variant='headlineSmall'>
                Informações Gerais
              </Text>
            </List.Subheader>
            <List.Item title={'Título'} description={guideIntroduction.title} />
            <List.Item title={'Introdução'} description={guideIntroduction.introduction} />
            <List.Item title={'Campeão'} description={championData.name} right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={48} />} />
            {/* <List.Item title={'Função'} description={ROLES_LABEL[guideIntroduction.role]} /> */}
          </List.Section>
        )
      }
    </View>
  )
}

function getTileEndpoint(championName: string, patchVersion: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${championName}.png`;
}