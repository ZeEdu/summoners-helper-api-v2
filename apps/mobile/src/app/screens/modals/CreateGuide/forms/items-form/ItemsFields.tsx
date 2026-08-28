import {
  Controller,
  FieldError,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Icon, TextInput, useTheme } from 'react-native-paper';

import FormFieldErrors from '../../../../../../components/forms/FormFieldErrors';
import { useItemSelectionContext } from './context/useItemSelectionContext';
import ArrayItem from './Item';
import { ItemsDto } from './ItemsForm';

type ItemsFieldProps = {
  id: string;
  index: number;
};

type FormField = Record<'id', string> & {
  disabled?: boolean;
  itemId: string;
};

type ItemType = 'add' | 'item';

type ListItem = { type: ItemType; itemId?: string };

export default function ItemsField({ id, index }: ItemsFieldProps) {
  const theme = useTheme();

  const {
    control,
    formState: { errors },
  } = useFormContext<ItemsDto>();
  const itemSelectionContext = useItemSelectionContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${index}.itemsList`,
  });

  const itemList: ListItem[] = [
    ...fields.map(
      (field) => ({
        type: 'item',
        itemId: (field as FormField).itemId,
      }) as ListItem,
    ),
    { type: 'add' },
  ];

  const handleAppend = (value: string) => {
    append({ itemId: value });
  };

  const getItemListError = (index: number) => {
    const error = errors?.items?.[index]?.itemsList;
    if (error) {
      return error as FieldError;
    }

    return undefined;
  };

  return (
    <Pressable key={id}>
      <View>
        <Controller
          control={control}
          name={`items.${index}.rowName`}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <TextInput
                placeholder="Nome do bloco de itens"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            );
          }}
        />
        <FormFieldErrors fieldError={errors.items?.[index]?.rowName} />
        <FlatList
          data={itemList}
          horizontal={true}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item }) => {
            if (item.itemId) {
              return (
                <ArrayItem
                  key={index}
                  index={index}
                  itemId={item.itemId}
                  removeItem={remove}
                />
              );
            }

            return (
              <Pressable
                onPress={() => {
                  itemSelectionContext.setShowItemSearcher(true);
                  itemSelectionContext.setAppendFunction(() => handleAppend);
                }}
              >
                <Icon
                  source="plus"
                  size={48}
                  color={theme.colors.onPrimaryContainer}
                ></Icon>
              </Pressable>
            );
          }}
        />
        <FormFieldErrors fieldError={getItemListError(index)} />

        <Controller
          control={control}
          name={`items.${index}.description`}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <TextInput
                multiline={true}
                placeholder="Descrição do bloco de itens"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            );
          }}
        />
        <FormFieldErrors fieldError={errors.items?.[index]?.description} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listContentContainer: {
    margin: 8,
    gap: 8,
  },
});