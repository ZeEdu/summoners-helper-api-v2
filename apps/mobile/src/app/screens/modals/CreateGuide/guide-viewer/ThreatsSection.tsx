import React from "react";
import { View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";

import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import useChampionData from "../../../../../hooks/useChampion";
import { ThreatsDto } from "../forms/ThreatsForm";

export default function ThreatsSection({ threats }: { threats: ThreatsDto }) {
  return (
    <List.Section>
      <List.Subheader>
        Ameaças
      </List.Subheader>
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

  const uri = getTileEndpoint(champion, usePatch.version)
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

function getTileEndpoint(championName: string, patchVersion: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${championName}.png`;
}