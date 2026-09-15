import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { FlatList, StyleSheet, View } from 'react-native';
import z from 'zod';

import {
  GuidePaginationDto,
  guidesPaginationSchema,
  IGuide,
  ROLES,
  ROLES_LABEL,
} from '@org/contracts';
import { StyledButton, StyledView } from '@org/ui';

import { useState } from 'react';
import { Button, Text } from 'react-native-paper';
import AppSelectController from '../../../../../components/forms/app-select-controller/AppSelectController';
import AppUserSelectController from '../../../../../components/forms/app-user-select-controller/AppUserSelectController';
import AppInputController from '../../../../../components/forms/AppInputController';
import AppSwitchController from '../../../../../components/forms/AppSwitchController';
import GuideCard from '../../../../../components/GuideCard';
import useDataDragonContext from '../../../../../contexts/data-dragon/useDataDragonContext';
import { usePatchVersion } from '../../../../../contexts/patchVersion/usePatchVersion';
import { ApiService } from '../../../../../services/api/api.service';

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

const customGuidesPaginationSchema = guidesPaginationSchema.extend({
  deprecatedPatchVersion: z.boolean().optional(),
});

type FilterInputDto = z.input<typeof customGuidesPaginationSchema>;
type FilterOutputDto = z.output<typeof customGuidesPaginationSchema>;

const resolver = zodResolver(customGuidesPaginationSchema);

export default function Search() {
  const useDataDragon = useDataDragonContext();
  const patchVersion = usePatchVersion();
  const navigation = useNavigation();

  const [guides, setGuides] = useState<IGuide[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isFromSearch, setIsFromSearch] = useState(false)

  const championList = useDataDragon.dataDragon.champions;

  const defaultQuery: FilterInputDto = { offset: 0 };

  const { control, reset, handleSubmit, getValues, resetField, formState: { isValid, errors } } = useForm<
    FilterInputDto,
    unknown,
    FilterOutputDto
  >({
    resolver,
    defaultValues: { ...defaultQuery },
  });

  const getGuides = async (values: FilterOutputDto) => {
    setLoading(true);
    setError('');
    setIsFromSearch(false)

    if (values.deprecatedPatchVersion) {
      delete values.patchVersion;
    } else {
      values.patchVersion = patchVersion.version;
    }

    delete values.deprecatedPatchVersion;

    const query: GuidePaginationDto = {
      ...values,
      limit: 10,
    };

    ApiService.Guides.get(query)
      .then(({ guides }) => {
        setGuides((previous) => {
          if (query.offset === 0) {
            return guides;
          }
          return previous.concat(guides);
        });
        setIsFromSearch(true)
      })
      .catch(() => {
        setError('Erro ao buscar builds');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log({ data });
    await getGuides(data);
  });

  const handleReset = () => {
    reset();
    setGuides([]);
    setError('');
  };

  const loadMore = async () => {
    const query = getValues() as FilterOutputDto;
    query.offset = query.offset ? query.offset + 1 : 1;

    await getGuides(query);
  };

  const resetCreatedByField = () => {
    resetField('createdBy')
  }

  return (
    <StyledView style={styles.container}>
      <View>
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
        <AppInputController
          control={control}
          inputOptions={{
            placeholder: 'Busque pelo título',
            label: 'Busque pelo título',
          }}
          name={'title'}
        />
        <AppSelectController
          control={control}
          name={'role'}
          options={ROLE_OPTIONS}
          title={'Role do campeão'}
          placeholder={'Busque de acordo com a role do campeão'}
        />

        <AppUserSelectController
          control={control}
          name='createdBy'
          label={'Criador do guia'}
          placeholder={'Busquem por quem criou o guia'}
          reset={resetCreatedByField}
        />

        <AppSwitchController
          control={control}
          name={'deprecatedPatchVersion'}
          label='Buscar guias desatualizados'
        />

        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}
        >
          <StyledButton mode={'outlined'} onPress={handleReset}>
            Limpar
          </StyledButton>
          <StyledButton onPress={onSubmit}>Buscar</StyledButton>
        </View>
      </View>


      <View style={styles.list}>
        {loading ? <Text>Carregando...</Text> : undefined}
        {error ? <Text>Um erro ocorreu...</Text> : undefined}
        {guides.length ? (
          <FlatList
            contentContainerStyle={styles.flatlistContentContainer}
            ListEmptyComponent={() => {
              const message = isFromSearch ? 'Nenhum guia encontrado' : 'Atualize o filtro para encontrar um guia'
              return (
                <View>
                  <Text>{message}</Text>
                </View>
              )
            }}
            data={guides}
            keyExtractor={({ _id }) => _id.toString()}
            renderItem={({ item: guide }) => {
              return (
                <GuideCard
                  onPress={() => {
                    navigation.navigate('ViewGuide', { guide });
                  }}
                  guide={guide}
                />
              );
            }}
            ListFooterComponent={() => {
              return <Button onPress={loadMore}>Carregar mais</Button>;
            }}
          />
        ) : (
          <Text>Atualize o filtro para encontrar um guia</Text>
        )}
      </View>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    flex: 1,
    gap: 8,
  },
  filterButtons: {},
  switch: {
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  list: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  flatlistContentContainer: {
    padding: 8,
    rowGap: 8,
  },
});