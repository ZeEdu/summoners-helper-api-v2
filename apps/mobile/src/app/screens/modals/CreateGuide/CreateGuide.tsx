import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Dimensions, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

import { StyledView } from "@org/ui";

import { Stepper, StepperItem } from "../../../../components/stepper";
import { StepperProvider } from "../../../../components/stepper/context";
import { usePatchVersion } from "../../../../contexts/patchVersion/usePatchVersion";
import {
  ChampionDataDragon,
  ChampionsDataDragon,
  ChampionsDataDragonDetails,
  ChampionsDataDragonDetailsSolo
} from "../../../../dtos/champion.dto";
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

  const methods = useForm<CreateGuideDto>({ resolver })

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

  const secondaryRune = useWatch({
    control: methods.control,
    name: 'secondaryRune'
  })

  const { height } = Dimensions.get("window")

  useEffect(() => {
    async function getChampionData(championName: string) {
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.6.1/data/pt_BR/champion/${championName}.json`)
      const json = await response.json() as ChampionDataDragon
      setChampionData(json.data[championName])
    }

    if (watchChampion) {
      console.log({ watchChampion });

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
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation
      .setOptions({
        headerRight: () => (
          <Button
            mode="contained"
            style={style.headerButton}
            onPress={methods.handleSubmit(onSubmit)}
          >
            Salvar
          </Button>
        ),
      });
  }, [navigation]);

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