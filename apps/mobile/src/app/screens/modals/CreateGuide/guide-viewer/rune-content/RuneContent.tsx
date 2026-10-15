import { Card, List, MD3Theme, useTheme } from 'react-native-paper';
import { MainRuneDto } from '../../forms/MainRunesForm';

import { StyleSheet } from 'react-native';
import { SecondaryRuneDto } from '../../forms/SecondaryRunesForm';
import RunePathListItem from './main-path-list-item/MainPathListItem';
import RuneListItem from './rune-list-item/RuneListItem';

function mainRuneTypeGuard(
  rune: MainRuneDto | SecondaryRuneDto,
): rune is MainRuneDto {
  return 'primarySlots' in rune;
}

function secondaryRuneTypeGuard(
  rune: MainRuneDto | SecondaryRuneDto,
): rune is SecondaryRuneDto {
  return 'secondaryRune' in rune;
}

type Props = {
  rune: MainRuneDto | SecondaryRuneDto;
};

export default function RuneContent({ rune }: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  let runePath = '';
  let runePathDescription = '';
  let title = '';
  let firstSlot = '';
  let secondSlot = '';
  let thirdSlot = '';
  let fourthSlot = '';

  if (mainRuneTypeGuard(rune)) {
    runePath = rune.primaryRune;
    runePathDescription = rune.primaryRuneDescription;
    title = 'Caminho Principal';
    firstSlot = rune.primarySlots.first;
    secondSlot = rune.primarySlots.second;
    thirdSlot = rune.primarySlots.third;
    fourthSlot = rune.primarySlots.fourth;
  } else if (secondaryRuneTypeGuard(rune)) {
    runePath = rune.secondaryRune;
    runePathDescription = rune.secondaryRuneDescription;
    title = 'Caminho Secondário';
    firstSlot = rune.secondarySlots.first;
    secondSlot = rune.secondarySlots.second;
    thirdSlot = rune.secondarySlots.third;
  }

  return (
    <Card
      style={[
        styles.card,
        { marginTop: secondaryRuneTypeGuard(rune) ? 16 : 0 },
      ]}
    >
      <Card.Content style={styles.cardContent}>
        <List.Section style={styles.section}>
          <RunePathListItem
            runeId={runePath}
            description={runePathDescription}
            title={title}
          />
          <RuneListItem runeId={firstSlot} title={'Primeira Runa'} />
          <RuneListItem runeId={secondSlot} title={'Segunda Runa'} />
          <RuneListItem
            runeId={thirdSlot}
            title={'Terceira Runa'}
            divider={fourthSlot ? true : false}
          />
          {fourthSlot && (
            <RuneListItem
              runeId={fourthSlot}
              title={'Quarta Runa'}
              divider={false}
            />
          )}
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