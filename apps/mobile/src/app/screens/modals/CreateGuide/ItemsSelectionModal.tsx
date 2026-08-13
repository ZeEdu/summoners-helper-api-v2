import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, ScrollView, View } from "react-native";
import { Appbar, Button, Card, Dialog, Icon, Modal, Portal, Searchbar, Snackbar, Text, TextInput, useTheme } from "react-native-paper";
import z from "zod";

import { StyledView } from "@org/ui";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useFieldArray, UseFieldArrayRemove, useForm, useFormContext } from "react-hook-form";
import PatchVersionProvider from "../../../../contexts/patchVersion/patch-version.provider";
import { usePatchVersion } from "../../../../contexts/patchVersion/usePatchVersion";
import { ItemDetails, ItemsDataDragon } from "../../../../dtos/item.dto";
import { ItemSelectionProvider, useItemSelectionContext } from "./context/itemSelectionProvider";

type AbilitiesProgressionModalProps = {
  visible: boolean,
  closeModal: (value?: any) => void,
}

interface ItemDetailsWithId extends ItemDetails {
  id: string
}

const itemArraySchema = z.object({
  itemId: z.string({ error: 'formato do campo é inválido' }),
})

const itemSchema = z.object(
  {
    itemRollName: z.string({ error: 'formato do campo é inválido' }),
    itemArray: z.array(itemArraySchema),
    description: z.string({ error: 'formato do campo é inválido' }),
  }
)

const itemsBlockSchema = z.object({
  itemsBlock: z.array(itemSchema)
})

type ItemsBlockDto = z.infer<typeof itemsBlockSchema>

const resolver = zodResolver(itemsBlockSchema)

type ItemArrayFieldProps = {
  id: string;
  index: number;
  itemsMap: {
    [key: string]: ItemDetails;
  }
}


type ItemProps = {
  index: number
  itemId: string,
  removeItem: UseFieldArrayRemove,
}

