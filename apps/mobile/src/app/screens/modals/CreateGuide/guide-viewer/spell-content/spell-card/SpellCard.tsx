import { Image, StyleSheet } from 'react-native';
import { Card, MD3Theme, Text, useTheme } from 'react-native-paper';

import useDataDragonContext from '../../../../../../../contexts/data-dragon/useDataDragonContext';

type SpellCardProps = {
  spell: string;
};

export default function SpellCard({ spell }: SpellCardProps) {
  const theme = useTheme();
  const dataDragon = useDataDragonContext();

  const { name, description } = dataDragon.getSpell(spell);

  const spellImageEndpoint = dataDragon.getSpell(spell).image.full;
  const spellURI = `https://ddragon.leagueoflegends.com/cdn/${dataDragon.getPatch()}/img/spell/${spellImageEndpoint}`;

  const styles = makeStyles(theme);

  return (
    <Card style={styles.card}>
      <Card.Title
        left={() => (
          <Image
            style={styles.image}
            source={{
              uri: spellURI,
            }}
          />
        )}
        title={
          <Text variant="headlineSmall" style={styles.title}>
            {name}
          </Text>
        }
      />
      <Card.Content>
        <Text variant="bodySmall">{description}</Text>
      </Card.Content>
    </Card>
  );
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    card: { backgroundColor: colors.secondaryContainer },
    image: {
      width: 48,
      height: 48,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.onSecondaryContainer,
    },
    title: { color: colors.onSecondaryContainer },
  });
};
