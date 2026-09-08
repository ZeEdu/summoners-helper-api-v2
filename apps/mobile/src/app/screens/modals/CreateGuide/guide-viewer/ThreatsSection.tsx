import React from "react";
import { View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";

import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import useChampionData from "../../../../../hooks/useChampion";
import DataDragonService from "../../../../../services/data-dragon/data-dragon.service";
import { ThreatsDto } from "../forms/ThreatsForm";
import { SectionProps } from "./sections.types";

type ThreatsSection = SectionProps & { threats: ThreatsDto }

export default function ThreatsSection({ threats, hideTitle = false }: ThreatsSection) {
  return (
    <List.Section>
      {
        !hideTitle ? (
          <List.Subheader>
            <Text variant='headlineSmall'>
              Ameaças
            </Text>
          </List.Subheader>
        ) : undefined
      }

      <List.Item title={'Descrição das ameaças'} description={threats.threatsDescription} />
      {
        threats.threats
          .map(({ description, threat }) => (
            <ThreatsSectionRow champion={threat} description={description} />
          ))
      }
    </List.Section>
  )
}

function ThreatsSectionRow({ champion, description }: {
  champion: string,
  description: string
}) {
  const usePatch = usePatchVersion()
  const { championData, error, loading } = useChampionData(champion)

  const uri = DataDragonService.champion(champion, usePatch.version)
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
          <List.Item
            title={championData.name}
            description={description}
            right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={48} />}
          />
        )
      }
    </View>
  )
}