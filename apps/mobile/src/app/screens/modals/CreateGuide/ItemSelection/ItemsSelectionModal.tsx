import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Card, MD3Theme, Modal, Portal, Searchbar, Snackbar, Text, useTheme } from "react-native-paper";
import z from "zod";

import { StyledView } from "@org/ui";

import PatchVersionProvider from "../../../../../contexts/patchVersion/patch-version.provider";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import { ItemDetails, ItemsDataDragon } from "../../../../../dtos/item.dto";
import { ItemSelectionProvider, useItemSelectionContext } from "../context/ItemSelectionProvider";
import ItemArrayField from "./ItemArrayFields";

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
    itemRollName: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
    itemArray: z.array(itemArraySchema).min(1, { error: 'É obrigátorio ter ao menos um item' }),
    description: z.string({ error: 'formato do campo é inválido' }).min(1, { error: 'Campo obrigatório' }),
  }
)

const itemsBlockSchema = z.object({
  itemsBlock: z.array(itemSchema)
})

export type ItemsBlockDto = z.infer<typeof itemsBlockSchema>

const resolver = zodResolver(itemsBlockSchema)

type ItemSelectionModalContentProps = {
  visible: boolean,
  loading: boolean,
  closeModal: (value?: any) => void,
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
  setSearchQuery,
  itemsMap
}: ItemSelectionModalContentProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const { version } = usePatchVersion()

  const itemSelectionContext = useItemSelectionContext()

  const methods = useForm<ItemsBlockDto>({
    resolver
  })
  const { control, handleSubmit } = methods
  const { append, remove, fields } = useFieldArray({ control, name: 'itemsBlock' })

  const handleModalDissmis = (values: ItemsBlockDto) => {
    closeModal(values)
  }

  const addNewBlock = () => {
    append({ itemArray: [], itemRollName: '', description: '' })
  }

  const removeBlock = (index: number) => {
    remove(index)
  }

  return (
    <Modal
      visible={visible}
      onDismiss={closeModal}
    >
      <StyledView
        style={styles.container}
      >
        <Appbar.Header>
          <Appbar.BackAction onPress={closeModal} />
          <Appbar.Content title="Seleção de itens" />
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
              <Button style={styles.newBlockButton} mode="contained" onPress={addNewBlock}>Adicionar um novo bloco</Button>
              <ScrollView>
                <FormProvider {...methods}>
                  <View style={styles.formContainer}>
                    {fields.map((field, index) => {
                      return <View key={field.id}>
                        <ItemArrayField id={field.id} index={index} itemsMap={itemsMap} />
                        <View style={styles.removeBlockButtonContainer}>
                          <Button
                            mode="contained"
                            style={styles.removeBlockButton}
                            onPress={() => {
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
                        TODO: Migrar para um bottomSheet
                     */}
                  {searchList.length ? <ScrollView style={styles.scroll}>
                    <FlatList
                      data={searchList}
                      keyExtractor={({ id }) => id}
                      contentContainerStyle={styles.listContainer}
                      renderItem={({ item }) => {
                        const { name, image, description, id } = item

                        const parser = new DOMParser()
                        const doc = parser.parseFromString(description, 'text/html')
                        const parsedDescription = doc.body.textContent || ''

                        const itemImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${image.full}`

                        return (
                          <Card style={styles.card}>
                            <Card.Title
                              title={name}
                              left={() => {
                                return <Image
                                  style={styles.cardImage}
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

const makeStyles = ({ roundness }: MD3Theme) => {
  const { height } = Dimensions.get("window")

  return StyleSheet.create({
    container: {
      height
    },
    newBlockButton: {
      margin: 16
    },
    formContainer: {
      flexDirection: 'column',
      marginBottom: 16,
      marginHorizontal: 16
    },
    removeBlockButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 16
    },
    removeBlockButton: {
      borderWidth: 1,
      alignSelf: 'flex-start'
    },
    scroll: {
      maxHeight: 420
    },
    listContainer: {
      margin: 8
    },
    card: {
      marginBottom: 8
    },
    cardImage: {
      width: 48,
      height: 48,
      borderRadius: roundness
    }
  })
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
  const [snackbarMessage, setSnackbarMessage] = useState('')


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
          {error || snackbarMessage}
        </Snackbar>
      </Portal>
    </>
  )
}