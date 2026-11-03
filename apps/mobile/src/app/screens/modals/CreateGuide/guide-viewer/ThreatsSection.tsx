import React from "react";
import { View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";

import FadeInView from "../../../../../components/animated/FadeInView";
import Error from "../../../../../components/Error";
import LoadingIndicator from "../../../../../components/LoadingIndicator";
import useI18n from "../../../../../contexts/i18n/useI18n";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import useChampionData from "../../../../../hooks/useChampion";
import DataDragonService from "../../../../../services/data-dragon/data-dragon.service";
import { ThreatsDto } from "../forms/ThreatsForm";
import { SectionProps } from "./sections.types";

type ThreatsSection = SectionProps & { threats: ThreatsDto }

export default function ThreatsSection({ threats, hideTitle = false }: ThreatsSection) {
  const i18n = useI18n()
  return (
    <FadeInView>
      <List.Section>
        {
          !hideTitle ? (
            <List.Subheader>
              <Text variant='headlineSmall'>
                {i18n.t('threatsSection.header')}
              </Text>
            </List.Subheader>
          ) : undefined
        }

        <List.Item title={i18n.t('threatsSection.description')} description={threats.threatsDescription} />
        {
          threats.threats
            .map(({ description, threat }) => (
              <ThreatsSectionRow champion={threat} description={description} />
            ))
        }
      </List.Section>
    </FadeInView>
  )
}

function ThreatsSectionRow({ champion, description }: {
  champion: string,
  description: string
}) {
  const usePatch = usePatchVersion()
  const { championData, error, loading } = useChampionData(champion)

  const uri = DataDragonService.championThumbnail(champion, usePatch.version)
  return (
    <View>
      {
        loading && <LoadingIndicator />
      }

      {
        Boolean(error) && <Error />
      }

      {
        !!championData && (
          <FadeInView>
            <List.Item
              title={championData.name}
              description={description}
              right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={48} />}
            />
          </FadeInView>
        )
      }
    </View>
  )
}