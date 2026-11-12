import { FlatList, StyleSheet, View } from "react-native"
import { Divider, List, Text } from "react-native-paper"

import { IUser } from "@org/contracts"

import useI18n from "../../../../contexts/i18n/useI18n"
import Error from "../../../Error"
import LoadingIndicator from "../../../LoadingIndicator"

export default function DisplayUserList({
  users,
  loading,
  error,
  isSearchResult,
  onChange
}: {
  users: IUser[],
  loading: boolean,
  error: boolean,
  isSearchResult: boolean,
  onChange: (...event: any[]) => void
}) {
  const i18n = useI18n()

  if (loading) {
    return (
      <View style={style.container}>
        <LoadingIndicator />
      </View>
    )
  }

  if (error) {
    return (
      <View style={style.container}>
        <Error />
      </View>
    )
  }

  return (
    <FlatList
      ListEmptyComponent={() => {
        const message = isSearchResult ? i18n.t('displayUserList.notFound') : i18n.t('displayUserList.idle')
        return (
          <View style={style.container}>
            <Text>{message}</Text>
          </View>
        )
      }}
      ItemSeparatorComponent={<Divider />}
      keyExtractor={(user) => user.email}
      data={users}
      renderItem={({ item }) => {
        return (
          <List.Item
            onPress={() => onChange(item)}
            title={item.username}
            description={`Email: ${item.email}`}
          />
        )
      }}
    />
  )
}

const style = StyleSheet.create({
  container: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center'
  }
})