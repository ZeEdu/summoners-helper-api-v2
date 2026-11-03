import { StyleSheet, View } from "react-native";
import { Chip, Divider, Icon, List, MD3Theme, Text, useTheme } from "react-native-paper";

import { getBonusValue } from "@org/contracts";

import useI18n from "../../../../../../../contexts/i18n/useI18n";

type Props = {
  bonus: string;
};

export default function BonusListItem({ bonus }: Props) {
  const i18n = useI18n()

  const styles = makeStyles(useTheme())

  const label = i18n.t(`slotAltBonus.${bonus}`)
  const description = i18n.t(`slotBonusAltDescription.${bonus}`)
  const shard = i18n.t(`bonusLabelShards.${bonus}`)
  const value = getBonusValue(bonus);

  const uri = `https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatMods${bonus}Icon.png`;

  return (
    <>
      <List.Item
        style={styles.container}
        title={label}
        description={description}
        descriptionNumberOfLines={5}
        left={() => <Icon size={32} source={{ uri }} />}
        right={() => (
          <View
            style={styles.rightContainer}
          >
            <Chip
              mode="flat"
              style={styles.chip}
              textStyle={styles.chipText}
            >
              +{value}
            </Chip>
            <Text
              variant="labelSmall"
              numberOfLines={2}
              style={styles.label}
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

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      paddingRight: 0
    },
    rightContainer: {
      alignItems: 'center',
      width: 92,
      justifyContent: 'center',
    },
    chip: {
      width: 64,
      backgroundColor: colors.inverseSurface,
    },
    chipText: {
      textAlign: 'center',
      color: colors.inverseOnSurface,
    },
    label: {
      textAlign: 'center',
      marginTop: 4
    }
  })
}