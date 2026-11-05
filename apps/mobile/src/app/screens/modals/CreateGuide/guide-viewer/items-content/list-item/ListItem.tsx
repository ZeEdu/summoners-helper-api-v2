import { Image, StyleSheet, View } from 'react-native';
import { Card, Icon, MD3Theme, Text, useTheme } from 'react-native-paper';
import useDataDragon from '../../../../../../../contexts/data-dragon/useDataDragonContext';
import Utils from '../../../../../../../utils/utils';

type ListItemProps = {
  itemId: string;
};

export default function ListItem({ itemId }: ListItemProps) {
  const styles = makeStyles(useTheme())
  const dataDragon = useDataDragon();

  const item = dataDragon.getItem(itemId);
  const uri = `https://ddragon.leagueoflegends.com/cdn/${dataDragon.getPatch()}/img/item/${item.image.full}`;

  const itemName = item.name;
  const gold = item.gold.total;
  const description = Utils.cleanDOMElements(item.description);

  return (
    <Card>
      <Card.Content>
        <View style={styles.container}>
          <View>
            <Image
              style={styles.image}
              source={{ uri }}
            />
          </View>
          <View style={styles.descriptionContainer}>
            <Text variant="titleSmall">{itemName}</Text>
            <View
              style={styles.priceContainer}
            >
              <Icon size={18} source="gold" color={'#FFC83D'}></Icon>
              <Text variant={'labelSmall'} style={styles.price}>
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

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 12
    },
    image: {
      width: 48,
      height: 48,
      borderWidth: 2,
      borderColor: colors.onSurface,
      borderRadius: 12,
    },
    descriptionContainer: {
      gap: 4
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    price: {
      color: '#FFC83D'
    }
  })
}