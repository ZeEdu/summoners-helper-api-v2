import ListItem from '../list-item/ListItem';
import { Card, Text, useTheme } from 'react-native-paper';
import { FlatList } from 'react-native';

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
  const theme = useTheme();
  return (
    <Card style={{ backgroundColor: theme.colors.surfaceVariant }}>
      <Card.Title
        title={rowName}
        titleVariant={'titleMedium'}
        titleStyle={{ color: theme.colors.primary }}
      />
      <Card.Content>
        <Text variant={'bodySmall'} style={{ marginBottom: 8 }}>
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
