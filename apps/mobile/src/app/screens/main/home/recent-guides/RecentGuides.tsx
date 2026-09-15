import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';

import { IGuide } from '@org/contracts';
import { StyledView } from '@org/ui';

import RecentGuidesList from './RecentGuidesList';
import QuickSearchbar from './searchbar/QuickSearchbar';

export default function RecentGuides() {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const navigation = useNavigation()

  const navigateToGuide = (guide: IGuide) => {
    navigation.navigate('ViewGuide', { guide })
  }

  return (
    <StyledView style={styles.container}>
      <View style={{
        margin: 16,
        marginBottom: 0
      }}>
        <Text variant="displaySmall">
          Guias Recentes
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
