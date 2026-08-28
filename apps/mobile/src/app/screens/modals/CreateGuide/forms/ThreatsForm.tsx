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
import { buildCustomButtonProps } from '../../../../../components/stepper/StepperFooter';
import useDataDragonContext from '../../../../../contexts/data-dragon/useDataDragonContext';
import { style } from '../CreateGuide';

const ThreatsSchema = CreateGuideFormSchema.pick({
  threats: true,
  threatsDescription: true,
});

type ThreatsDto = z.infer<typeof ThreatsSchema>;

const resolver = zodResolver(ThreatsSchema);

export default function ThreatsForm() {
  const useDataDragon = useDataDragonContext();
  const mainFormContext = useFormContext<CreateGuideFormDto>();

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

  const championList = useDataDragon.dataDragon?.champions || [];

  const appendThreat = () => {
    append({
      threat: '',
      description: '',
    });
  };

  const onSubmit = (formValues: ThreatsDto) => {
    mainFormContext.setValues(formValues, { shouldValidate: true });
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
              label: 'Descrição das ameaças',
              placeholder: 'Descrição da ameaças',
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
                  <View style={style.fieldContainer}>
                    <AppSelectController
                      key={`${index}.threat`}
                      control={control}
                      title={'Selecione uma ameaça'}
                      options={championList.map(({ id, name }) => ({
                        value: id,
                        label: name,
                      }))}
                      placeholder={'Selecione uma ameaça'}
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
                        label: 'Descrição da ameaça',
                        placeholder: 'Descrição da ameaça',
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
                      Remover ameaça
                    </StyledButton>
                  </View>
                );
              }}
            />
          </ScrollView>
        </View>
        <StyledButton style={styles.addThreat} onPress={appendThreat}>
          Adicionar ameaça
        </StyledButton>
      </View>
      <StepperFooter
        customNextButton={buildCustomButtonProps({
          onPress: handleSubmit(onSubmit),
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
});