import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';

import { GuideDto } from '@org/contracts';
import { StyledView } from '@org/ui';

import useI18n from '../../../../../contexts/i18n/useI18n';
import RecentGuidesList from './RecentGuidesList';
import QuickSearchbar from './searchbar/QuickSearchbar';

export default function RecentGuides() {
  const i18n = useI18n()

  const theme = useTheme()
  const styles = makeStyles(theme)
  const navigation = useNavigation()

  const navigateToGuide = (guide: GuideDto) => {
    navigation.navigate('ViewGuide', { guide })
  }

  return (
    <StyledView style={styles.container}>
      <View style={styles.header}>
        <Text variant="displaySmall">
          {i18n.t('recentGuides.title')}
        </Text>
      </View>
      <View style={styles.searchbarWrapper}>
        <QuickSearchbar navigateToGuide={navigateToGuide} />
      </View>
      <View style={styles.recentBuildsWrapper}>
        <RecentGuidesList />
      </View>
    </StyledView>
  );
}

const makeStyles = ({ colors, roundness }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      margin: 16,
      marginBottom: 0
    },
    searchbarWrapper: {
      margin: 16,
      marginBottom: 0
    },
    recentBuildsWrapper: {
      flex: 1,
      margin: 16,
      borderRadius: roundness
    },
  })
}
