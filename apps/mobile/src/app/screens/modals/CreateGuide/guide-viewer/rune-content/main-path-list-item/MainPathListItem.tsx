import { Image, StyleSheet } from 'react-native';
import {
  Divider,
  IconButton,
  List,
  MD3Theme,
  Text,
  useTheme,
} from 'react-native-paper';
import useDataDragonContext from '../../../../../../../contexts/data-dragon/useDataDragonContext';
import { useState } from 'react';
import FadeInView from '../../../../../../../components/animated/FadeInView';

type Props = {
  title: string;
  runeId: string;
  description: string;
  divider?: boolean;
};

export default function RunePathListItem({
  title,
  runeId,
  description,
  divider = true,
}: Props) {
  const dataDragon = useDataDragonContext();
  const theme = useTheme();

  const [expanded, setExpanded] = useState(false);

  const getBaseURI = (endpoint: string) => {
    return `https://ddragon.leagueoflegends.com/cdn/img/${endpoint}`;
  };

  const getRune = (runeId: string) => {
    return dataDragon.getRune(runeId);
  };

  const rune = getRune(runeId);
  const uri = getBaseURI(rune.icon);

  const styles = makeStyles(theme);

  return (
    <>
      <List.Item
        title={title}
        description={rune.name}
        left={() => <Image style={styles.leftIcon} source={{ uri }} />}
        right={() => (
          <IconButton
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            onPress={() => setExpanded(!expanded)}
          />
        )}
      />
      {expanded && (
        <FadeInView style={styles.fadeIn}>
          <Text>{description}</Text>
        </FadeInView>
      )}
      {divider && <Divider style={styles.divider} />}
    </>
  );
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    fadeIn: {
      marginBottom: 16,
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