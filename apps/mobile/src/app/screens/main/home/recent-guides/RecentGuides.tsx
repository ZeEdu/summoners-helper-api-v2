import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text, useTheme } from "react-native-paper";


import { GuidePaginationDto, IGuide } from "@org/contracts";

import FadeInView from "../../../../../components/animated/FadeInView";
import Error from "../../../../../components/Error";
import LoadingIndicator from "../../../../../components/LoadingIndicator";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import { ApiService } from "../../../../../services/api/api.service";
import DataDragonService from "../../../../../services/data-dragon/data-dragon.service";

type RecentBuildsProps = {
  navigateToGuide: (guide: IGuide) => void
}

export default function RecentBuilds({ navigateToGuide }: RecentBuildsProps) {
  const usePatch = usePatchVersion()
  const theme = useTheme()

  const [guides, setGuides] = useState<IGuide[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const defaultQuery: GuidePaginationDto = {
    limit: 10,
  }

  const [query, setQuery] = useState<GuidePaginationDto>({ ...defaultQuery })

  useEffect(() => {
    const getBuilds = async () => {
      setLoading(true);
      setError('');

      ApiService.Guides.get(query)
        .then(({ guides }) => {
          setGuides((previous) => {
            if (query.offset && (query.offset > 0)) {
              return previous.concat(guides)
            }
            return guides
          });
        })
        .catch(() => {
          setError('Erro ao buscar builds');
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getBuilds()
  }, [query])

  const loadMore = () => {
    setQuery((previous) => {
      if (!previous.offset) {
        return { ...previous, offset: 1 }
      }
      return { ...previous, offset: previous.offset + 1 }
    })
  }

  const reload = () => {
    setQuery({ ...defaultQuery })
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <Text variant="displaySmall">
          Guias Recentes
        </Text>
      </View>
      <View style={{
        flex: 1,
        paddingVertical: 8,
        borderRadius: theme.roundness
      }}>
        {
          loading && <LoadingIndicator />
        }

        {
          Boolean(error) ? (
            <Error>
              <Button onPress={reload}>
                Ops! Um erro ocorreu... Clique para tentar novamente!
              </Button>
            </Error>
          ) : null
        }

        {
          guides.length ? (
            <FadeInView style={{ flex: 1 }}>
              <FlatList
                contentContainerStyle={{ rowGap: 8, paddingHorizontal: 16 }}
                data={guides}
                ListFooterComponent={() => {
                  return (
                    <View>
                      <Button onPress={loadMore}>
                        Carregar mais
                      </Button>
                    </View>
                  )
                }}
                renderItem={({ item: guide }) => {
                  return (
                    <Card onPress={() => {
                      navigateToGuide(guide)
                    }}>
                      <Card.Title
                        title={guide.title}
                        left={() => {
                          const uri = DataDragonService.championThumbnail(guide.champion, usePatch.version)
                          return <Image style={{ width: 48, height: 48 }} source={{ uri }} />
                        }} />
                      <Card.Content>
                        <Text variant='bodyMedium' numberOfLines={3}>
                          {guide.introduction}
                        </Text>
                        <View
                          style={{ flexDirection: "row", gap: 8, marginTop: 8 }}
                        >
                          <Chip>{guide.champion}</Chip>
                          <Chip>{guide.patchVersion}</Chip>
                        </View>
                      </Card.Content>
                    </Card>
                  )
                }}
              />

            </FadeInView>
          ) : null
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1
  }
})