import { FlatList, View } from "react-native"
import { Divider, List, Text } from "react-native-paper"

import { IUser } from "@org/contracts"

import Error from "../../Error"
import LoadingIndicator from "../../LoadingIndicator"

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
  if (loading) {
    return (
      <View style={{ height: 240, alignItems: 'center', justifyContent: 'center' }}>
        <LoadingIndicator />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ height: 240, alignItems: 'center', justifyContent: 'center' }}>
        <Error />
      </View>
    )
  }

  return (
    <FlatList
      ListEmptyComponent={() => {
        const message = isSearchResult ? 'Nenhum usuário encontrado' : 'Busque por um usuário'
        return (
          <View style={{ height: 240, alignItems: 'center', justifyContent: 'center' }}>
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