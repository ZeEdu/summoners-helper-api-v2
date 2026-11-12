import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import React, { useCallback, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { Button, MD3Theme, Snackbar, useTheme } from "react-native-paper"

import AppSelectController from "../../../../../components/forms/app-select-controller/AppSelectController"
import useDataDragon from "../../../../../contexts/data-dragon/useDataDragonContext"
import LocalePersistenceError from "../../../../../contexts/i18n/errors/localePersistenceError"
import I18N_CONSTANTS from "../../../../../contexts/i18n/i18n.constants"
import { SupportedLanguages } from "../../../../../contexts/i18n/i18n.context"
import useI18n from "../../../../../contexts/i18n/useI18n"

type FormDto = { language: SupportedLanguages }

type Props = {
  showCurrentLanguageAsButtonText?: boolean
}

export default function ChangeLanguageButton({ showCurrentLanguageAsButtonText }: Props) {
  const i18n = useI18n()
  const dataDragon = useDataDragon()

  const theme = useTheme()
  const styles = makeStyles(theme)

  const { control, handleSubmit } = useForm<FormDto>({
    defaultValues: {
      language: i18n.locale || I18N_CONSTANTS.SUPPORTED_LANGUAGES.pt
    }
  })

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const [showSnackbar, setShowSnackbar] = useState(false)
  const [persistenceError, setPersistenceError] = useState(false)

  const presentBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const submit = (formValues: FormDto) => {
    setShowSnackbar(false)
    setPersistenceError(false)

    i18n.setLocale(formValues.language)
      .then(() => {
        dataDragon.reload()
        bottomSheetModalRef.current?.dismiss()
      }).catch((error) => {
        setPersistenceError(error instanceof LocalePersistenceError)
        setShowSnackbar(true)
      })
  }

  const closeSnackbar = () => {
    setShowSnackbar(false)
  }

  const languageList = [
    {
      label: I18N_CONSTANTS.SUPPORTED_LANGUAGES_LABELS.pt,
      value: I18N_CONSTANTS.SUPPORTED_LANGUAGES.pt
    },
    {
      label: I18N_CONSTANTS.SUPPORTED_LANGUAGES_LABELS.en,
      value: I18N_CONSTANTS.SUPPORTED_LANGUAGES.en
    }
  ]

  const languageLabels = i18n.locale && I18N_CONSTANTS.SUPPORTED_LANGUAGES_LABELS[i18n.locale]

  return (
    <>
      <Button mode='contained' onPress={presentBottomSheet}>
        {showCurrentLanguageAsButtonText ? languageLabels : i18n.t('changeLanguage.anchor')}
      </Button>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backgroundStyle={styles.background}
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

      <Snackbar
        visible={showSnackbar}
        onDismiss={closeSnackbar}
        action={{
          label: 'OK',
          onPress: closeSnackbar,
        }}
      >
        {i18n.t(`changeLanguage.saveLangErrors.${persistenceError ? 'persistence' : 'change'}`)}
      </Snackbar>
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
    }
  })
}