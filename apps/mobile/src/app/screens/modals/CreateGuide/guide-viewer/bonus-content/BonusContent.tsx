import { StyleSheet } from 'react-native';
import {
  Card,
  List,
  MD3Theme,
  useTheme
} from 'react-native-paper';

import { BonusDto } from '../../forms/BonusForm';
import BonusListItem from './bonus-list-item/BonusListItem';

type Props = {
  bonus: BonusDto;
};

export default function BonusContent({ bonus }: Props) {
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