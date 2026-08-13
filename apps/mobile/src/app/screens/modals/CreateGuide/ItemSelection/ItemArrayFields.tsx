import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Icon, TextInput, useTheme } from "react-native-paper";

import FormFieldErrors from "../../../../../components/forms/FormFieldErrors";
import { ItemDetails } from "../../../../../dtos/item.dto";
import { useItemSelectionContext } from "../context/ItemSelectionProvider";
import ArrayItem from "./Item";

type ItemArrayFieldProps = {
  id: string;
  index: number;
  itemsMap: {
    [key: string]: ItemDetails;
  }
}

export default function ItemArrayField({ id, index }: ItemArrayFieldProps) {
  const theme = useTheme()

  const { control, formState: { errors } } = useFormContext()
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
        <FormFieldErrors fieldError={(errors as any).itemsBlock?.[index]?.itemRollName} />
        <FlatList
          data={[...childrens, { showAddMoreButton: true }]}
          horizontal={true}
          contentContainerStyle={styles.listContentContainer}
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

            return <ArrayItem key={index} index={index} itemId={forceCasting.itemId} removeItem={removeChild} />
          }}
        />
        <FormFieldErrors fieldError={(errors as any).itemsBlock?.[index]?.itemArray} />

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
        <FormFieldErrors fieldError={(errors as any).itemsBlock?.[index]?.description} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  listContentContainer: {
    margin: 8,
    gap: 8
  }
})