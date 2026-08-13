import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { List, Text } from "react-native-paper";
import z from 'zod';

import { StyledButton, StyledView } from "@org/ui";

import { ScrollView, StyleSheet, View } from "react-native";
import AppSelectController from "../../../../components/forms/app-select-controller/AppSelectController";
import AppInputController from "../../../../components/forms/AppInputController";
import FormFieldErrors from "../../../../components/forms/FormFieldErrors";
import { usePatchVersion } from "../../../../contexts/patchVersion/usePatchVersion";
import { ChampionDataDragon, ChampionsDataDragon, ChampionsDataDragonDetails, ChampionsDataDragonDetailsSolo } from "../../../../dtos/champion.dto";
import { RunesReforgedDataDragon } from "../../../../dtos/runes-reforged.dto";
import { SummonerSpell, SummonerSpellDataDragon } from "../../../../dtos/spell.dto";
import { ModalStackParamList } from "../../../navigation/types";
import AbilitiesProgressionField from "./AbilityProgressionModal";
import ItemsSelectionModal, { ItemsBlockDto } from "./ItemSelection/ItemsSelectionModal";

type Props = NativeStackScreenProps<ModalStackParamList, 'CreateGuide'>

interface IGuide {
  title: string;
  introduction: string;
  champion: string;
  role: string;
  firstSpell: string,
  secondSpell: string
}

export enum SLOT_BONUS {
  ADAPTIVE = 'ADAPTIVE',
  ATTACK_SPEED = 'ATTACK_SPEED',
  HASTE = 'HASTE',
  MOVEMENT_SPEED = 'MOVEMENT_SPEED',
  BONUS_HEALTH = 'BONUS_HEALTH',
  BASE_HEALTH = 'BASE_HEALTH',
  TENACITY = 'TENACITY',
}

export enum SLOT_BONUS_LABELS {
  ADAPTIVE = '9 Adaptive',
  ATTACK_SPEED = '10% Attack Speed',
  HASTE = '8 Ability Haste',
  MOVEMENT_SPEED = '2.5% Movement Speed',
  BONUS_HEALTH = '10 - 180 Bonus Health',
  BASE_HEALTH = '65 Base Health',
  TENACITY = '15% Tenacity/Slow Resist',
}

const slotOne = [
  {
    value: SLOT_BONUS.ADAPTIVE,
    label: SLOT_BONUS_LABELS.ADAPTIVE,
  },
  {
    value: SLOT_BONUS.ATTACK_SPEED,
    label: SLOT_BONUS_LABELS.ATTACK_SPEED,
  },
  {
    value: SLOT_BONUS.HASTE,
    label: SLOT_BONUS_LABELS.HASTE,
  },
];

const slotTwo = [
  {
    value: SLOT_BONUS.ADAPTIVE,
    label: SLOT_BONUS_LABELS.ADAPTIVE,
  },
  {
    value: SLOT_BONUS.MOVEMENT_SPEED,
    label: SLOT_BONUS_LABELS.MOVEMENT_SPEED,
  },
  {
    value: SLOT_BONUS.BONUS_HEALTH,
    label: SLOT_BONUS_LABELS.BONUS_HEALTH,
  },
];

const slotThree = [
  {
    value: SLOT_BONUS.BASE_HEALTH,
    label: SLOT_BONUS_LABELS.BASE_HEALTH,
  },
  {
    value: SLOT_BONUS.TENACITY,
    label: SLOT_BONUS_LABELS.TENACITY,
  },
  {
    value: SLOT_BONUS.BONUS_HEALTH,
    label: SLOT_BONUS_LABELS.BONUS_HEALTH,
  },
];

export const runeSchema = z.object({
  primaryRune: z.string({ error: 'formato do campo é inválido' }),
  primarySlots: z.object({
    first: z.string({ error: 'formato do campo é inválido' }),
    second: z.string({ error: 'formato do campo é inválido' }),
    third: z.string({ error: 'formato do campo é inválido' }),
    fourth: z.string({ error: 'formato do campo é inválido' }),
  }),
  secondaryRune: z.string({ error: 'formato do campo é inválido' }),
  secondarySlots: z.object({
    first: z.string({ error: 'formato do campo é inválido' }),
    second: z.string({ error: 'formato do campo é inválido' }),
    third: z.string({ error: 'formato do campo é inválido' }),
  })
})

enum AbilityOption {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
}

