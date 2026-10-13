import { BonusDto } from '../../forms/BonusForm';
import {
  Card,
  Chip,
  Divider,
  Icon,
  List,
  MD3Theme,
  Text,
  useTheme,
} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import {
  getBonusDescription,
  getBonusLabel,
  getBonusLabelsShard,
  getBonusValue,
} from '@org/contracts';

type Prop = {
  bonus: BonusDto;
};

export default function BonusContent({ bonus }: Prop) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <List.Section style={styles.section}>
          <BonusListItem bonus={bonus.bonusSlotOne} />
          <BonusListItem bonus={bonus.bonusSlotTwo} />
          <BonusListItem bonus={bonus.bonusSlotThree} />
        </List.Section>
      </Card.Content>
    </Card>
  );
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.secondaryContainer,
    },
    cardContent: {
      paddingVertical: 0,
    },
    section: {
      marginTop: 0,
      marginBottom: 0,
    },
    leftIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
    },
    divider: {
      backgroundColor: colors.outline,
    },
  });
};

type BonusListItemProp = {
  bonus: string;
};

function BonusListItem({ bonus }: BonusListItemProp) {
  const theme = useTheme();

  const label = getBonusLabel(bonus);
  const description = getBonusDescription(bonus);
  const shard = getBonusLabelsShard(bonus);
  const value = getBonusValue(bonus);

  try {
    console.log({ value });
  } catch (e) {
    console.log({ e });
  }
  const uri = `https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatMods${bonus}Icon.png`;

  return (
    <>
      <List.Item
        style={{ paddingRight: 0 }}
        title={label}
        description={description}
        descriptionNumberOfLines={5}
        left={() => <Icon size={32} source={{ uri }} />}
        right={() => (
          <View
            style={{
              alignItems: 'center',
              width: 92,
              justifyContent: 'center',
            }}
          >
            <Chip
              mode="flat"
              style={{
                width: 64,
                backgroundColor: theme.colors.inverseSurface,
              }}
              textStyle={{
                textAlign: 'center',
                color: theme.colors.inverseOnSurface,
              }}
            >
              +{value}
            </Chip>
            <Text
              variant="labelSmall"
              numberOfLines={2}
              style={{ textAlign: 'center', marginTop: 4 }}
            >
              {shard}
            </Text>
          </View>
        )}
      />
      <Divider />
    </>
  );
}