function Item({ itemId, index, removeItem }: ItemProps) {
  const theme = useTheme()
  const { version } = usePatchVersion()

  const [visible, setVisible] = useState(false)

  return (
    <>
      {/* TODO: Trocar para um onLongPress após os testes */}
      <Pressable style={{ maxWidth: 52 }} onPress={() => {
        setVisible(true)
      }}>
        <Image source={{ uri: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png` }} style={{ width: 48, height: 48, borderRadius: theme.roundness }} />
      </Pressable>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Tem certeza?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">O item será removido da lista</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancelar</Button>
            <Button onPress={() => removeItem(index)}>Tenho certeza</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

function ItemArrayField({ id, index }: ItemArrayFieldProps) {
  const theme = useTheme()

  const { control } = useFormContext()
  const itemSelectionContext = useItemSelectionContext()

  const {
    fields: childrens,
    append: appendChild,
    remove: removeChild
  } = useFieldArray({
    name: `itemsBlock.${index}.itemArray`
  })

  const handleAppend = (value: any) => {
    appendChild({ itemId: value })
  }

  return (
    <Pressable key={id}>
      <View>
        <Controller
          control={control}
          name={`itemsBlock.${index}.itemRollName`}
          render={({ field: { onChange, onBlur, value } }) => {
            return <TextInput
              placeholder="Nome do bloco de itens"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          }}
        />
        <FlatList
          data={[...childrens, { showAddMoreButton: true }]}
          horizontal={true}
          contentContainerStyle={{ margin: 8, gap: 8 }}
          renderItem={({ item }) => {
            const forceCasting = item as any

            if (forceCasting.showAddMoreButton) {
              return (
                <Pressable
                  onPress={() => {
                    itemSelectionContext.setShowItemSearcher(true)
                    itemSelectionContext.setAppendFunction(() => handleAppend)
                  }}
                >
                  <Icon source='plus' size={48} color={theme.colors.onPrimaryContainer}></Icon>
                </Pressable>
              )
            }

            return <Item key={index} index={index} itemId={forceCasting.itemId} removeItem={removeChild} />
          }}
        />

        <Controller
          control={control}
          name={`itemsBlock.${index}.description`}
          render={({ field: { onChange, onBlur, value } }) => {
            return <TextInput
              multiline={true}
              placeholder="Descrição do bloco de itens"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          }}
        />
      </View>
    </Pressable>
  )
}


type ItemSelectionModalContentProps = {
  visible: boolean,
  loading: boolean,
  closeModal: (value?: any) => void,
  setShowSnackbar: (value: React.SetStateAction<boolean>) => void,
  searchQuery: string,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
  searchList: ItemDetailsWithId[],
  // TODO TEMPORARIO
  itemsMap: {
    [key: string]: ItemDetails;
  }
}

function ItemSelectionModalContent({
  visible,
  loading,
  searchList,
  searchQuery,
  closeModal,
  setShowSnackbar,
  setSearchQuery,
  itemsMap
}: ItemSelectionModalContentProps) {
  const theme = useTheme()
  const { version } = usePatchVersion()

  const itemSelectionContext = useItemSelectionContext()

  const methods = useForm<ItemsBlockDto>({
    resolver
  })
  const { control, handleSubmit, getValues } = methods
  const { append, remove, fields } = useFieldArray({ control, name: 'itemsBlock' })
  const { height } = Dimensions.get("window")

  const handleModalDissmis = () => {
    if (!areFieldsValid()) {
      setShowSnackbar(true)
      return
    }
    const currentValues = getValues()
    console.log({ currentValues });
    // TODO: Validar melhor isso daqui
    if (currentValues) {
      closeModal(currentValues)
    }
    closeModal()
  }

  const areFieldsValid = () => {
    return false
  }

  const addNewBlock = () => {
    append({ itemArray: [], itemRollName: '', description: '' })
  }

  const removeBlock = (index: number) => {
    remove(index)
  }

  const checkCurrentValue = (value: ItemsBlockDto) => {
    console.log({ value });
  }

  return (
    <Modal
      visible={visible}
      onDismiss={closeModal}
    >
      <StyledView
        style={{ height }}
      >
        <Appbar.Header>
          <Appbar.BackAction onPress={closeModal} />
          <Appbar.Content title="Seleção de itens" />
          <Appbar.Action icon="magnify" onPress={handleSubmit(checkCurrentValue)} />
          <Appbar.Action icon="check" onPress={handleSubmit(handleModalDissmis)} />
        </Appbar.Header>
        {loading ?
          (
            <View>
              <Text>Carregando</Text>
            </View>
          )
          : (
            <>
              <Button style={{ margin: 16, }} mode="contained" onPress={addNewBlock}>Adicionar um novo bloco</Button>
              <ScrollView>
                {/* Body */}
                <FormProvider {...methods}>
                  <View style={{ flexDirection: 'column', marginBottom: 16, marginHorizontal: 16 }}>
                    {fields.map((field, index) => {
                      return <View key={field.id}>
                        <ItemArrayField id={field.id} index={index} itemsMap={itemsMap} />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                          <Button mode="contained" style={{ borderWidth: 1, alignSelf: 'flex-start' }} onPress={() => {
                            removeBlock(index)
                          }}>
                            Remover bloco
                          </Button>
                        </View>
                      </View>
                    })}
                  </View>
                </FormProvider>
              </ScrollView>
              {itemSelectionContext.showItemSearcher ? (
                <View>
                  {/* 
                        Jogar isso para um Portal
                        Para que a lista não seja renderizada junto do conteúdo que já existe
                     */}
                  {searchList.length ? <ScrollView style={{ maxHeight: 420 }}>
                    <FlatList
                      data={searchList}
                      keyExtractor={({ id }) => id}
                      contentContainerStyle={{ margin: 8 }}
                      renderItem={({ item }) => {
                        const { name, image, description, id } = item

                        const parser = new DOMParser()
                        const doc = parser.parseFromString(description, 'text/html')
                        const parsedDescription = doc.body.textContent || ''

                        const itemImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${image.full}`

                        return (
                          <Card style={{ marginBottom: 8 }}>
                            <Card.Title
                              title={name}
                              left={() => {
                                return <Image
                                  style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: theme.roundness
                                  }}
                                  source={{ uri: itemImageUrl }}
                                />
                              }}
                            />
                            <Card.Content>
                              <Text variant="bodyMedium">{parsedDescription.trim()}</Text>
                            </Card.Content>
                            <Card.Actions>
                              <Button onPress={() => {
                                itemSelectionContext.setShowItemSearcher(false)
                                itemSelectionContext.appendFunction(id)
                              }}>Adicionar</Button>
                            </Card.Actions>
                          </Card>
                        )
                      }} />
                  </ScrollView> : null}
                  <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    loading={loading}
                  />
                </View>
              ) : null}
            </>
          )
        }
      </StyledView>
    </Modal >
  )
}

export default function ItemsSelectionModal({ visible, closeModal }: AbilitiesProgressionModalProps) {
  const { version } = usePatchVersion()

  const [searchQuery, setSearchQuery] = useState('');
  const [searchList, setSearchList] = useState<ItemDetailsWithId[]>([])

  const [items, setItems] = useState<ItemDetailsWithId[]>([])
  const [itemsMap, setItemsMap] = useState<ItemsDataDragon['data'] | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

  useEffect(() => {
    if (!searchQuery) {
      setSearchList([])
      return
    }
    // TODO: Expandir as regras de match
    const matchedItems = items.filter(({ name }) => name.toLocaleLowerCase().includes(searchQuery.toLowerCase()))
    if (matchedItems.length) {
      setSearchList(matchedItems)
    } else {
      setSearchList([])
    }
  }, [searchQuery])

  useEffect(() => {
    async function loadItems() {
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/item.json`)
      const json = await response.json() as ItemsDataDragon
      const itemsWithId = Object.keys(json.data).map((key) => ({ ...json.data[key], id: key }))
      setItems(itemsWithId)
      setItemsMap(json.data)
    }

    setError(null)
    setLoading(true)
    loadItems()
      .catch(() => {
        setError('Não foi possível carregar os dados do campeão')
        setShowSnackbar(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])


  if (!itemsMap) {
    return (
      <View>
        <Text>Carregando</Text>
      </View>
    )
  }

  return (
    <>
      <Portal>
        <PatchVersionProvider>
          <ItemSelectionProvider>
            <ItemSelectionModalContent
              visible={visible}
              loading={loading}
              closeModal={closeModal}
              setShowSnackbar={setShowSnackbar}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchList={searchList}
              itemsMap={itemsMap}
            />
          </ItemSelectionProvider>
        </PatchVersionProvider>
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
          {error}
        </Snackbar>
      </Portal>
    </>
  )
}