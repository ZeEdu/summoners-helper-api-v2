import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, FAB, MD3Theme, Text, useTheme } from 'react-native-paper';

import { GuideDto, GuidePaginationDto, ROLES, ROLES_LABEL } from '@org/contracts';
import { StyledButton, StyledView } from '@org/ui';

import AppSelectController from '../../../../components/forms/app-select-controller/AppSelectController';
import AppInputController from '../../../../components/forms/AppInputController';
import { useAuthContext } from '../../../../contexts/auth/useAuth';
import useUserHasRiotBindedAccount from '../../../../contexts/auth/useUserHasRiotBindedAccount';
import useDataDragonContext from '../../../../contexts/data-dragon/useDataDragonContext';
import useI18n from '../../../../contexts/i18n/useI18n';
import useTranslateScreenName from '../../../../contexts/i18n/useTranslateScreenName';
import { ApiService } from '../../../../services/api/api.service';
import GuideListItem from './guide-list-item/GuideListItem';

const ROLE_OPTIONS: { value: string; label: string }[] = [
  {
    value: ROLES.JUNGLE,
    label: ROLES_LABEL.JUNGLE,
  },
  {
    value: ROLES.TOP_LANE,
    label: ROLES_LABEL.TOP_LANE,
  },
  {
    value: ROLES.MID_LANE,
    label: ROLES_LABEL.MID_LANE,
  },
  {
    value: ROLES.ADC,
    label: ROLES_LABEL.ADC,
  },
  {
    value: ROLES.SUPPORT,
    label: ROLES_LABEL.SUPPORT,
  },
];

export default function MyGuides() {
  useTranslateScreenName('MyGuides')

  const authContext = useAuthContext();
  const dataDragonContext = useDataDragonContext();
  const userHasRiotBindedAccount = useUserHasRiotBindedAccount();
  const i18n = useI18n()

  const navigation = useNavigation()
  const theme = useTheme();
  const style = makeStyles(theme);

  const [builds, setBuilds] = useState<GuideDto[]>([]);
  const [count, setCount] = useState(0);

  const hasMore = builds.length < count;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showFilters, setShowFilters] = useState(false);

  const { control, getValues, reset, setValue } = useForm<GuidePaginationDto>({
    defaultValues: {
      createdBy: authContext.user!.id,
      offset: 0
    }
  });

  const handleCreateGuide = () => {
    navigation.navigate('CreateGuide', {});
  };

  const getBuilds = async () => {
    setLoading(true);
    setError('');

    const query = getValues()

    ApiService.Guides.get(query)
      .then(({ count, guides }) => {
        setBuilds((previous) => {
          if (query.offset === 0) {
            return guides
          }
          return previous.concat(guides)
        });

        setCount(count)
      })
      .catch(() => {
        setError(i18n.t('myGuides.feedback.error'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFilterSearch = () => {
    setValue('offset', 0)
    getBuilds()
    setShowFilters(false)
  };

  useEffect(() => {
    getBuilds()
  }, [])

  const clearFilters = () => {
    reset()
    setShowFilters(false)
    getBuilds()
  }

  const loadMore = () => {
    setValue('offset', (getValues('offset') || 0) + 1)
    getBuilds()
  }

  const championList = dataDragonContext.lists.champions;

  const editGuide = (guide: GuideDto) => {
    navigation.navigate('CreateGuide', { guide });
  }

  const viewGuide = (guide: GuideDto) => {
    navigation.navigate('ViewGuide', { guide });
  }

  return (
    <>
      <StyledView style={{ flex: 1, gap: 8 }}>
        <View>
          <StyledButton
            style={{
              marginTop: 16,
              marginHorizontal: 16,
            }}
            onPress={() => {
              setShowFilters(!showFilters);
            }}
          >
            {i18n.t('myGuides.filter.buttons.toggle')}
          </StyledButton>
        </View>

        {showFilters && (
          <View style={{ marginHorizontal: 16, gap: 8 }}>
            <AppInputController
              inputOptions={{
                label: i18n.t('myGuides.filter.fields.title.label'),
                placeholder: i18n.t('myGuides.filter.fields.title.placeholder'),
              }}
              name={'title'}
              control={control}
            />
            <AppSelectController
              control={control}
              title={i18n.t('myGuides.filter.fields.champion.title')}
              options={championList.map(({ id, name }) => ({
                value: id,
                label: name,
              }))}
              placeholder={i18n.t('myGuides.filter.fields.champion.placeholder')}
              name={'champion'}
            />
            <AppSelectController
              control={control}
              title={i18n.t('myGuides.filter.fields.role.title')}
              options={ROLE_OPTIONS}
              placeholder={i18n.t('myGuides.filter.fields.role.placeholder')}
              name={'role'}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
              <StyledButton mode='contained-tonal' onPress={clearFilters}>{i18n.t('myGuides.filter.buttons.clear')}</StyledButton>
              <StyledButton onPress={handleFilterSearch}>{i18n.t('myGuides.filter.buttons.submit')}</StyledButton>
            </View>
          </View>
        )}

        {loading && (
          <View>
            <Text>{i18n.t('myGuides.feedback.loading')}</Text>
          </View>
        )}

        {Boolean(error) && (
          <View>
            <Text>{i18n.t('myGuides.feedback.error')}</Text>
          </View>
        )}

        {
          builds.length ?
            (
              <FlatList
                style={{ paddingBottom: 8 }}
                data={builds}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  rowGap: 8
                }}
                ListFooterComponent={() => {
                  if (hasMore) {
                    return (
                      <View>
                        <Button onPress={loadMore}>
                          {i18n.t('myGuides.feedback.loadMore')}
                        </Button>
                      </View>
                    )
                  }

                  return null
                }}
                renderItem={({ item: guide }) => (
                  <GuideListItem
                    guide={guide}
                    editGuide={editGuide}
                    viewGuide={viewGuide}
                  />
                )}
              />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text
                  variant='headlineSmall'
                  style={{ textAlign: 'center' }}
                >
                  {i18n.t('myGuides.feedback.emptyList')}
                </Text>
              </View>
            )
        }
      </StyledView>
      <FAB style={style.fab} icon={'plus'} onPress={handleCreateGuide}></FAB>
    </>
  );
}

const makeStyles = (_: MD3Theme) => {
  return StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    championSprite: {
      width: 48,
      height: 48,
    },
  });
};
