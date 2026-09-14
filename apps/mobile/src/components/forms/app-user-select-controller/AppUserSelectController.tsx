import React, { useState } from "react";
import { Controller, FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { View } from "react-native";
import { Button, Dialog, Divider, Portal, Searchbar, TextInput, TouchableRipple } from "react-native-paper";

import { IUser } from "@org/contracts";

import useSearchUsers from "../../../hooks/useSearchUsers";
import DisplayUserList from "./DisplayUserList";

interface AppUserSelectProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> extends UseControllerProps<T, TName> {
  label: string,
  placeholder: string,
  reset: () => void
}

export default function AppUserSelectController<T extends FieldValues>({ control, name, label, placeholder, reset }: AppUserSelectProps<T>) {
  const [draftValue, setDraftValue] = useState('')
  const [searchbarInput, setSearchbarInput] = useState('')
  const { users, loading, error, isSearchResult } = useSearchUsers(searchbarInput)

  const [modal, setModal] = useState(false)

  const openModal = () => {
    setModal(true)
  }

  const closeModal = () => {
    setSearchbarInput('')
    setModal(false)
  }

  const handleReset = () => {
    reset()
    setDraftValue('')
  }

  return (
    <Controller
      control={control}
      name={name}
      render={
        ({ field: { onChange, value } }) => {
          const handleOnChange = (selectedUser: IUser) => {
            onChange(selectedUser._id)
            setDraftValue(selectedUser.username)
            setSearchbarInput('')
            closeModal()
          }

          return (
            <>
              <TouchableRipple onPress={openModal}>
                <TextInput
                  mode="outlined"
                  label={label}
                  placeholder={placeholder}
                  editable={false}
                  onPress={openModal}
                  value={draftValue}
                  right={(
                    value ?
                      (
                        <TextInput.Icon
                          icon="close"
                          onPress={handleReset}
                        />
                      ) :
                      (
                        <TextInput.Icon
                          icon="menu-right"
                          onPress={openModal}
                        />
                      )
                  )}
                />
              </TouchableRipple>
              <Portal>
                <Dialog visible={modal} onDismiss={closeModal}>
                  <Dialog.Title>Selecione o usuário</Dialog.Title>
                  <Dialog.Content>
                    <View>
                      <Searchbar
                        placeholder='Busque pelo usuário aqui'
                        value={searchbarInput}
                        onChangeText={setSearchbarInput}
                        onClearIconPress={() => setSearchbarInput('')}
                      />
                    </View>
                    <Divider />
                    <DisplayUserList loading={loading} error={error} isSearchResult={isSearchResult} users={users} onChange={handleOnChange} />
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={closeModal}>Cancelar</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </>
          )
        }
      } />
  )
}