import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, FAB, MD3Theme, Text, useTheme } from 'react-native-paper';

import { StyledButton, StyledView } from '@org/ui';

import { GuidePaginationDto, IGuide, ROLES, ROLES_LABEL } from '@org/contracts';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppSelectController from '../../../../components/forms/app-select-controller/AppSelectController';
import AppInputController from '../../../../components/forms/AppInputController';
import { useAuthContext } from '../../../../contexts/auth/useAuth';
import useDataDragonContext from '../../../../contexts/data-dragon/useDataDragonContext';
import { ApiService } from '../../../../services/api/api.service';
import { MainTabsParamList, RootStackParamList } from '../../../navigation/types';
import GuideListItem from './guide-list-item/GuideListItem';

export type MyBuildsProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'MyBuilds'>,
  NativeStackScreenProps<RootStackParamList>
>;

function getTileEndpoint(championName: string) {
  return `https://ddragon.leagueoflegends.com/cdn/16.13.1/img/champion/${championName}.png`;
}

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


export default function MyBuilds({ navigation }: MyBuildsProps) {
  const authContext = useAuthContext();
  const dataDragonContext = useDataDragonContext();

  const theme = useTheme();
  const style = makeStyles(theme);

  const [builds, setBuilds] = useState<IGuide[]>([]);
  const [count, setCount] = useState(0);

  const hasMore = builds.length < count;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showFilters, setShowFilters] = useState(false);

  const { control, getValues, reset, setValue } = useForm<GuidePaginationDto>({
    defaultValues: {
      createdBy: authContext.user!._id.toString(),
      offset: 0
    }
  });

  const handleCreateGuide = () => {
    navigation.navigate('Modals', {
      screen: 'CreateGuide',
      params: {},
    });
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
        setError('Erro ao buscar builds');
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

  const championList = dataDragonContext.dataDragon?.champions || [];

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
            Filtros
          </StyledButton>
        </View>

        {showFilters && (
          <View style={{ marginHorizontal: 16, gap: 8 }}>
            <AppInputController
              inputOptions={{
                label: 'Título',
                placeholder: 'Título',
              }}
              name={'title'}
              control={control}
            />
            <AppSelectController
              control={control}
              title={'Campeão'}
              options={championList.map(({ id, name }) => ({
                value: id,
                label: name,
              }))}
              placeholder={'Selecione um campeão'}
              name={'champion'}
            />
            <AppSelectController
              control={control}
              title={'Selecione um role'}
              options={ROLE_OPTIONS}
              placeholder={'Selecione um role'}
              name={'role'}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
              <StyledButton mode='contained-tonal' onPress={clearFilters}>Limpar</StyledButton>
              <StyledButton onPress={handleFilterSearch}>Buscar</StyledButton>
            </View>
          </View>
        )}

        {loading && (
          <View>
            <Text>Carregando</Text>
          </View>
        )}

        {Boolean(error) && (
          <View>
            <Text>Um erro ocorreu</Text>
          </View>
        )}

        {
          builds.length ?
            (
              <FlatList
                data={builds}
                ListFooterComponent={() => {
                  if (hasMore) {
                    return (
                      <View>
                        <Button onPress={loadMore}>
                          Carregar mais
                        </Button>
                      </View>
                    )
                  }

                  return null
                }}
                renderItem={({ item: guide }) => {
                  const editGuideNavigation = (guide: IGuide) => {
                    navigation.navigate('Modals', {
                      screen: 'CreateGuide',
                      params: { guide },
                    });

                  }
                  return <GuideListItem guide={guide} editGuide={editGuideNavigation} />
                }}
              />
            ) : (
              <View>
                <View>
                  <Text>Voce não tem nenhuma build ainda</Text>
                </View>
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
