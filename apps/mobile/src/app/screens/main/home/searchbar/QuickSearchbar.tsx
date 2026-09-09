import React, { useRef, useState } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { MD3Theme, Portal, Searchbar, Surface, Text, useTheme } from "react-native-paper"
import { IGuide } from "../../../../../../../../libs/contracts/src"
import FadeInView from "../../../../../components/animated/FadeInView"
import Error from "../../../../../components/Error"
import LoadingIndicator from "../../../../../components/LoadingIndicator"
import useQuickSearch from "../../../../../hooks/useQuickSearch"
import QuickSearchCard from "./QuickSearchCard"

type QuickSearchbarProps = {
  navigateToGuide: (guide: IGuide) => void
}

export default function QuickSearchbar({ navigateToGuide }: QuickSearchbarProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const [searchQuery, setSearchQuery] = useState('')

  const { guides, loading, error } = useQuickSearch(searchQuery)

  const anchorRef = useRef<View>(null);

  const [anchor, setAnchor] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

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
      <View
        ref={anchorRef}
        onLayout={updateAnchor}
      >
        <Searchbar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={updateAnchor}
          placeholder='Busque por um guia'
          onClearIconPress={() => {
            setSearchQuery('')
          }}
        />
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
                <Surface
                  style={
                    styles.listSurface}
                >
                  <FadeInView>
                    <FlatList
                      contentContainerStyle={styles.contentContainerStyle}
                      data={guides}
                      renderItem={({ item: guide }) => {
                        return <QuickSearchCard
                          guide={guide}
                          navigateToGuide={navigateToGuide}
                          key={guide._id.toString()}
                        />
                      }}
                    />
                  </FadeInView>
                </Surface>
              ) : (
                Boolean(searchQuery) ? (
                  <Surface
                    style={styles.noResultsSurface}>
                    <Text style={styles.textAlignCenter}>
                      Nenhum resultado encontrado
                    </Text>
                  </Surface>
                ) : null
              )
            }
          </View>
        </View>
      </Portal>
    </View>
  )
}

const makeStyles = ({ roundness, colors }: MD3Theme) => {
  return StyleSheet.create({
    noResultsSurface: {
      borderRadius: roundness,
      marginTop: 8,
      paddingVertical: 16
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