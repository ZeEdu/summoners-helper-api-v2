import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import useI18n from "./useI18n";

type ScreenName = 'Profile'

export default function useTranslateScreenName(screenName: ScreenName) {
  const i18n = useI18n()
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t(`screens.${screenName}`)
    })
  }, [navigation, i18n.locale, screenName])
}