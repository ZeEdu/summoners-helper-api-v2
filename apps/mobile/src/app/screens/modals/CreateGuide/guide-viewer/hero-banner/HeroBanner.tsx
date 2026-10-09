import { Image, StyleSheet, View } from "react-native";
import { Chip, MD3Theme, Text, useTheme } from "react-native-paper";

import { getRoleLabel } from "@org/contracts";

import useDataDragonContext from "../../../../../../contexts/data-dragon/useDataDragonContext";

type HeroBannerProps = {
  championId: string;
  role: string
}

export default function HeroBanner({ championId, role = 'Mid' }: HeroBannerProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const dataDragon = useDataDragonContext()
  const champion = dataDragon.getChampion(championId)

  let difficultyLabel
  switch (champion.info.difficulty) {
    case 1:
      difficultyLabel = 'Muito fácil'
      break;
    case 2:
      difficultyLabel = 'Fácil'
      break;
    case 4:
      difficultyLabel = 'Díficil'
      break;
    case 5:
      difficultyLabel = 'Muito díficil'
      break;
    case 3:
    default:
      difficultyLabel = 'Intermediário'
      break;
  }

  const uri = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_0.jpg`

  return (
    <View style={styles.hero}>
      <Image source={{ uri }} resizeMode="cover" style={StyleSheet.absoluteFill} />
      <View style={[
        StyleSheet.absoluteFill,
        styles.background
      ]} />
      <View style={styles.content}>
        <View style={styles.guideRow}>
          <Chip style={styles.chip}>
            <Text style={styles.chipText}>Guia</Text>
          </Chip>
        </View>
        <Text
          variant="headlineMedium"
          style={styles.championName}
        >
          {champion.name}
        </Text>
        <View>
          <Text
            variant="labelSmall"
          >
            {getRoleLabel(role)} {champion.tags.join(` ${String.fromCharCode(0xB7)} `)}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Chip icon={'chart-areaspline'} style={styles.chip}>
            <Text style={styles.chipText}>Dificuldade: {difficultyLabel}</Text>
          </Chip>
          <Chip mode="flat" icon={'calendar-blank-outline'} style={styles.chip}>
            <Text style={styles.chipText}>Patch 14.16</Text>
          </Chip>
        </View>
      </View>
    </View>
  )
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    hero: {
      height: 260,
      overflow: 'hidden',
      justifyContent: 'flex-end'
    },
    background: { backgroundColor: 'rgba(0,0,0,0.4)' },
    content: {
      padding: 16,
      gap: 8
    },
    guideRow: {
      flexDirection: 'row'
    },
    championName: {
      color: colors.onSurface
    },
    chip: {
      backgroundColor: colors.primaryContainer
    },
    chipText: {
      color: colors.onPrimaryContainer
    },
    footerRow: {
      flexDirection: 'row',
      gap: 8
    }
  })
}