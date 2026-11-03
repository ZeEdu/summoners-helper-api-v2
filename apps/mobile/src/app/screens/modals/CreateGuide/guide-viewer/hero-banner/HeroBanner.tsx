import { Image, StyleSheet, View } from 'react-native';
import { Chip, MD3Theme, Text, useTheme } from 'react-native-paper';

import { getRoleLabel } from '@org/contracts';

import useDataDragonContext from '../../../../../../contexts/data-dragon/useDataDragonContext';
import useI18n from '../../../../../../contexts/i18n/useI18n';

type HeroBannerProps = {
  championId: string;
  patchVersion: string;
  role: string;
};

export default function HeroBanner({
  championId,
  patchVersion,
  role = 'Mid',
}: HeroBannerProps) {
  const i18n = useI18n();
  const theme = useTheme();
  const styles = makeStyles(theme);

  const dataDragon = useDataDragonContext();
  const champion = dataDragon.getChampion(championId);

  const uri = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_0.jpg`;

  return (
    <View style={styles.hero}>
      <Image
        source={{ uri }}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, styles.background]} />
      <View style={styles.content}>
        <View style={styles.guideRow}>
          <Chip style={styles.chip}>
            <Text style={styles.chipText}>{i18n.t(`heroBanner.title`)}</Text>
          </Chip>
        </View>
        <Text variant="headlineMedium" style={styles.championName}>
          {champion.name}
        </Text>
        <View>
          <Text variant="labelSmall">
            {getRoleLabel(role)}{' '}
            {champion.tags.join(` ${String.fromCharCode(0xb7)} `)}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Chip icon={'chart-areaspline'} style={styles.chip}>
            <Text style={styles.chipText}>{i18n.t(`heroBanner.difficulty`)}: {i18n.t(`difficulty.${champion.info.difficulty}`)}</Text>
          </Chip>
          <Chip mode="flat" icon={'calendar-blank-outline'} style={styles.chip}>
            <Text style={styles.chipText}>Patch: {patchVersion}</Text>
          </Chip>
        </View>
      </View>
    </View>
  );
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    hero: {
      height: 260,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    background: {
      backgroundColor: 'rgba(0,0,0,0.4)'
    },
    content: {
      padding: 16,
      gap: 8,
    },
    guideRow: {
      flexDirection: 'row',
    },
    championName: {
      color: colors.primary,
    },
    chip: {
      backgroundColor: colors.primaryContainer,
    },
    chipText: {
      color: colors.onPrimaryContainer,
    },
    footerRow: {
      flexDirection: 'row',
      gap: 8,
    },
  });
};