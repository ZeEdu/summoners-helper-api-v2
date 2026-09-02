import { Avatar, List, Text } from "react-native-paper";

import useDataDragonContext from "../../../../../contexts/data-dragon/useDataDragonContext";
import { MainRuneDto } from "../forms/MainRunesForm";
import { SecondaryRuneDto } from "../forms/SecondaryRunesForm";

export default function RunesSection({ mainRune, secondaryRune }: { mainRune: MainRuneDto, secondaryRune: SecondaryRuneDto }) {
  return (
    <List.Section>
      <List.Subheader>
        <Text variant='headlineSmall'>
          Runas
        </Text>
      </List.Subheader>

      <RuneItem title='Caminho principal' runeId={mainRune.primaryRune} />
      <RuneSlotItem title='Primeira Runa' runeSlotId={mainRune.primarySlots.first} />
      <RuneSlotItem title='Segunda Runa' runeSlotId={mainRune.primarySlots.second} />
      <RuneSlotItem title='Terceira Runa' runeSlotId={mainRune.primarySlots.third} />
      <RuneSlotItem title='Quarta Runa' runeSlotId={mainRune.primarySlots.fourth} />
      <List.Item title={'Descrição'} description={mainRune.primaryRuneDescription} />

      <RuneItem title='Caminho Secondário' runeId={secondaryRune.secondaryRune} />
      <RuneSlotItem title='Primeira Runa' runeSlotId={secondaryRune.secondarySlots.first} />
      <RuneSlotItem title='Segunda Runa' runeSlotId={secondaryRune.secondarySlots.second} />
      <RuneSlotItem title='Terceira Runa' runeSlotId={secondaryRune.secondarySlots.third} />
      <List.Item title={'Descrição'} description={secondaryRune.secondaryRuneDescription} />
    </List.Section>
  )
}

function RuneSlotItem({ runeSlotId, title }: {
  runeSlotId: string
  title: string
}) {
  const useDataDragon = useDataDragonContext();
  const runeSlot = useDataDragon.getRuneSlots(runeSlotId)

  const description = runeSlot.name
  const uri = `https://ddragon.leagueoflegends.com/cdn/img/${runeSlot.icon}`

  return (
    <List.Item
      title={title}
      description={description}
      right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={48} />}
    />
  )
}

function RuneItem({ runeId, title }: {
  runeId: string
  title: string
}) {
  const useDataDragon = useDataDragonContext();

  const rune = useDataDragon.getRune(runeId)

  const description = rune.name
  const uri = `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`

  return (
    <List.Item
      title={title}
      description={description}
      right={() => <Avatar.Image style={{ backgroundColor: 'transparent' }} source={{ uri }} size={48} />}
    />
  )
}