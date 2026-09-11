import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, MD3Theme, useTheme } from "react-native-paper";


import { GuidePaginationDto, IGuide } from "@org/contracts";

import { useNavigation } from "@react-navigation/native";
import FadeInView from "../../../../../components/animated/FadeInView";
import Error from "../../../../../components/Error";
import GuideCard from "../../../../../components/GuideCard";
import LoadingIndicator from "../../../../../components/LoadingIndicator";
import { ApiService } from "../../../../../services/api/api.service";

export default function RecentGuidesList() {
  const theme = useTheme()
  const styles = makeStyle(theme)
  const navigation = useNavigation()

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
                      onPress={() => {
                        navigation.navigate("ViewGuide", { guide })
                      }}
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
    body: {
      flex: 1,
      borderRadius: roundness
    },
    fadeInView: {
      flex: 1
    },
    flatListContainer: {
      rowGap: 8,
    }
  })
}