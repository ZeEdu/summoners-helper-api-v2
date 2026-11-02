import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import z from 'zod';

import { CreateGuideFormDto, CreateGuideFormSchema } from '@org/contracts';

import AppInputController from '../../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../../components/forms/FormFieldErrors';
import { buildCustomButtonProps } from '../../../../../components/stepper/build-custom-button-props';
import { useStepperContext } from '../../../../../components/stepper/context';
import StepperFooter from '../../../../../components/stepper/StepperFooter';
import useI18n from '../../../../../contexts/i18n/useI18n';
import { usePatchVersion } from '../../../../../contexts/patchVersion/usePatchVersion';
import useChampionData from '../../../../../hooks/useChampion';
import Error from '../../../feedback/Error';
import Loading from '../../../feedback/Loading';
import { keyFromLvlsBuilder, LvlKey, lvlsArrayBuilder } from './utils';

export const abilitiesProgressionSchema = CreateGuideFormSchema.pick({
  abilitiesProgression: true,
  abilitiesProgressionDescription: true,
});

export type AbilitiesProgressionDto = z.infer<
  typeof abilitiesProgressionSchema
>;

const resolver = zodResolver(abilitiesProgressionSchema);

export const keymapIndex = {
  0: 'q',
  1: 'w',
  2: 'e',
  3: 'r',
};

export type KeymapIndexType = keyof typeof keymapIndex;

enum AbilityOption {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
}

export const indexToAbilityOption = {
  0: AbilityOption.A,
  1: AbilityOption.B,
  2: AbilityOption.C,
  3: AbilityOption.D,
};

const NoChampionSelected = () => {
  const i18n = useI18n()
  return (
    <View>
      <Text>{i18n.t('progressionForm.description.label')}</Text>
    </View>
  );
};

type Props = {
  champion: string;
};

export default function GuideAbilitiesProgressionForm({ champion }: Props) {
  const { championData, loading, error } = useChampionData(champion);

  const i18n = useI18n()
  const theme = useTheme();
  const styles = makeStyles(theme);

  const { version } = usePatchVersion();

  const mainFormContext = useFormContext<CreateGuideFormDto>();
  const stepperContext = useStepperContext();

  const defaultValues: AbilitiesProgressionDto = {
    abilitiesProgression: mainFormContext.getValues('abilitiesProgression'),
    abilitiesProgressionDescription: mainFormContext.getValues('abilitiesProgressionDescription')
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValues,
  } = useForm<AbilitiesProgressionDto>({
    resolver,
    defaultValues
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (!championData) {
    return <NoChampionSelected />;
  }

  const onSubmit = (formValues: AbilitiesProgressionDto) => {
    mainFormContext.setValues(formValues, { shouldValidate: true });
    stepperContext.nextStep();
  };

  const setFieldOnDraft = (key: LvlKey, index: number) => {
    const value = indexToAbilityOption[index as KeymapIndexType];

    const formValues = getValues();

    setValues({
      ...formValues,
      abilitiesProgression: {
        ...formValues.abilitiesProgression,
        [key]: value,
      },
    });
  };

  const isSelected = (levelKey: LvlKey, index: number) => {
    const value = indexToAbilityOption[index as KeymapIndexType];
    return getValues('abilitiesProgression')[levelKey] === value;
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <AppInputController
          control={control}
          name={'abilitiesProgressionDescription'}
          inputOptions={{
            label: i18n.t('progressionForm.description.label'),
            placeholder: i18n.t('progressionForm.description.placeholder'),
            multiline: true,
          }}
        />
        <FormFieldErrors fieldError={errors.abilitiesProgressionDescription} />
      </View>
      <View style={styles.headerContainer}>
        {championData.spells.map((ability, index) => {
          const keymap = keymapIndex[index as KeymapIndexType];
          const uri = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${championData.id}${keymap.toUpperCase()}.png`;
          return (
            <View key={ability.id} style={styles.headerColumnsContainer}>
              <Image style={styles.headerImage} source={{ uri }} />
              <Text style={styles.headerTitle}>{ability.name}</Text>
            </View>
          );
        })}
      </View>
      <ScrollView>
        <View style={styles.levelSelectionContainer}>
          {championData.spells.map((_, index) => {
            return (
              <FlatList
                data={lvlsArrayBuilder()}
                keyExtractor={(level) => level.toString()}
                style={styles.list}
                renderItem={({ item: level }) => {
                  return (
                    <Pressable
                      onPress={() =>
                        setFieldOnDraft(keyFromLvlsBuilder(level), index)
                      }
                      style={[
                        styles.listItemContainer,
                        {
                          backgroundColor: isSelected(
                            keyFromLvlsBuilder(level),
                            index,
                          )
                            ? theme.colors.onPrimaryContainer
                            : theme.colors.onPrimary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.listItemText,
                          {
                            color: isSelected(keyFromLvlsBuilder(level), index)
                              ? theme.colors.onPrimary
                              : theme.colors.onPrimaryContainer,
                          },
                        ]}
                      >
                        {level}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            );
          })}
        </View>
      </ScrollView>
      <StepperFooter
        customNextButton={buildCustomButtonProps({
          onPress: handleSubmit(onSubmit),
          t: i18n.t
        })}
      />
    </View>
  );
}

const makeStyles = ({ roundness }: MD3Theme) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      gap: 12,
      marginTop: 16,
    },
    headerContainer: {
      flexDirection: 'row',
    },
    headerColumnsContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8,
    },
    headerImage: {
      width: 64,
      height: 64,
      borderRadius: roundness,
    },
    headerTitle: {
      textAlign: 'center',
    },
    levelSelectionContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    list: {
      flex: 1,
    },
    listItemContainer: {
      marginHorizontal: 'auto',
      marginTop: 16,
      width: 64,
      height: 64,
      borderRadius: roundness,
      display: 'flex',
      justifyContent: 'center',
    },
    listItemText: {
      textAlign: 'center',
    },
  });
};