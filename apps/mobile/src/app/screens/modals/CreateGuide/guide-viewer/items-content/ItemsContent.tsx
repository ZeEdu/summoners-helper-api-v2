import { ItemsDto } from '../../forms/items-form/ItemsForm';
import { FlatList } from 'react-native';
import ItemSection from './item-section/ItemSection';

type Props = {
  items: ItemsDto;
};

export default function ItemsContent({ items }: Props) {
  return (
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
  );
}