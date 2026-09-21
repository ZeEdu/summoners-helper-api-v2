import { zodResolver } from "@hookform/resolvers/zod"
import { StaticScreenProps, useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button, Dialog, Portal, Snackbar, Text, useTheme } from "react-native-paper"

import { CreateGuideReportFormDto, CreateGuideReportFormSchema, GuideReportReason, IGuide } from "@org/contracts"
import { StyledButton, StyledView } from "@org/ui"

import AppSelectController from "../../../components/forms/app-select-controller/AppSelectController"
import AppInputController from "../../../components/forms/AppInputController"
import FormFieldErrors from "../../../components/forms/FormFieldErrors"
import { ApiService } from "../../../services/api/api.service"

const reasonsList = [
  {
    value: GuideReportReason.INAPPROPRIATE_CONTENT,
    label: 'Conteúdo impróprio ou ofensivo'
  },
  {
    value: GuideReportReason.INCORRECT_INFORMATION,
    label: 'Informações incorretas ou enganosas'
  },
  {
    value: GuideReportReason.SPAM,
    label: 'Spam ou conteúdo repetitivo'
  },
  {
    value: GuideReportReason.ADVERTISING,
    label: 'Publicidade ou autopromoção'
  },
  {
    value: GuideReportReason.HARASSMENT,
    label: 'Assédio ou discurso de ódio'
  },
  {
    value: GuideReportReason.COPYRIGHT,
    label: 'Infração de direitos autorais'
  },
  {
    value: GuideReportReason.EXPLOIT_OR_CHEATING,
    label: 'Exploit, trapaça ou comportamento abusivo'
  },
  {
    value: GuideReportReason.OTHER,
    label: 'Outro motivo'
  }
]

const resolver = zodResolver(CreateGuideReportFormSchema)

type Props = StaticScreenProps<{
  guide: IGuide
}>

export default function ReportGuide({ route }: Props) {
  const theme = useTheme()
  const { guide } = route.params
  const navigation = useNavigation()

  const [visibleDialog, setVisibleDialog] = useState(false)
  const [showSnack, setShowSnack] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { control, handleSubmit, getValues, formState: { errors } } = useForm<CreateGuideReportFormDto>({
    resolver,
    defaultValues: {
      guide: guide._id.toString(),
    }
  })

  const openDialog = () => {
    setVisibleDialog(true)
  }

  const closeDialog = () => {
    setVisibleDialog(false)
  }

  const openSnack = () => {
    setShowSnack(true)
  }

  const closeSnack = () => {
    setShowSnack(false)
  }

  const handleSnackDismiss = () => {
    closeSnack()

    if (!Boolean(error)) {
      navigation.goBack()
    }
  }

  const handleReportGuide = () => {
    closeDialog()
    handleReport(getValues())
  }

  const handleReport = (formData: CreateGuideReportFormDto) => {
    setLoading(false)
    setError('')

    ApiService.GuideReport.create(formData)
      .catch((err) => {
        setError('A denuncia falhou. Tente novamente.')
      })
      .finally(() => {
        setLoading(false)
        openSnack()
      });

  }

  return (
    <>
      <StyledView style={{ padding: 16, gap: 8 }}>
        <Text variant="headlineSmall">Denunciar guia</Text>
        <Text variant="bodyMedium">Ajude-nos a manter a comunidade segura e útil. Selecione o motivo que melhor descreve o problema encontrado neste guia.</Text>

        <Text variant="headlineSmall">Motivo da denúncia</Text>
        <Text variant="bodyMedium">Selecione um motivo para continuar</Text>

        <AppSelectController
          control={control}
          name={'reason'}
          title={"Motivo"}
          options={reasonsList}
          placeholder={"Escolha o motivo"}
        />
        <FormFieldErrors fieldError={errors.reason} />

        <Text variant="bodyMedium">Sua denúncia será analisada e as medidas necessárias poderão ser tomadas de acordo com nossas regras.</Text>

        <AppInputController
          control={control}
          name={"observation"}
          inputOptions={{
            label: 'Descrição',
            placeholder: 'Descreva o seu motivo',
            multiline: true
          }}
        />
        <FormFieldErrors fieldError={errors.observation} />

        <StyledButton buttonColor={theme.colors.errorContainer} onPress={handleSubmit(openDialog)} disabled={loading}>
          <Text style={{ color: theme.colors.error }}>
            {loading ? 'Criando a denuncia' : 'Denunciar'}
          </Text>
        </StyledButton>
      </StyledView>
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={closeDialog}>
          <Dialog.Title>Denunciar guia?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Tem certeza que deseja denunciar este guia? Sua denúncia será analisada pela equipe responsável
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancelar</Button>
            <Button onPress={handleReportGuide}>Denunciar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Snackbar
          duration={5_000}
          visible={showSnack}
          onDismiss={handleSnackDismiss}
        >
          {error || 'Denuncia feita com sucesso!'}
        </Snackbar>
      </Portal>
    </>
  )
}