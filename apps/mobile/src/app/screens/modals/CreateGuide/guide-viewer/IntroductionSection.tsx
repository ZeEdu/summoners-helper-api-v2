import { StyleSheet, View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";

import { getRoleLabel } from "@org/contracts";

import FadeInView from "../../../../../components/animated/FadeInView";
import Error from "../../../../../components/Error";
import LoadingIndicator from "../../../../../components/LoadingIndicator";
import useI18n from "../../../../../contexts/i18n/useI18n";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import useChampionData from "../../../../../hooks/useChampion";
import DataDragonService from "../../../../../services/data-dragon/data-dragon.service";
import { GuideIntroductionDto } from "../forms/GuideIntroductionForm";
import { SectionProps } from "./sections.types";

type IntroductionSectionProps = SectionProps & { guideIntroduction: GuideIntroductionDto }

export default function IntroductionSection({ guideIntroduction, hideTitle = false }: IntroductionSectionProps) {
  const usePatch = usePatchVersion()
  const i18n = useI18n()
  const { championData, error, loading } = useChampionData(guideIntroduction.champion)
  const uri = DataDragonService.championThumbnail(guideIntroduction.champion, usePatch.version)

  return (
    <View>
      {
        loading && (
          <LoadingIndicator />
        )
      }

      {
        Boolean(error) && (
          <Error />
        )
      }

      {
        !!championData && (
          <FadeInView>
            <List.Section>
              {
                !hideTitle ? (
                  <List.Subheader>
                    <Text variant='headlineSmall'>
                      {i18n.t('introductionSection.header')}
                    </Text>
                  </List.Subheader>
                ) : undefined
              }
              <List.Item title={'Introdução'} description={guideIntroduction.introduction} />
              <List.Item title={'Campeão'} description={championData.name} right={() => <Avatar.Image style={styles.image} source={{ uri }} size={48} />} />
              <List.Item title={'Função'} description={getRoleLabel(guideIntroduction.role)} />
            </List.Section>
          </FadeInView>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'transparent'
  }
})