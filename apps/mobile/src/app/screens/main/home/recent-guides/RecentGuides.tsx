import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";


import { GuidePaginationDto, IGuide } from "@org/contracts";

import FadeInView from "../../../../../components/animated/FadeInView";
import Error from "../../../../../components/Error";
import GuideCard from "../../../../../components/GuideCard";
import LoadingIndicator from "../../../../../components/LoadingIndicator";
import { ApiService } from "../../../../../services/api/api.service";

type RecentBuildsProps = {
  navigateToGuide: (guide: IGuide) => void
}

export default function RecentBuilds({ navigateToGuide }: RecentBuildsProps) {
  const theme = useTheme()
  const styles = makeStyle(theme)

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
    <View style={styles.container}>
      <View style={styles.title}>
        <Text variant="displaySmall">
          Guias Recentes
        </Text>
      </View>
      <View style={styles.body}>
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
            <FadeInView style={styles.fadeInView}>
              <FlatList
                contentContainerStyle={styles.flatListContainer}
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
                    <GuideCard
                      onPress={() => navigateToGuide(guide)}
                      guide={guide}
                    />
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

const makeStyle = ({ roundness }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1
    },
    title: {
      marginHorizontal: 16,
      marginBottom: 16
    },
    body: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: roundness
    },
    fadeInView: {
      flex: 1
    },
    flatListContainer: {
      rowGap: 8, paddingHorizontal: 16
    },
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
}