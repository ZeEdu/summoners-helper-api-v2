import { useState } from 'react';
import {
  Divider,
  Icon,
  IconButton,
  List,
  MD3Theme,
  Text,
  useTheme,
} from 'react-native-paper';
import useDataDragonContext from '../../../../../../../contexts/data-dragon/useDataDragonContext';
import utils from '../../../../../../../utils/utils';
import FadeInView from '../../../../../../../components/animated/FadeInView';
import { StyleSheet } from 'react-native';

type Props = {
  runeId: string;
  title: string;
  divider?: boolean;
};

export default function RuneListItem({ runeId, title, divider = true }: Props) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const dataDragon = useDataDragonContext();

  const getBaseURI = (endpoint: string) => {
    return `https://ddragon.leagueoflegends.com/cdn/img/${endpoint}`;
  };

  const getRuneSlotURI = (runeId: string) => {
    return dataDragon.getRuneSlots(runeId);
  };

  const runeSlot = getRuneSlotURI(runeId);

  const uri = getBaseURI(runeSlot.icon);
  const description = utils.cleanDOMElements(runeSlot.shortDesc);

  const styles = makeListStyles(theme);

  return (
    <>
      <List.Item
        title={title}
        description={runeSlot.name}
        left={() => <Icon size={48} source={{ uri }} />}
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

const makeListStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    divider: {
      backgroundColor: colors.outline,
    },
    fadeIn: {
      marginBottom: 16,
    },
  });
};
