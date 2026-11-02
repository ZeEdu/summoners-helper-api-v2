import { View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";

import FadeInView from "../../../../../components/animated/FadeInView";
import useDataDragonContext from "../../../../../contexts/data-dragon/useDataDragonContext";
import { usePatchVersion } from "../../../../../contexts/patchVersion/usePatchVersion";
import Utils from "../../../../../utils/utils";
import { ItemsDto } from "../forms/items-form/ItemsForm";
import { SectionProps } from "./sections.types";

type ItemsSectionProps = SectionProps & { items: ItemsDto }

export default function ItemsSection({ items, hideTitle = false }: ItemsSectionProps) {
  return (
    <FadeInView>
      <List.Section>
        <List.Subheader>
          {
            !hideTitle ? (
              <List.Subheader>
                <Text variant='headlineSmall'>
                  Itens
                </Text>
              </List.Subheader>
            ) : undefined
          }
        </List.Subheader>
        <ItemsRow items={items.items} />
      </List.Section>
    </FadeInView>
  )
}

function ItemsSectionItem({ itemId }: { itemId: string }) {
  const useDataDragon = useDataDragonContext()
  const usePatch = usePatchVersion()

  const item = useDataDragon.getItem(itemId)
  const uri = `https://ddragon.leagueoflegends.com/cdn/${usePatch.version}/img/item/${item.image.full}`;
  const parsedDescription = Utils.cleanDOMElements(item.description)

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
                <Text>
                  {rowName}
                </Text>
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
