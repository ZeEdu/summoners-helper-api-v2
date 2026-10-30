import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import React, { useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { Button, MD3Theme, useTheme } from "react-native-paper"

import AppSelectController from "../../../../../components/forms/app-select-controller/AppSelectController"
import useI18n from "../../../../../contexts/i18n/useI18n"

type FormDto = { language: string }

export default function ChangeLanguageButton() {
  const i18n = useI18n()

  const theme = useTheme()
  const styles = makeStyles(theme)

  const { control, handleSubmit } = useForm<FormDto>({
    defaultValues: {
      language: i18n.locale
    }
  })

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const presentBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const submit = (formValues: FormDto) => {
    i18n.setLocale(formValues.language)
    bottomSheetModalRef.current?.dismiss()
  }

  const languageList = [
    {
      label: 'Português',
      value: 'pt'
    },
    {
      label: 'English',
      value: 'en'
    }
  ]

  return (
    <>
      <Button mode='contained' onPress={presentBottomSheet}>
        {i18n.t('changeLanguage.anchor')}
      </Button>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backgroundStyle={styles.background}
        handleStyle={styles.handle}
      >
        <BottomSheetView>
          <View style={styles.container}>
            <AppSelectController
              control={control}
              name='language'
              title={i18n.t('changeLanguage.title')}
              options={languageList}
              placeholder={i18n.t('changeLanguage.placeholder')}
            />
            <Button mode='contained' onPress={handleSubmit(submit)}>
              {i18n.t('changeLanguage.action')}
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      padding: 16
    },
    background: {
      backgroundColor: colors.secondaryContainer
    },
    handle: {
      backgroundColor: colors.onSecondaryContainer
    }
  })
}