const enumAbilitiesOption = z.enum(AbilityOption, { error: `Valor invalido. Deve ser um dos seguintes valores: ${AbilityOption.A},${AbilityOption.B},${AbilityOption.C} ou ${AbilityOption.D}` })

export const abilitiesProgressionSchema = z.object({
  l1: enumAbilitiesOption,
  l2: enumAbilitiesOption,
  l3: enumAbilitiesOption,
  l4: enumAbilitiesOption,
  l5: enumAbilitiesOption,
  l6: enumAbilitiesOption,
  l7: enumAbilitiesOption,
  l8: enumAbilitiesOption,
  l9: enumAbilitiesOption,
  l10: enumAbilitiesOption,
  l11: enumAbilitiesOption,
  l12: enumAbilitiesOption,
  l13: enumAbilitiesOption,
  l14: enumAbilitiesOption,
  l15: enumAbilitiesOption,
  l16: enumAbilitiesOption,
  l17: enumAbilitiesOption,
  l18: enumAbilitiesOption,
})

const itemArraySchema = z.object({
  itemId: z.string({ error: 'formato do campo é inválido' }),
})

const itemSchema = z.object({
  itemRollName: z.string({ error: 'formato do campo é inválido' }),
  itemArray: z.array(itemArraySchema),
  description: z.string({ error: 'formato do campo é inválido' }),
})

export const createGuideSchema = z.object({
  title: z.string({ error: 'formato do campo é inválido' }),
  introduction: z.string({ error: 'formato do campo é inválido' }),
  patchVersion: z.string({ error: 'formato do campo é inválido' }),
  champion: z.string({ error: 'formato do campo é inválido' }),
  role: z.string({ error: 'formato do campo é inválido' }),

  runesDescription: z.string({ error: 'formato do campo é inválido' }),
  runes: runeSchema,

  // Bonus
  bonusSlotOne: z.string({ error: 'formato do campo é inválido' }),
  bonusSlotTwo: z.string({ error: 'formato do campo é inválido' }),
  bonusSlotThree: z.string({ error: 'formato do campo é inválido' }),
  bonusDescription: z.string({ error: 'formato do campo é inválido' }),

  // Spells
  firstSpell: z.string({ error: 'formato do campo é inválido' }),
  secondSpell: z.string({ error: 'formato do campo é inválido' }),
  spellsDescription: z.string({ error: 'formato do campo é inválido' }),

  // Items
  itemsBlock: z.array(itemSchema),
  itemsDescription: z.string({ error: 'formato do campo é inválido' }),

  // Abilities Progression
  abilitiesProgression: abilitiesProgressionSchema,
  abilitiesProgressionDescription: z.string({ error: 'formato do campo é inválido' }),

  threatsDescription: z.string({ error: 'formato do campo é inválido' }),
  threats: z.array(
    z.object({
      threat: z.string({ error: 'formato do campo é inválido' }),
      description: z.string({ error: 'formato do campo é inválido' })
    })
  ),
  createdAt: z.string({ error: 'formato do campo é inválido' })
})
  .superRefine(({ firstSpell, secondSpell }, ctx) => {
    if (firstSpell === secondSpell) {
      ctx.addIssue({
        code: 'custom',
        message: 'Você não pode selecionar a mesma magia',
        path: ['secondSpell']
      })
    }
  }) satisfies z.ZodType<IGuide>

export type CreateGuideDto = z.infer<typeof createGuideSchema>

const resolver = zodResolver(createGuideSchema)

enum ROLES {
  JUNGLE = 'JUNGLE',
  TOP_LANE = 'TOP_LANE',
  MID_LANE = 'MID_LANE',
  ADC = 'ADC',
  SUPPORT = 'SUPPORT'
}

enum ROLES_LABEL {
  JUNGLE = 'Jungle',
  TOP_LANE = 'Top Lane',
  MID_LANE = 'Mid Lane',
  ADC = 'ADC',
  SUPPORT = 'Support'
}

const ROLE_OPTIONS: { value: string, label: string }[] = [
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
  }
]

