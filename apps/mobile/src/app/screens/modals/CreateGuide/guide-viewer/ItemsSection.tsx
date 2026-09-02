import { View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";

import useDataDragonContext from "../../../../../contexts/data-dragon/useDataDragonContext";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import { ItemsDto } from "../forms/items-form/ItemsForm";

export default function ItemsSection({ items }: { items: ItemsDto }) {
  return (
    <List.Section>
      <List.Subheader>
        <Text variant='headlineSmall'>
          Itens
        </Text>
      </List.Subheader>
      <ItemsRow items={items.items} />
    </List.Section>
  )
}

function ItemsSectionItem({ itemId }: { itemId: string }) {
  const useDataDragon = useDataDragonContext()
  const usePatch = usePatchVersion()

  const item = useDataDragon.getItem(itemId)

  const uri = `https://ddragon.leagueoflegends.com/cdn/${usePatch.version}/img/item/${item.image.full}`;

  const parser = new DOMParser();
  const doc = parser.parseFromString(
    item.description,
    'text/html',
  );
  const parsedDescription = doc.body.textContent || '';

  return (
    <List.Item
      title={item.name}
      description={parsedDescription}
      right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={48} />}
    />
  )
}

function ItemsRow({ items }: {
  items: ItemsDto['items']
}) {
  return (
    <View>
      {
        items
          .map(({ rowName, itemsList, description }) => (
            <List.Section>
              <List.Subheader>
                {rowName}
              </List.Subheader>
              {
                itemsList
                  .map(({ itemId }) => <ItemsSectionItem key={itemId} itemId={itemId} />)
              }
              <List.Item title={'Descrição'} description={description} />
            </List.Section>
          ))
      }
    </View>
  )
}
