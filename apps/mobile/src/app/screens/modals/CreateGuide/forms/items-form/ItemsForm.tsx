import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { FlatList, Image, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  MD3Theme,
  Searchbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import z from 'zod';

import { CreateGuideDto, CreateGuideSchema } from '@org/contracts';

import AppInputController from '../../../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../../../components/forms/FormFieldErrors';
import { StepperFooter } from '../../../../../../components/stepper';
import { buildCustomButtonProps } from '../../../../../../components/stepper/StepperFooter';
import { useStepperContext } from '../../../../../../components/stepper/context';
import { ItemDetailsWithId } from '../../../../../../contexts/data-dragon/data-dragon.context';
import useDataDragonContext from '../../../../../../contexts/data-dragon/useDataDragonContext';
import { usePatchVersion } from '../../../../../../contexts/patchVersion/usePatchVersion';
import ItemsField from './ItemsFields';
import { useItemSelectionContext } from './context/useItemSelectionContext';

const ItemsSchema = CreateGuideSchema.pick({
  items: true,
  itemsDescription: true,
});

export type ItemsDto = z.infer<typeof ItemsSchema>;

const resolver = zodResolver(ItemsSchema);

export default function ItemsForm() {
  const useDataDragon = useDataDragonContext();
  const mainFormContext = useFormContext<CreateGuideDto>();
  const stepperContext = useStepperContext();

  const { version } = usePatchVersion();
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchList, setSearchList] = useState<ItemDetailsWithId[]>([]);

  const itemSelectionContext = useItemSelectionContext();

  const methods = useForm<ItemsDto>({ resolver });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { append, remove, fields } = useFieldArray({
    control,
    name: 'items',
  });

  const itemList = useDataDragon.dataDragon?.items || [];

  const onSubmit = (values: ItemsDto) => {
    mainFormContext.setValues(values, { shouldValidate: true });
    stepperContext.nextStep();
  };

  const addNewBlock = () => {
    append({ rowName: '', itemsList: [], description: '' });
  };

  const removeBlock = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (!searchQuery) {
      setSearchList([]);
      return;
    }

    // TODO: Expandir as regras de match
    const matchedItems = itemList.filter(({ name }) =>
      name.toLocaleLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (matchedItems.length) {
      setSearchList(matchedItems);
    } else {
      setSearchList([]);
    }
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <AppInputController
            control={control}
            name={'itemsDescription'}
            inputOptions={{
              label: 'Descrição dos itens',
              placeholder: 'Descreva a escolha dos itens',
            }}
          />
          <FormFieldErrors fieldError={errors.itemsDescription} />
        </View>

        <Button mode="contained" onPress={addNewBlock}>
          Adicionar um novo bloco
        </Button>

        <ScrollView>
          <FormProvider {...methods}>
            <View style={styles.formContainer}>
              {fields.map((field, index) => {
                return (
                  <View key={field.id}>
                    <ItemsField id={field.id} index={index} />
                    <View style={styles.removeBlockButtonContainer}>
                      <Button
                        mode="contained"
                        style={styles.removeBlockButton}
                        onPress={() => {
                          removeBlock(index);
                        }}
                      >
                        Remover bloco
                      </Button>
                    </View>
                  </View>
                );
              })}
            </View>
          </FormProvider>
        </ScrollView>
        {itemSelectionContext.showItemSearcher ? (
          <View>
            {searchList.length ? (
              <Surface style={styles.surface}>
                <ScrollView style={styles.scroll}>
                  <FlatList
                    data={searchList}
                    keyExtractor={({ id }) => id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => {
                      const { name, image, description, id } = item;

                      const parser = new DOMParser();
                      const doc = parser.parseFromString(
                        description,
                        'text/html',
                      );
                      const parsedDescription = doc.body.textContent || '';

                      const itemImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${image.full}`;

                      return (
                        <Card style={styles.card}>
                          <Card.Title
                            title={name}
                            left={() => {
                              return (
                                <Image
                                  style={styles.cardImage}
                                  source={{ uri: itemImageUrl }}
                                />
                              );
                            }}
                          />
                          <Card.Content>
                            <Text variant="bodyMedium">
                              {parsedDescription.trim()}
                            </Text>
                          </Card.Content>
                          <Card.Actions>
                            <Button
                              onPress={() => {
                                itemSelectionContext.setShowItemSearcher(false);
                                itemSelectionContext.appendFunction(id);
                              }}
                            >
                              Adicionar
                            </Button>
                          </Card.Actions>
                        </Card>
                      );
                    }}
                  />
                </ScrollView>
              </Surface>
            ) : null}
            <Searchbar
              placeholder="Buscar itens"
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
          </View>
        ) : null}
      </View>
      <StepperFooter
        customNextButton={buildCustomButtonProps({
          onPress: handleSubmit(onSubmit),
        })}
      />
    </View>
  );
}

const makeStyles = ({ roundness }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
    },
    content: {
      flex: 1,
      gap: 16,
    },
    formContainer: {
      flexDirection: 'column',
      marginBottom: 16,
      gap: 16,
    },
    removeBlockButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 16,
    },
    removeBlockButton: {
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    scroll: {
      maxHeight: 420,
    },
    listContainer: {
      margin: 8,
    },
    card: {
      marginBottom: 8,
    },
    cardImage: {
      width: 48,
      height: 48,
      borderRadius: roundness,
    },
    surface: {
      borderRadius: roundness,
      marginBottom: 8,
    },
  });
};