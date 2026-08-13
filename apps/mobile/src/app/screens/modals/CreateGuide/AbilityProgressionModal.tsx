import React, { useState } from "react";
import { Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, MD3Theme, Modal, Portal, Snackbar, Text, useTheme } from "react-native-paper";

import { StyledView } from "@org/ui";

import { usePatchVersion } from "../../../../contexts/patchVersion/usePatchVersion";
import { ChampionsDataDragonDetailsSolo } from "../../../../dtos/champion.dto";

type AbilitiesProgressionModalProps = {
  visible: boolean,
  closeModal: (value?: any) => void,
  abilities: ChampionsDataDragonDetailsSolo['spells'],
  championId: ChampionsDataDragonDetailsSolo['id']
}

type indexKeyType = 0 | 1 | 2 | 3

const indexToKeyMap = {
  0: 'q',
  1: 'w',
  2: 'e',
  3: 'r',
}

enum AbilityOption {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
}

const indexToAbilityOption = {
  0: AbilityOption.A,
  1: AbilityOption.B,
  2: AbilityOption.C,
  3: AbilityOption.D,
}

const CHAPIOM_LEVELS = 18

export default function AbilitiesProgressionField({ visible, abilities, championId, closeModal }: AbilitiesProgressionModalProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const { version } = usePatchVersion()

  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

  const [draft, setDraft] = useState({
    l1: null,
    l2: null,
    l3: null,
    l4: null,
    l5: null,
    l6: null,
    l7: null,
    l8: null,
    l9: null,
    l10: null,
    l11: null,
    l12: null,
    l13: null,
    l14: null,
    l15: null,
    l16: null,
    l17: null,
    l18: null,
  })

  const handleModalDissmis = () => {
    if (!areFieldsValid()) {
      setShowSnackbar(true)
      return
    }
    closeModal(draft)
  }

  const areFieldsValid = () => {
    return Object.keys(draft)
      .map((key) => {
        return (draft as any)[key]
      })
      .every(Boolean)
  }

  const setFieldOnDraft = (level: number, index: number) => {
    const key = `l${level}`
    const value = indexToAbilityOption[index as indexKeyType]

    setDraft((oldValue) => {
      return { ...oldValue, [key]: value }
    })
  }

  const isSelected = (level: number, index: number) => {
    const key = `l${level}`
    const value = indexToAbilityOption[index as indexKeyType]

    return (draft as any)[key] === value
  }

  return (
    <>
      <Portal>
        <Modal
          visible={visible} onDismiss={closeModal}
        >
          <StyledView style={styles.modalContainer}>
            <Appbar.Header>
              <Appbar.BackAction onPress={closeModal} />
              <Appbar.Content title="Progressão de habilidades" />
              <Appbar.Action icon="check" onPress={handleModalDissmis} />
            </Appbar.Header>
            <View style={styles.contentContainer}>
              {/* Header */}
              {
                abilities.map((ability, index) => {
                  const keymap = indexToKeyMap[(index as indexKeyType)]
                  return (
                    <View
                      key={ability.id}
                      style={styles.headerContainer}
                    >
                      <Image
                        style={styles.headerImage}
                        source={{ uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${championId}${keymap.toUpperCase()}.png` }}
                      />
                      <Text style={styles.headerTitle}>{ability.name}</Text>
                    </View>
                  )
                })
              }
            </View>
            {/* Body */}
            <ScrollView>
              <View style={styles.levelContainer}>
                {abilities.map((_, index) => {
                  return (
                    <FlatList
                      data={Array.from({ length: CHAPIOM_LEVELS }, (_, i) => i + 1)}
                      keyExtractor={(level) => level.toString()}
                      style={styles.list}
                      renderItem={({ item: level }) => {
                        return (
                          <Pressable
                            onPress={() => setFieldOnDraft(level, index)}
                            style={[
                              styles.listItemContainer,
                              {
                                backgroundColor: isSelected(level, index) ? theme.colors.onPrimaryContainer : theme.colors.onPrimary,
                              }
                            ]}
                          >
                            <Text
                              style={[styles.listItemText, {
                                color: isSelected(level, index) ? theme.colors.onPrimary : theme.colors.onPrimaryContainer
                              }]}
                            >
                              {level}
                            </Text>
                          </Pressable>
                        )
                      }}
                    />
                  )
                })}
              </View>
            </ScrollView>
          </StyledView>
        </Modal>
      </Portal>
      <Portal>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          action={{
            label: 'Fechar',
            onPress: () => setShowSnackbar(false),
          }}
        >
          Preencha todas as habilidades primeiro
        </Snackbar>
      </Portal>
    </>
  )
}

const makeStyles = ({ roundness }: MD3Theme) => {
  const { height } = Dimensions.get("window")

  return StyleSheet.create({
    modalContainer: {
      height
    },
    contentContainer: {
      flexDirection: 'row'
    },
    headerContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    headerImage: {
      width: 64,
      height: 64,
      borderRadius: roundness
    },
    headerTitle: {
      textAlign: 'center'
    },
    levelContainer: {
      flexDirection: 'row',
      marginBottom: 16
    },
    list: {
      flex: 1
    },
    listItemContainer: {
      marginHorizontal: 'auto',
      marginTop: 16,
      width: 64,
      height: 64,
      borderRadius: roundness,
      display: "flex",
      justifyContent: 'center',


    },
    listItemText: {
      textAlign: 'center',
    }

  })
}