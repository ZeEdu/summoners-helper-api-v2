import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Dimensions, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

import { StyledView } from "@org/ui";

import { Stepper, StepperItem } from "../../../../components/stepper";
import { StepperProvider } from "../../../../components/stepper/context";
import { usePatchVersion } from "../../../../contexts/patchVersion/usePatchVersion";
import { ChampionDataDragon, ChampionsDataDragon, ChampionsDataDragonDetails, ChampionsDataDragonDetailsSolo } from "../../../../dtos/champion.dto";
import { ItemDetails, ItemsDataDragon } from "../../../../dtos/item.dto";
import { RunesReforgedDataDragon } from "../../../../dtos/runes-reforged.dto";
import { SummonerSpell, SummonerSpellDataDragon } from "../../../../dtos/spell.dto";
import { ModalStackParamList } from "../../../navigation/types";
import { CreateGuideDto, createGuideSchema } from "./dto/create-guide-schema";
import GuideAbilitiesProgressionForm from "./forms/AbilitiesProgressionForm";
import BonusForm from "./forms/BonusForm";
import GuideIntroductionForm from "./forms/GuideIntroductionForm";
import GuideSummonerSpellsForm from "./forms/GuideSpellsForm";
import { ItemSelectionProvider } from "./forms/items-form/context/item-selection.provider";
import ItemsForm from "./forms/items-form/ItemsForm";
import GuideMainRunesForm from "./forms/MainRunesForm";
import GuideSecondaryRunesForm from "./forms/SecondaryRunesForm";
import ThreatsForm from "./forms/ThreatsForm";

type Props = NativeStackScreenProps<ModalStackParamList, 'CreateGuide'>

const resolver = zodResolver(createGuideSchema)

export interface ItemDetailsWithId extends ItemDetails {
  id: string
}

