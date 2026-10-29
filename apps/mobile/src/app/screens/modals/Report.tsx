import { zodResolver } from "@hookform/resolvers/zod"
import { StaticScreenProps, useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { StyleSheet } from "react-native"
import { Button, Dialog, MD3Theme, Portal, Snackbar, Text, useTheme } from "react-native-paper"
import z from 'zod'

import { enumReportReason, GuideDto, ISerializedComment, REPORT_REASON } from "@org/contracts"
import { StyledButton, StyledView } from "@org/ui"

import AppSelectController from "../../../components/forms/app-select-controller/AppSelectController"
import AppInputController from "../../../components/forms/AppInputController"
import FormFieldErrors from "../../../components/forms/FormFieldErrors"
import { ApiService } from "../../../services/api/api.service"

const reasonsList = [
  {
    value: REPORT_REASON.INAPPROPRIATE_CONTENT,
    label: 'Conteúdo impróprio ou ofensivo'
  },
  {
    value: REPORT_REASON.INCORRECT_INFORMATION,
    label: 'Informações incorretas ou enganosas'
  },
  {
    value: REPORT_REASON.SPAM,
    label: 'Spam ou conteúdo repetitivo'
  },
  {
    value: REPORT_REASON.ADVERTISING,
    label: 'Publicidade ou autopromoção'
  },
  {
    value: REPORT_REASON.HARASSMENT,
    label: 'Assédio ou discurso de ódio'
  },
  {
    value: REPORT_REASON.COPYRIGHT,
    label: 'Infração de direitos autorais'
  },
  {
    value: REPORT_REASON.EXPLOIT_OR_CHEATING,
    label: 'Exploit, trapaça ou comportamento abusivo'
  },
  {
    value: REPORT_REASON.OTHER,
    label: 'Outro motivo'
  }
]

const formSchema = z.object({
  comment: z.string({ error: 'Valor inválido' }).optional(),
  guide: z.string({ error: 'Valor inválido' }).optional(),
  reason: enumReportReason,
  observation: z.string({ error: 'Valor inválido' }).min(3, { error: 'Deve ter ao menos 3 caracteres' }),
}).refine(
  (value) => !!(value.comment || value.guide),
  {
    error: '`guide` ou `comment` devem ser fornecidos'
  }
)

type FormDto = z.infer<typeof formSchema>

const resolver = zodResolver(formSchema)

type Props = StaticScreenProps<{
  guide?: GuideDto,
  comment?: ISerializedComment
}>

export default function ReportGuide({ route }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const { guide, comment } = route.params
  const navigation = useNavigation()

  const [visibleDialog, setVisibleDialog] = useState(false)
  const [showSnack, setShowSnack] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { control, handleSubmit, getValues, formState: { errors } } = useForm<FormDto>({
    resolver,
    defaultValues: {
      ...(guide && { guide: guide?.id }),
      ...(comment && { comment: comment?.id })
    }
  })

  const label = guide ? 'guia' : 'comentário'

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

  const handleReport = (formData: FormDto) => {
    setLoading(false)
    setError('')

    ApiService.Report.create(formData)
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
      <StyledView style={styles.container}>
        <Text variant="headlineSmall">Denunciar {label}</Text>
        <Text variant="bodyMedium">Ajude-nos a manter a comunidade segura e útil. Selecione o motivo que melhor descreve o problema encontrado neste {label}.</Text>

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
          <Text style={styles.warningText}>
            {loading ? 'Criando a denuncia' : 'Denunciar'}
          </Text>
        </StyledButton>
      </StyledView >
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={closeDialog}>
          <Dialog.Title>Denunciar {label}?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Tem certeza que deseja denunciar este {label}? Sua denúncia será analisada pela equipe responsável
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

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    container: { padding: 16, gap: 8 },
    warningText: { color: colors.error }
  })
}