export default function CreateGuide(_: Props) {
  const { version } = usePatchVersion()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm<CreateGuideDto>({
    resolver,
    defaultValues: {
      patchVersion: version, // Valor travado

      introduction: '',
      title: '',
      champion: '',
      role: '',

      spellsDescription: '',
      firstSpell: '',
      secondSpell: '',

      bonusDescription: '',
      bonusSlotOne: '',
      bonusSlotThree: '',
      bonusSlotTwo: '',
      threats: [],
      createdAt: new Date().toDateString()
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'threats' })

  const [championList, setChampionList] = useState<ChampionsDataDragonDetails[]>([])
  const [championData, setChampionData] = useState<ChampionsDataDragonDetailsSolo | undefined>(undefined)
  const [summonerSpells, setSummonerSpells] = useState<SummonerSpell[]>([])

  const [runes, setRunes] = useState<RunesReforgedDataDragon[]>([])
  const [runesMap, setRunesMap] = useState<Record<string, RunesReforgedDataDragon>>({})

  const [showAbilitiesProgressionModal, setShowAbilitiesProgressionModal] = useState(false)
  const [showItemsSelectionModal, setShowItemsSelectionModal] = useState(false)

  const onSubmit = (value: CreateGuideDto) => {
    console.log({ value });
  }

  const watchChampion = useWatch({
    control,
    name: 'champion'
  })

  const watchPrimaryRune = useWatch({
    control,
    name: 'runes.primaryRune'
  })

  const watchSecondaryRune = useWatch({
    control,
    name: 'runes.secondaryRune'
  })

  const watchSecondaryRuneSlots = useWatch({
    control,
    name: ['runes.secondarySlots.first', 'runes.secondarySlots.second', 'runes.secondarySlots.third']
  })

  useEffect(() => {
    async function getChampionData(championName: string) {
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.6.1/data/pt_BR/champion/${championName}.json`)
      const json = await response.json() as ChampionDataDragon
      setChampionData(json.data[championName])
    }

    if (watchChampion) {
      setLoading(true)
      getChampionData(watchChampion)
        .catch(() => {
          setError('Não foi possível carregar os dados do campeão')
        })
        .finally(() => {
          setLoading(false)
        })

    } else {
      setChampionData(undefined)
    }
    // Carregar dados do campeão
  }, [watchChampion])

  // Carregar todos os dados
  useEffect(() => {
    // TODO: Puxar tudo isso num serviço chamado no startup da aplicação
    async function loadChampionList() {
      const response = await fetch('https://ddragon.leagueoflegends.com/cdn/12.6.1/data/pt_BR/champion.json')
      const json = await response.json() as ChampionsDataDragon
      const championsData = json.data
      setChampionList(Object.values(championsData))
    }

    async function loadSummonerSpells() {
      const response = await fetch('https://ddragon.leagueoflegends.com/cdn/12.6.1/data/pt_BR/summoner.json')
      const json = await response.json() as SummonerSpellDataDragon
      const spells = Object.values(json.data)
      setSummonerSpells(spells)
    }

    async function loadRunesReforged() {
      const response = await fetch('https://ddragon.leagueoflegends.com/cdn/12.6.1/data/pt_BR/runesReforged.json')
      const json = await response.json() as RunesReforgedDataDragon[]
      setRunes(json)

      const runesMap = json
        .reduce(
          (previousValue: Record<string, RunesReforgedDataDragon>, currentValue: RunesReforgedDataDragon) =>
            ({ ...previousValue, [currentValue.id.toString()]: currentValue }), {} as Record<string, RunesReforgedDataDragon>
        )

      setRunesMap(runesMap)
    }

    async function init() {
      await loadChampionList()
      await loadSummonerSpells()
      await loadRunesReforged()
    }

    setLoading(true)
    init()
      .catch(() => {
        setError('Um erro ocorreu')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const appendThreat = () => {
    append({
      threat: '',
      description: ''
    })
  }

  const buildMainRunesOptions = () => {
    return runes
      .filter((rune) => rune.id.toString() !== getValues('runes.secondaryRune'))
      .map(({ id, name }) => ({ value: id.toString(), label: name }))
  }

  const buildSecondaryRunesOptions = () => {
    return runes
      .filter((rune) => rune.id.toString() !== getValues('runes.primaryRune'))
      .map(({ id, name }) => ({ value: id.toString(), label: name }))
  }

  const buildFirstRunesOptions = (slot: 'first' | 'second' | 'third' | 'forth') => {
    const currentPrimaryRunes = getValues('runes.primaryRune')
    if (!currentPrimaryRunes) {
      return []
    }

    let index: number
    if (slot === 'first') {
      index = 0
    } else if (slot === 'second') {
      index = 1
    } else if (slot === 'third') {
      index = 2
    } else {
      index = 3
    }

    const { slots } = runesMap[currentPrimaryRunes]
    return slots[index].runes
      .map(({ id, name }) => ({ value: id.toString(), label: name }))
  }

  const buildSecondaryRunesSlotOptions = (slot: 'first' | 'second' | 'third') => {
    const currentSecondaryRunes = getValues('runes.secondaryRune')
    if (!currentSecondaryRunes) {
      return []
    }

    const { slots } = runesMap[currentSecondaryRunes]
    const runes = [...slots[1].runes, ...slots[2].runes, ...slots[3].runes]

    return runes
      .filter((rune) => {
        const notFirstSecondarySlot = rune.id.toString() !== getValues('runes.secondarySlots.first')
        const notSecondSecondarySlot = rune.id.toString() !== getValues('runes.secondarySlots.second')
        const notThirdSecondarySlot = rune.id.toString() !== getValues('runes.secondarySlots.third')

        if (slot === 'first') {
          return notSecondSecondarySlot && notThirdSecondarySlot
        } else if (slot === 'second') {
          return notFirstSecondarySlot && notThirdSecondarySlot
        } else {
          return notFirstSecondarySlot && notSecondSecondarySlot
        }
      })
      .map(
        ({ id, name }) => ({ value: id.toString(), label: name })
      )
  }

  const handleCloseAbilitiesProgressionModal = (value?: any) => {
    setShowAbilitiesProgressionModal(false)

    if (value) {
      setValue('abilitiesProgression', value)
    }
  }

  const handleCloseItemsSelectionModal = (value?: ItemsBlockDto) => {
    setShowItemsSelectionModal(false)

    if (value) {
      setValue('itemsBlock', value.itemsBlock)
    }
  }

  if (loading || !version) {
    return (
      <StyledView>
        <Text
          variant="headlineLarge"
        >
          Carregando
        </Text>
      </StyledView>
    )
  }

  if (error) {
    return (
      <StyledView>
        <Text
          variant="headlineLarge"
        >
          {error}
        </Text>
      </StyledView>
    )
  }

  return (
    <>
      <StyledView style={style.container}>
        <ScrollView>
          <AppInputController
            control={control}
            name={"title"}
            inputOptions={{
              label: 'Titulo',
              placeholder: 'Titulo'
            }}
          />

          <AppInputController
            control={control}
            name={"patchVersion"}
            inputOptions={{
              label: 'Versão do patch',
              disabled: true
            }}
          />

          <AppInputController
            control={control}
            name={"introduction"}
            inputOptions={{
              label: 'Introdução label',
              placeholder: 'Introdução place',
              multiline: true
            }}
          />

          <AppSelectController
            control={control}
            title={'Selecione um campeão'}
            options={championList.map(({ id, name }) => ({ value: id, label: name }))}
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

          <AppSelectController
            control={control}
            title={'Selecione uma magia'}
            options={summonerSpells.map(({ id, name }) => ({ value: id, label: name }))}
            placeholder={'Selecione uma magia'}
            name={'firstSpell'}
          />
          <FormFieldErrors fieldError={errors.firstSpell} />

          <AppSelectController
            control={control}
            title={'Selecione uma segunda magia'}
            options={summonerSpells.map(({ id, name }) => ({ value: id, label: name }))}
            placeholder={'Selecione uma segunda magia'}
            name={'secondSpell'}
          />
          <FormFieldErrors fieldError={errors.secondSpell} />

          <AppInputController
            control={control}
            name={'bonusDescription'}
            inputOptions={{
              label: 'Descrição dos bonus',
              placeholder: 'Descreva os bonus',
              multiline: true
            }}
          />
          <FormFieldErrors fieldError={errors.bonusDescription} />

          <AppSelectController
            control={control}
            title={'Selecione um bonus'}
            options={slotOne}
            placeholder={'Selecione um bonus'}
            name={'bonusSlotOne'}
          />
          <FormFieldErrors fieldError={errors.bonusSlotOne} />

          <AppSelectController
            control={control}
            title={'Selecione um segundo bonus'}
            options={slotTwo}
            placeholder={'Selecione um segundo bonus'}
            name={'bonusSlotTwo'}
          />
          <FormFieldErrors fieldError={errors.bonusSlotTwo} />

          <AppSelectController
            control={control}
            title={'Selecione um terceiro bonus'}
            options={slotThree}
            placeholder={'Selecione um terceiro bonus'}
            name={'bonusSlotThree'}
          />
          <FormFieldErrors fieldError={errors.bonusSlotThree} />

          <AppInputController
            control={control}
            name={"threatsDescription"}
            inputOptions={{
              label: 'Ameaças',
              placeholder: 'Ameaças',
              multiline: true
            }}
          />
          <FormFieldErrors fieldError={errors.threatsDescription} />

          {fields.map((field, index) => {
            return (
              <View style={style.fieldContainer}>
                <AppSelectController
                  key={`${field.id}.threat`}
                  control={control}
                  title={'Selecione uma ameaça'}
                  options={championList.map(({ id, name }) => ({ value: id, label: name }))}
                  placeholder={'Selecione uma ameaça'}
                  name={`threats.${index}.threat`}
                />
                <AppInputController
                  key={`${field.id}.description`}
                  control={control}
                  name={`threats.${index}.description`}
                  inputOptions={{
                    label: 'Descrição da ameaça',
                    placeholder: 'Descrição da ameaça',
                    multiline: true
                  }}
                />
                <StyledButton onPress={() => { remove(index) }}>Remover ameaça</StyledButton>
              </View>
            )
          })}

          <StyledButton onPress={appendThreat}>Adicionar ameaça</StyledButton>

          <AppSelectController
            control={control}
            title={'Caminho Principal'}
            options={buildMainRunesOptions()}
            placeholder={'Selecione um caminho'}
            name={`runes.primaryRune`}
          />
          {
            (!!watchPrimaryRune) && (
              <>
                <AppSelectController
                  control={control}
                  title={'Primeira Runa'}
                  options={buildFirstRunesOptions('first')}
                  placeholder={'Selecione a primeira runa'}
                  name={`runes.primarySlots.first`}
                />

                <AppSelectController
                  control={control}
                  title={'Segunda Runa'}
                  options={buildFirstRunesOptions('second')}
                  placeholder={'Selecione a segunda runa'}
                  name={`runes.primarySlots.second`}
                />

                <AppSelectController
                  control={control}
                  title={'Terceira Runa'}
                  options={buildFirstRunesOptions('third')}
                  placeholder={'Selecione a terceira runa'}
                  name={`runes.primarySlots.third`}
                />

                <AppSelectController
                  control={control}
                  title={'Quarta Runa'}
                  options={buildFirstRunesOptions('forth')}
                  placeholder={'Selecione a quarta runa'}
                  name={`runes.primarySlots.fourth`}
                />
              </>
            )
          }

          <AppSelectController
            control={control}
            title={'Caminho Secundario'}
            options={buildSecondaryRunesOptions()}
            placeholder={'Selecione um caminho secundario'}
            name={`runes.secondaryRune`}
          />

          {
            (!!watchSecondaryRune) && (
              <>
                <AppSelectController
                  control={control}
                  title={'Primeira Runa Secondaria'}
                  options={watchSecondaryRuneSlots && buildSecondaryRunesSlotOptions('first')}
                  placeholder={'Selecione a primeira runa secundária'}
                  name={`runes.secondarySlots.first`}
                />

                <AppSelectController
                  control={control}
                  title={'Segunda Runa Secondaria'}
                  options={watchSecondaryRuneSlots && buildSecondaryRunesSlotOptions('second')}
                  placeholder={'Selecione a segunda runa secundária'}
                  name={`runes.secondarySlots.second`}
                />

                <AppSelectController
                  control={control}
                  title={'Terceira Runa Secondaria'}
                  options={watchSecondaryRuneSlots && buildSecondaryRunesSlotOptions('third')}
                  placeholder={'Selecione a terceira runa secundária'}
                  name={`runes.secondarySlots.third`}
                />
              </>
            )
          }

          {championData && (
            <List.Item
              title={'Progressão de Habilidades'}
              onPress={() => {
                setShowAbilitiesProgressionModal(true)
              }}
              right={(props) => {
                return <List.Icon {...props} icon='chevron-right' />
              }}
            />
          )}

          <List.Item
            title={'Seleção de itens'}
            onPress={() => {
              setShowItemsSelectionModal(true)
            }}
            right={(props) => {
              return <List.Icon {...props} icon='chevron-right' />
            }}
          />
          <StyledButton onPress={handleSubmit(onSubmit)}>Enviar</StyledButton>
        </ScrollView>
        {championData && <AbilitiesProgressionField visible={showAbilitiesProgressionModal} closeModal={handleCloseAbilitiesProgressionModal} championId={championData.id} abilities={championData.spells} />}
        <ItemsSelectionModal visible={showItemsSelectionModal} closeModal={handleCloseItemsSelectionModal} />
      </StyledView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flex: 1
  },
  fieldContainer: {
    display: 'flex',
    gap: 8
  }
})