import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { FlatList, StyleSheet, View } from 'react-native';
import z from 'zod';

import {
  GuideDto,
  GuidePaginationDto,
  guidesPaginationSchema,
  ROLES,
  ROLES_LABEL
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
import useI18n from '../../../../../contexts/i18n/useI18n';
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

// TODO: Botar o filtro dentro de um accordion ou algo do tipo
export default function Search() {
  const useDataDragon = useDataDragonContext();
  const patchVersion = usePatchVersion();
  const navigation = useNavigation();
  const i18n = useI18n()

  const [guides, setGuides] = useState<GuideDto[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [isFromSearch, setIsFromSearch] = useState(false)

  const championList = useDataDragon.lists.champions;

  const defaultQuery: FilterInputDto = { offset: 0 };

  const { control, reset, handleSubmit, getValues, resetField } = useForm<
    FilterInputDto,
    unknown,
    FilterOutputDto
  >({
    resolver,
    defaultValues: { ...defaultQuery },
  });

  const getGuides = async (values: FilterOutputDto) => {
    setLoading(true);
    setError(false);
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
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = handleSubmit(async (data) => {
    await getGuides(data);
  });

  const handleReset = () => {
    reset();
    setGuides([]);
    setError(false);
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
          title={i18n.t('advancedSearch.form.fields.champion.title')}
          options={championList
            .map(({ id, name }) => ({
              value: id,
              label: name,
            }))}
          placeholder={i18n.t('advancedSearch.form.fields.champion.placeholder')}
          name={'champion'}
        />

        <AppInputController
          control={control}
          inputOptions={{
            placeholder: i18n.t('advancedSearch.form.fields.title.placeholder'),
            label: i18n.t('advancedSearch.form.fields.title.label'),
          }}
          name={'title'}
        />

        <AppSelectController
          control={control}
          name={'role'}
          options={ROLE_OPTIONS}
          title={i18n.t('advancedSearch.form.fields.role.title')}
          placeholder={i18n.t('advancedSearch.form.fields.role.placeholder')}
        />

        <AppUserSelectController
          control={control}
          name='createdBy'
          label={i18n.t('advancedSearch.form.fields.createdBy.title')}
          placeholder={i18n.t('advancedSearch.form.fields.createdBy.placeholder')}
          reset={resetCreatedByField}
        />

        <AppSwitchController
          control={control}
          name={'deprecatedPatchVersion'}
          label={i18n.t('advancedSearch.form.fields.deprecatedPatch.label')}
        />

        <View
          style={styles.filterButtons}
        >
          <StyledButton mode={'outlined'} onPress={handleReset}>
            {i18n.t('advancedSearch.form.actions.clear')}
          </StyledButton>
          <StyledButton onPress={onSubmit}>{i18n.t('advancedSearch.form.actions.submit')}</StyledButton>
        </View>
      </View>

      <View style={styles.list}>
        {loading && <Text>{i18n.t('advancedSearch.feedback.loading')}</Text>}
        {error && <Text>{i18n.t('advancedSearch.feedback.error')}</Text>}
        <FlatList
          contentContainerStyle={styles.flatlistContentContainer}
          ListEmptyComponent={() => {
            const message = isFromSearch ? i18n.t('advancedSearch.listEmpty.fromSearch') : i18n.t('advancedSearch.listEmpty.empty')
            return (
              <View>
                <Text>{message}</Text>
              </View>
            )
          }}
          data={guides}
          keyExtractor={({ id }) => id}
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
          ListFooterComponent={guides.length > 0 ? <Button onPress={loadMore}>{i18n.t('advancedSearch.loadMore')}</Button> : null}
        />
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
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
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