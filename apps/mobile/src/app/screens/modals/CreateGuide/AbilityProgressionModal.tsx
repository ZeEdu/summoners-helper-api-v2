import React, { useState } from "react";
import { Dimensions, FlatList, Image, Pressable, ScrollView, View } from "react-native";
import { Appbar, Modal, Portal, Snackbar, Text, useTheme } from "react-native-paper";

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
  const { version } = usePatchVersion()
  const { height } = Dimensions.get("window")

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
          <StyledView style={{ height }}>
            <Appbar.Header>
              <Appbar.BackAction onPress={closeModal} />
              <Appbar.Content title="Progressão de habilidades" />
              <Appbar.Action icon="magnify" onPress={() => { console.log({ draft }) }} />
              <Appbar.Action icon="check" onPress={handleModalDissmis} />
            </Appbar.Header>
            <View style={{ flexDirection: 'row' }}>
              {/* Header */}
              {
                abilities.map((ability, index) => {
                  return (
                    <View
                      key={ability.id}
                      style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}
                    >
                      <Image
                        style={{ width: 64, height: 64, borderRadius: 15 }}
                        source={{ uri: `https://cdn.communitydragon.org/${version}/champion/${championId}/ability-icon/${indexToKeyMap[(index as indexKeyType)]}` }}
                      />
                      <Text style={{ textAlign: 'center' }}>{ability.name}</Text>
                    </View>
                  )
                })
              }
            </View>
            {/* Body */}
            <ScrollView>
              <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                {abilities.map((_, index) => {
                  return (
                    <FlatList
                      data={Array.from({ length: CHAPIOM_LEVELS }, (_, i) => i + 1)}
                      keyExtractor={(level) => level.toString()}
                      style={{ flex: 1 }}
                      renderItem={({ item: level }) => {
                        return (
                          <Pressable
                            onPress={() => setFieldOnDraft(level, index)}
                            style={{
                              marginHorizontal: 'auto',
                              marginTop: 16,
                              width: 64,
                              height: 64,
                              backgroundColor: isSelected(level, index) ? theme.colors.onPrimaryContainer : theme.colors.onPrimary,
                              borderRadius: 15,
                              display: "flex",
                              justifyContent: 'center'
                            }}
                          >
                            <Text
                              style={{
                                textAlign: 'center',
                                color: isSelected(level, index) ? theme.colors.onPrimary : theme.colors.onPrimaryContainer
                              }}
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