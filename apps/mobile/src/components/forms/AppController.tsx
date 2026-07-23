import { Controller, FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// import { FormControl, FormControlLabel, FormControlLabelText } from "@org/ui/form-control";
// import { Input, InputField } from "@org/ui/input";

interface AppControllerProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> extends UseControllerProps<T, TName> {
  label: string,
  placeholder: string,
  style?: StyleProp<ViewStyle>
}

export function AppController<T extends FieldValues>({ name, label, placeholder, control }: AppControllerProps<T>) {
  return <Controller name={name} control={control} render={({ formState: { isValid }, field: { onChange, onBlur, value } }) => {
    return <View style={styles.container}>
      {/* <FormControl isInvalid={!isValid} isRequired>
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
          />
        </Input>
      </FormControl> */}
    </View>
  }}></Controller >
}

const styles = StyleSheet.create({
  container: {},
  label: {},
  input: {}
})