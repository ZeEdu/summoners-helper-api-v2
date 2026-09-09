import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';

import { IGuide } from '@org/contracts';
import { StyledView } from '@org/ui';

import { HomeStackParamList, RootStackParamList } from '../../../navigation/types';
import RecentBuilds from './recent-guides/RecentGuides';
import QuickSearchbar from './searchbar/QuickSearchbar';

export type HomeProps = CompositeScreenProps<
  BottomTabScreenProps<HomeStackParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>

export default function Home({ navigation }: HomeProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const navigateToGuide = (guide: IGuide) => {
    navigation.navigate('Modals', {
      screen: 'ViewGuide',
      params: { guide },
    });
  }

  return (
    <StyledView style={styles.container}>
      <View style={styles.searchbarWrapper}>
        <QuickSearchbar navigateToGuide={navigateToGuide} />
      </View>
      <View style={styles.recentBuildsWrapper}>
        <RecentBuilds navigateToGuide={navigateToGuide} />
      </View>
    </StyledView>
  );
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    searchbarWrapper: {
      margin: 16
    },
    recentBuildsWrapper: {
      flex: 1
    },
  })
}