export default function CreateGuide({ navigation }: Props) {
  const { version } = usePatchVersion()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const methods = useForm<CreateGuideDto>({
    resolver,
    defaultValues: {
      patchVersion: version, // Valor travado
      createdAt: new Date().toDateString(),
      champion: 'Ahri' // Define um valor padrão para facilitar os testes
    }
  })

  // const { control, handleSubmit, formState: { errors }, getValues, setValue, setValues } = useForm<CreateGuideDto>({
  //   resolver,
  //   defaultValues: {
  //     patchVersion: version, // Valor travado
  //     createdAt: new Date().toDateString(),

  //     spellsDescription: '',
  //     firstSpell: '',
  //     secondSpell: '',

  //     bonusDescription: '',
  //     bonusSlotOne: '',
  //     bonusSlotThree: '',
  //     bonusSlotTwo: '',

  //     threats: [],
  //   }
  // })

  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'threats' })

  const [championList, setChampionList] = useState<ChampionsDataDragonDetails[]>([])
  const [championData, setChampionData] = useState<ChampionsDataDragonDetailsSolo | undefined>(undefined)
  const [summonerSpells, setSummonerSpells] = useState<SummonerSpell[]>([])

  const [runes, setRunes] = useState<RunesReforgedDataDragon[]>([])
  const [runesMap, setRunesMap] = useState<Record<string, RunesReforgedDataDragon>>({})

  const [items, setItems] = useState<ItemDetailsWithId[]>([])
  const [itemsMap, setItemsMap] = useState<ItemsDataDragon['data']>({})

  const onSubmit = (value: CreateGuideDto) => {
    console.log({ value });
  }

  const watchChampion = useWatch({
    control: methods.control,
    name: 'champion'
  })

  const primaryRune = useWatch({
    control: methods.control,
    name: 'primaryRune'
  })

  const secondaryRune = useWatch({
    control: methods.control,
    name: 'secondaryRune'
  })

  // const watchPrimaryRune = useWatch({
  //   control,
  //   name: 'runes.primaryRune'
  // })

  // const watchSecondaryRune = useWatch({
  //   control,
  //   name: 'runes.secondaryRune'
  // })

  // const watchSecondaryRuneSlots = useWatch({
  //   control,
  //   name: ['runes.secondarySlots.first', 'runes.secondarySlots.second', 'runes.secondarySlots.third']
  // })

  const { height } = Dimensions.get("window")

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

    async function loadItems() {
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/item.json`)
      const json = await response.json() as ItemsDataDragon
      const itemsWithId = Object.keys(json.data).map((key) => ({ ...json.data[key], id: key }))
      setItems(itemsWithId)
      setItemsMap(json.data)
    }

    async function init() {
      await loadChampionList()
      await loadSummonerSpells()
      await loadRunesReforged()
      await loadItems()
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

  useEffect(() => {
    methods.setValue('champion', 'Ahri')
  }, [championList]) // TODO: Tirar isso daqui depois

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Button mode="contained" style={style.headerButton} onPress={methods.handleSubmit(onSubmit)}>Salvar</Button>
      ),
    });
  }, [navigation]);

  const appendThreat = () => {
    append({
      threat: '',
      description: ''
    })
  }

  const Loading = () => <StyledView>
    <Text
      variant="headlineLarge"
    >
      Carregando
    </Text>
  </StyledView>

  if (loading || !version) {
    return (
      <Loading />
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
    <StyledView style={{ ...style.container, height: height }}>
      {
        <FormProvider {...methods}>
          <StepperProvider>
            <Stepper>
              <StepperItem title="Primeiro Step">
                <GuideIntroductionForm championList={championList} />
              </StepperItem>
              <StepperItem title="Segundo Step">
                <GuideSummonerSpellsForm summonerSpells={summonerSpells} />
              </StepperItem>
              <StepperItem title="Terceiro Step">
                <GuideMainRunesForm
                  runes={runes}
                  runesMap={runesMap}
                  secondaryRune={secondaryRune}
                />
              </StepperItem>
              <StepperItem title="Quarto Step">
                <GuideSecondaryRunesForm
                  runes={runes}
                  runesMap={runesMap}
                />
              </StepperItem>
              <StepperItem title="Quinto Step">
                <BonusForm />
              </StepperItem>
              <StepperItem title="Sexto Step">
                <ItemSelectionProvider>
                  <ItemsForm items={items} itemsMap={itemsMap} />
                </ItemSelectionProvider>
              </StepperItem>
              <StepperItem title="Sétimo Step">
                <ThreatsForm championList={championList} />
              </StepperItem>
              <StepperItem title="Oitavo Step">
                {championData && <GuideAbilitiesProgressionForm championData={championData} />}
              </StepperItem>
            </Stepper>
          </StepperProvider>
        </FormProvider>
      }
    </StyledView>
  )
}

// return (
//   <>
//     <StyledView style={style.container}>
//       <ScrollView>
//         <AppInputController
//           control={control}
//           name={"title"}
//           inputOptions={{
//             label: 'Titulo',
//             placeholder: 'Titulo'
//           }}
//         />
//         <FormFieldErrors fieldError={errors.title} />

//         <AppInputController
//           control={control}
//           name={"introduction"}
//           inputOptions={{
//             label: 'Introdução',
//             placeholder: 'Introdução',
//             multiline: true
//           }}
//         />
//         <FormFieldErrors fieldError={errors.introduction} />

//         <AppSelectController
//           control={control}
//           title={'Selecione um campeão'}
//           options={championList.map(({ id, name }) => ({ value: id, label: name }))}
//           placeholder={'Selecione um campeão'}
//           name={'champion'}
//         />
//         <FormFieldErrors fieldError={errors.champion} />

//         <AppSelectController
//           control={control}
//           title={'Selecione um role'}
//           options={ROLE_OPTIONS}
//           placeholder={'Selecione um role'}
//           name={'role'}
//         />
//         <FormFieldErrors fieldError={errors.role} />

//         <AppSelectController
//           control={control}
//           title={'Selecione uma magia'}
//           options={summonerSpells.map(({ id, name }) => ({ value: id, label: name }))}
//           placeholder={'Selecione uma magia'}
//           name={'firstSpell'}
//         />
//         <FormFieldErrors fieldError={errors.firstSpell} />

//         <AppSelectController
//           control={control}
//           title={'Selecione uma segunda magia'}
//           options={summonerSpells.map(({ id, name }) => ({ value: id, label: name }))}
//           placeholder={'Selecione uma segunda magia'}
//           name={'secondSpell'}
//         />
//         <FormFieldErrors fieldError={errors.secondSpell} />

//         <AppInputController
//           control={control}
//           name={'bonusDescription'}
//           inputOptions={{
//             label: 'Descrição dos bonus',
//             placeholder: 'Descreva os bonus',
//             multiline: true
//           }}
//         />
//         <FormFieldErrors fieldError={errors.bonusDescription} />

//         <AppSelectController
//           control={control}
//           title={'Selecione um bonus'}
//           options={slotOne}
//           placeholder={'Selecione um bonus'}
//           name={'bonusSlotOne'}
//         />
//         <FormFieldErrors fieldError={errors.bonusSlotOne} />

//         <AppSelectController
//           control={control}
//           title={'Selecione um segundo bonus'}
//           options={slotTwo}
//           placeholder={'Selecione um segundo bonus'}
//           name={'bonusSlotTwo'}
//         />
//         <FormFieldErrors fieldError={errors.bonusSlotTwo} />

//         <AppSelectController
//           control={control}
//           title={'Selecione um terceiro bonus'}
//           options={slotThree}
//           placeholder={'Selecione um terceiro bonus'}
//           name={'bonusSlotThree'}
//         />
//         <FormFieldErrors fieldError={errors.bonusSlotThree} />

//         <AppInputController
//           control={control}
//           name={"threatsDescription"}
//           inputOptions={{
//             label: 'Ameaças',
//             placeholder: 'Ameaças',
//             multiline: true
//           }}
//         />
//         <FormFieldErrors fieldError={errors.threatsDescription} />

//         {fields.map((field, index) => {
//           return (
//             <View style={style.fieldContainer}>
//               <AppSelectController
//                 key={`${field.id}.threat`}
//                 control={control}
//                 title={'Selecione uma ameaça'}
//                 options={championList.map(({ id, name }) => ({ value: id, label: name }))}
//                 placeholder={'Selecione uma ameaça'}
//                 name={`threats.${index}.threat`}
//               />
//               <FormFieldErrors fieldError={errors.threats?.[index]?.threat} />

//               <AppInputController
//                 key={`${field.id}.description`}
//                 control={control}
//                 name={`threats.${index}.description`}
//                 inputOptions={{
//                   label: 'Descrição da ameaça',
//                   placeholder: 'Descrição da ameaça',
//                   multiline: true
//                 }}
//               />
//               <FormFieldErrors fieldError={errors.threats?.[index]?.description} />

//               <StyledButton onPress={() => { remove(index) }}>Remover ameaça</StyledButton>
//             </View>
//           )
//         })}

//         <StyledButton onPress={appendThreat}>Adicionar ameaça</StyledButton>

//         <AppSelectController
//           control={control}
//           title={'Caminho Principal'}
//           options={buildMainRunesOptions()}
//           placeholder={'Selecione um caminho'}
//           name={`runes.primaryRune`}
//         />
//         <FormFieldErrors fieldError={errors.runes?.primaryRune} />

//         {
//           (!!watchPrimaryRune) && (
//             <>
//               <AppSelectController
//                 control={control}
//                 title={'Primeira Runa'}
//                 options={buildFirstRunesOptions('first')}
//                 placeholder={'Selecione a primeira runa'}
//                 name={`runes.primarySlots.first`}
//               />
//               <FormFieldErrors fieldError={errors.runes?.primarySlots?.first} />

//               <AppSelectController
//                 control={control}
//                 title={'Segunda Runa'}
//                 options={buildFirstRunesOptions('second')}
//                 placeholder={'Selecione a segunda runa'}
//                 name={`runes.primarySlots.second`}
//               />
//               <FormFieldErrors fieldError={errors.runes?.primarySlots?.second} />

//               <AppSelectController
//                 control={control}
//                 title={'Terceira Runa'}
//                 options={buildFirstRunesOptions('third')}
//                 placeholder={'Selecione a terceira runa'}
//                 name={`runes.primarySlots.third`}
//               />
//               <FormFieldErrors fieldError={errors.runes?.primarySlots?.third} />

//               <AppSelectController
//                 control={control}
//                 title={'Quarta Runa'}
//                 options={buildFirstRunesOptions('forth')}
//                 placeholder={'Selecione a quarta runa'}
//                 name={`runes.primarySlots.fourth`}
//               />
//               <FormFieldErrors fieldError={errors.runes?.primarySlots?.fourth} />
//             </>
//           )
//         }

//         <AppSelectController
//           control={control}
//           title={'Caminho Secundario'}
//           options={buildSecondaryRunesOptions()}
//           placeholder={'Selecione um caminho secundario'}
//           name={`runes.secondaryRune`}
//         />
//         <FormFieldErrors fieldError={errors.runes?.secondaryRune} />

//         {
//           (!!watchSecondaryRune) && (
//             <>
//               <AppSelectController
//                 control={control}
//                 title={'Primeira Runa Secondaria'}
//                 options={watchSecondaryRuneSlots && buildSecondaryRunesSlotOptions('first')}
//                 placeholder={'Selecione a primeira runa secundária'}
//                 name={`runes.secondarySlots.first`}
//               />
//               <FormFieldErrors fieldError={errors.runes?.secondarySlots?.first} />


//               <AppSelectController
//                 control={control}
//                 title={'Segunda Runa Secondaria'}
//                 options={watchSecondaryRuneSlots && buildSecondaryRunesSlotOptions('second')}
//                 placeholder={'Selecione a segunda runa secundária'}
//                 name={`runes.secondarySlots.second`}
//               />
//               <FormFieldErrors fieldError={errors.runes?.secondarySlots?.second} />


//               <AppSelectController
//                 control={control}
//                 title={'Terceira Runa Secondaria'}
//                 options={watchSecondaryRuneSlots && buildSecondaryRunesSlotOptions('third')}
//                 placeholder={'Selecione a terceira runa secundária'}
//                 name={`runes.secondarySlots.third`}
//               />
//               <FormFieldErrors fieldError={errors.runes?.secondarySlots?.third} />

//             </>
//           )
//         }

//         {championData && (
//           <List.Item
//             title={'Progressão de Habilidades'}
//             onPress={() => {
//               setShowAbilitiesProgressionModal(true)
//             }}
//             right={(props) => {
//               return <List.Icon {...props} icon='chevron-right' />
//             }}
//           />
//         )}

//         <List.Item
//           title={'Seleção de itens'}
//           onPress={() => {
//             setShowItemsSelectionModal(true)
//           }}
//           right={(props) => {
//             return <List.Icon {...props} icon='chevron-right' />
//           }}
//         />
//       </ScrollView>
//       {championData && <AbilitiesProgressionField visible={showAbilitiesProgressionModal} closeModal={handleCloseAbilitiesProgressionModal} championId={championData.id} abilities={championData.spells} />}
//       <ItemsSelectionModal visible={showItemsSelectionModal} closeModal={handleCloseItemsSelectionModal} />
//     </StyledView>
//   </>
// )
// }

export const style = StyleSheet.create({
  headerButton: {
    marginRight: 16
  },
  container: {
    marginHorizontal: 16,
    flex: 1
  },
  fieldContainer: {
    display: 'flex',
    gap: 8
  }
})