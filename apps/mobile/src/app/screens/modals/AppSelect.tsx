import { Controller, ControllerRenderProps, FieldPath, FieldValues, Path, UseControllerProps } from "react-hook-form";
import { Dialog, Portal, TextInput, TouchableRipple } from "react-native-paper";

import { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import RadialSelectModal from "./RadialSelectModal";

interface AppSelectControllerProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> extends UseControllerProps<T, TName> {
  title: string,
  options: { value: string; label: string }[],
  placeholder: string,
  multiSelect?: boolean,
  style?: StyleProp<ViewStyle>,
  onDismiss?: () => void,
}

export default function AppSelectController<T extends FieldValues>({ control, name, title, options, placeholder, multiSelect = false }: AppSelectControllerProps<T>) {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [draftValue, setDraftValue] = useState<any>()

  return (
    <Controller
      control={control}
      name={name}
      render={
        ({ field }) => {
          const open = () => {
            setIsVisible(true)
            setDraftValue(structuredClone(field.value))
          }

          const close = () => {
            setIsVisible(false)
            setDraftValue(undefined)
          }

          const handleConfirm = () => {
            setIsVisible(false)
            field.onChange(draftValue)
          }

          const syncLabel = (field: ControllerRenderProps<T, Path<T>>) => {
            return options.find(o => o.value === field.value)?.label ?? ''
          }

          return (
            <>
              <TouchableRipple onPress={open} >
                <TextInput
                  mode="outlined"
                  label={syncLabel(field)}
                  placeholder={placeholder}
                  editable={false}
                  right={(
                    <TextInput.Icon
                      icon="menu-down"
                      onPress={open}
                    />
                  )}
                ></TextInput>
              </TouchableRipple>
              <Portal>
                <Dialog visible={isVisible} onDismiss={close}>
                  <Dialog.Content>
                    <RadialSelectModal
                      value={draftValue}
                      onChange={setDraftValue}
                      title={title}
                      options={options}
                      dismiss={handleConfirm}
                      multiSelect={multiSelect}
                    />
                  </Dialog.Content>
                </Dialog>
              </Portal>
            </>
          )
        }
      } />
  )
}