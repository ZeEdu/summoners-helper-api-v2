import { Card, Icon, Text, useTheme } from 'react-native-paper';
import useDataDragonContext from '../../../../../../../contexts/data-dragon/useDataDragonContext';
import Utils from '../../../../../../../utils/utils';
import { Image, View } from 'react-native';

type ListItemProps = {
  itemId: string;
};

export default function ListItem({ itemId }: ListItemProps) {
  const theme = useTheme();
  const dataDragon = useDataDragonContext();

  const item = dataDragon.getItem(itemId);
  const uri = `https://ddragon.leagueoflegends.com/cdn/${dataDragon.getPatch()}/img/item/${item.image.full}`;

  const itemName = item.name;
  const gold = item.gold.total;
  const description = Utils.cleanDOMElements(item.description);

  return (
    <Card>
      <Card.Content>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View>
            <Image
              style={{
                width: 48,
                height: 48,
                borderWidth: 2,
                borderColor: theme.colors.onSurface,
                borderRadius: 12,
              }}
              source={{ uri }}
            />
          </View>
          <View style={{ gap: 4 }}>
            <Text variant="titleSmall">{itemName}</Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Icon size={18} source="gold" color={'#FFC83D'}></Icon>
              <Text variant={'labelSmall'} style={{ color: '#FFC83D' }}>
                {gold}
              </Text>
            </View>
            <Text variant={'bodySmall'}>{description}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
