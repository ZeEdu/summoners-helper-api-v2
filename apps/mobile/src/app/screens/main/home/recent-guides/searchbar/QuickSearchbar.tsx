import { useNavigation } from "@react-navigation/native"
import React, { useRef, useState } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { Button, MD3Theme, Portal, Searchbar, Surface, Text, useTheme } from "react-native-paper"

import { GuideDto } from "@org/contracts"

import Error from "../../../../../../components/Error"
import LoadingIndicator from "../../../../../../components/LoadingIndicator"
import useI18n from "../../../../../../contexts/i18n/useI18n"
import useGuideQuickSearch from "../../../../../../hooks/useQuickSearch"
import QuickSearchCard from "./QuickSearchCard"

type QuickSearchbarProps = {
  navigateToGuide: (guide: GuideDto) => void
}

export default function QuickSearchbar({ navigateToGuide }: QuickSearchbarProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const [searchQuery, setSearchQuery] = useState('')
  const navigation = useNavigation()
  const i18n = useI18n()

  const { guides, loading, error, reset } = useGuideQuickSearch(searchQuery)

  const anchorRef = useRef<View>(null);

  const [anchor, setAnchor] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const clear = () => {
    reset()
    setSearchQuery('')
  }

  const updateAnchor = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({
        x,
        y,
        width,
        height,
      });
    });
  };

  if (error) {
    return <Error />
  }

  return (
    <View>
      <View>
        <View ref={anchorRef}
          onLayout={updateAnchor}>
          <Searchbar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={updateAnchor}
            placeholder={i18n.t('quickSearchbar.searchbarPlaceholder')}
            onClearIconPress={clear}
          />
        </View>
        <View style={styles.advancedSearchButtonContainer}>
          <Button icon='cog' onPress={() => {
            navigation.navigate('MainTabs', {
              screen: 'Home',
              params: {
                screen: 'Search'
              }
            })
          }}>
            {i18n.t('quickSearchbar.advancedSearchButton')}
          </Button>
        </View>
      </View>
      <Portal>
        <View
          pointerEvents="box-none"
          style={StyleSheet.absoluteFill}>
          <View style={{
            ...styles.portalPosition,
            left: anchor.x,
            top: anchor.y + anchor.height,
            width: anchor.width,
          }}>
            {
              loading ? <LoadingIndicator /> : null
            }

            {
              guides.length ? (
                <Surface style={styles.listSurface}>
                  <FlatList
                    contentContainerStyle={styles.contentContainerStyle}
                    data={guides}
                    renderItem={({ item: guide }) => {
                      const navigateToGuideAndClearList = (guide: GuideDto) => {
                        navigateToGuide(guide)
                        clear()
                      }

                      return <QuickSearchCard
                        navigateToGuide={navigateToGuideAndClearList}
                        guide={guide}
                        key={guide.id}
                      />
                    }}
                  />
                </Surface>
              ) : (
                Boolean(searchQuery) ? (
                  <Surface
                    style={styles.noResultsSurface}>
                    <Text style={styles.textAlignCenter}>
                      {i18n.t('quickSearchbar.emptyText')}
                    </Text>
                  </Surface>
                ) : null
              )
            }
          </View>
        </View>
      </Portal>
    </View >
  )
}

const makeStyles = ({ roundness, colors }: MD3Theme) => {
  return StyleSheet.create({
    noResultsSurface: {
      borderRadius: roundness,
      marginTop: 8,
      paddingVertical: 16
    },
    advancedSearchButtonContainer: {
      alignItems: 'flex-end',
      paddingVertical: 4
    },
    contentContainerStyle: {
      padding: 8,
      rowGap: 8
    },
    textAlignCenter: {
      textAlign: 'center'
    },
    listSurface: {
      borderRadius: roundness,
      marginTop: 8,
      backgroundColor: colors.elevation.level5
    },
    portalPosition: {
      position: 'absolute',
      maxHeight: 250,
      elevation: 5
    }
  })
}