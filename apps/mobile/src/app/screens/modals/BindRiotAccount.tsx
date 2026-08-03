
import { zodResolver } from '@hookform/resolvers/zod';
import { RIOT_SERVERS, UpdateUserProfileDto, updateUserProfileSchema } from '@org/contracts';
import { Dropdown, StyledView } from '@org/ui';
import { useForm } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import AppController from '../../../components/forms/AppController';
import FormFieldErrors from '../../../components/forms/FormFieldErrors';

const resolver = zodResolver(updateUserProfileSchema);

const options = [
  {
    id: '1',
    icon: 'dice-1',
    title: 'Dice 1',
  },
  {
    id: '2',
    icon: 'dice-2',
    title: 'Dice 2',
  },
  {
    id: '3',
    icon: 'dice-3',
    title: 'Dice 3',
  },
  {
    id: '4',
    icon: 'dice-4',
    title: 'Dice 4',
  },
  {
    id: '5',
    icon: 'dice-5',
    title: 'Dice 5',
  },
  {
    id: '6',
    icon: 'dice-6',
    title: 'Dice 6',
  },
];

export default function BindRiotAccount() {
  // gameName, tagLine, server
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserProfileDto>({
    resolver,
    defaultValues: {
      server: RIOT_SERVERS.BR1,
    },
  });

  return (
    <StyledView>
      <AppController name="server" label="Servidor" placeholder='Selecione o seu servidor' control={control}></AppController>
      <Dropdown mode='outlined' right={<TextInput.Icon icon="menu-down" />}>
        {options
          .map(
            ({ id, title }) => (
              <Dropdown.Item key={id} title={title} value={title}>
              </Dropdown.Item>
            )
          )
        }
      </Dropdown>
      <FormFieldErrors fieldError={errors.server} />
      {/* <ApiFieldErrors apiErrors={apiErrors?.email} /> */}
    </StyledView>
  )
}