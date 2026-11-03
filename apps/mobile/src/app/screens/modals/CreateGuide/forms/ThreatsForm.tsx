import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import z from 'zod';

import { CreateGuideFormDto, CreateGuideFormSchema } from '@org/contracts';
import { StyledButton } from '@org/ui';

import AppSelectController from '../../../../../components/forms/app-select-controller/AppSelectController';
import AppInputController from '../../../../../components/forms/AppInputController';
import FormFieldErrors from '../../../../../components/forms/FormFieldErrors';
import { StepperFooter } from '../../../../../components/stepper';
import { buildCustomButtonProps } from '../../../../../components/stepper/build-custom-button-props';
import { useStepperContext } from '../../../../../components/stepper/context';
import useDataDragonContext from '../../../../../contexts/data-dragon/useDataDragonContext';
import useI18n from '../../../../../contexts/i18n/useI18n';

const ThreatsSchema = CreateGuideFormSchema.pick({
  threats: true,
  threatsDescription: true,
});

export type ThreatsDto = z.infer<typeof ThreatsSchema>;

const resolver = zodResolver(ThreatsSchema);

export default function ThreatsForm() {
  const dataDragon = useDataDragonContext();
  const i18n = useI18n()
  const mainFormContext = useFormContext<CreateGuideFormDto>();
  const stepperContext = useStepperContext();

  const defaultValues: ThreatsDto = {
    threatsDescription: mainFormContext.getValues('threatsDescription'),
    threats: mainFormContext.getValues('threats'),
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ThreatsDto>({ resolver, defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'threats',
  });

  const championList = dataDragon.lists.champions || [];

  const appendThreat = () => {
    append({
      threat: '',
      description: '',
    });
  };

  const onSubmit = (formValues: ThreatsDto) => {
    mainFormContext.setValues(formValues, { shouldValidate: true });
    stepperContext.nextStep()
  };

  const getErrorFromIndex = (index: number) => {
    return errors.threats?.[index];
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View>
          <AppInputController
            control={control}
            name={`threatsDescription`}
            inputOptions={{
              label: i18n.t('threatsForm.fields.description.label'),
              placeholder: i18n.t('threatsForm.fields.description.placeholder'),
              multiline: true,
            }}
          />
          <FormFieldErrors fieldError={errors.threatsDescription} />
        </View>
        <View style={styles.scroll}>
          <ScrollView>
            <FlatList
              data={fields}
              renderItem={({ index }) => {
                return (
                  <View style={styles.fieldContainer}>
                    <AppSelectController
                      key={`${index}.threat`}
                      control={control}
                      title={i18n.t('threatsForm.fields.addThreat.select.title')}
                      options={championList.map(({ id, name }) => ({
                        value: id,
                        label: name,
                      }))}
                      placeholder={i18n.t('threatsForm.fields.addThreat.description.placeholder')}
                      name={`threats.${index}.threat`}
                    />

                    <FormFieldErrors
                      fieldError={getErrorFromIndex(index)?.threat}
                    />

                    <AppInputController
                      key={`${index}.description`}
                      control={control}
                      name={`threats.${index}.description`}
                      inputOptions={{
                        label: i18n.t('threatsForm.fields.addThreat.description.label'),
                        placeholder: i18n.t('threatsForm.fields.addThreat.description.placeholder'),
                        multiline: true,
                      }}
                    />

                    <FormFieldErrors
                      fieldError={getErrorFromIndex(index)?.description}
                    />

                    <StyledButton
                      onPress={() => {
                        remove(index);
                      }}
                    >
                      {i18n.t('threatsForm.fields.removeThreatButton')}
                    </StyledButton>
                  </View>
                );
              }}
            />
          </ScrollView>
        </View>
        <StyledButton style={styles.addThreat} onPress={appendThreat}>
          {i18n.t('threatsForm.addThreatButton')}
        </StyledButton>
      </View>
      <StepperFooter
        customNextButton={buildCustomButtonProps({
          onPress: handleSubmit(onSubmit),
          t: i18n.t
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  form: { flex: 1, gap: 16 },
  addThreat: { marginBottom: 16 },
  fieldContainer: {
    display: 'flex',
    gap: 8,
  }
});