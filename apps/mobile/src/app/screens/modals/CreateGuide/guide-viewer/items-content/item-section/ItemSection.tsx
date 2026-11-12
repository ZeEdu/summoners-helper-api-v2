import { FlatList, StyleSheet } from 'react-native';
import { Card, MD3Theme, Text, useTheme } from 'react-native-paper';
import ListItem from '../list-item/ListItem';

type ItemsSectionProps = {
  rowName: string;
  itemsList: {
    itemId: string;
  }[];
  description: string;
};

export default function ItemSection({
  rowName,
  itemsList,
  description,
}: ItemsSectionProps) {
  const styles = makeStyles(useTheme())

  return (
    <Card style={styles.card}>
      <Card.Title
        title={rowName}
        titleVariant={'titleMedium'}
        titleStyle={styles.title}
      />
      <Card.Content>
        <Text variant={'bodySmall'} style={styles.description}>
          {description}
        </Text>
        <FlatList
          data={itemsList}
          keyExtractor={(item) => item.itemId}
          renderItem={({ item }) => <ListItem itemId={item.itemId} />}
        />
      </Card.Content>
    </Card>
  );
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceVariant
    },
    title: {
      color: colors.primary
    },
    description: {
      marginBottom: 8
    }
  })
}