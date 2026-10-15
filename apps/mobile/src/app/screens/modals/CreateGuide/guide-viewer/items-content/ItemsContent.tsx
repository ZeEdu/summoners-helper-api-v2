import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ItemsDto } from '../../forms/items-form/ItemsForm';
import ItemSection from './item-section/ItemSection';

type Props = {
  items: ItemsDto;
};

export default function ItemsContent({ items }: Props) {
  return (
    <View style={styles.container}>
      <Text variant='bodyMedium' >
        {items.itemsDescription}
      </Text>
      <FlatList
        data={items.items}
        keyExtractor={(item) => item.rowName}
        renderItem={({ item }) => {
          return (
            <ItemSection
              key={item.rowName}
              rowName={item.rowName}
              itemsList={item.itemsList}
              description={item.description}
            />
          );
        }}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  }
})