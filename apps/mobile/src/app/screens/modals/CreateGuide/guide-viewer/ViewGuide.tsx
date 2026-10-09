import { StyledView } from '@org/ui';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { IconButton, List, Menu, useTheme } from 'react-native-paper';
import { AbilitiesProgressionDto } from '../forms/AbilitiesProgressionForm';
import { BonusDto } from '../forms/BonusForm';
import { GuideIntroductionDto } from '../forms/GuideIntroductionForm';
import { GuideSummonerSpellsDto } from '../forms/GuideSpellsForm';
import { ItemsDto } from '../forms/items-form/ItemsForm';
import { MainRuneDto } from '../forms/MainRunesForm';
import { SecondaryRuneDto } from '../forms/SecondaryRunesForm';
import { ThreatsDto } from '../forms/ThreatsForm';
import AbilitiesProgressionSection from './AbilitiesProgressionSection';
import BonusSection from './BonusSection';
import ItemsSection from './ItemsSection';
import RunesSection from './RunesSection';
import SpellsSection from './SpellsSection';
import ThreatsSection from './ThreatsSection';

import { GuideDto } from '@org/contracts';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import CommentSection from '../../../../../components/comment-section/CommentSection';
import { useAuthContext } from '../../../../../contexts/auth/useAuth';
import ExpandableCard from './expandable-card/ExpandableCard';
import HeroBanner from './hero-banner/HeroBanner';

type Props = StaticScreenProps<{
  guide: GuideDto;
}>;

export default function ViewGuide({ route }: Props) {
  const theme = useTheme();

  const { user } = useAuthContext();
  const { guide } = route.params;

  const [showMenu, setShowMenu] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(true);
  const navigation = useNavigation();

  const openMenu = () => {
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const guideIntroduction: GuideIntroductionDto = {
    title: guide.title,
    introduction: guide.introduction,
    champion: guide.champion,
    role: guide.role,
  };

  const guideSummonerSpells: GuideSummonerSpellsDto = {
    firstSpell: guide.firstSpell,
    secondSpell: guide.secondSpell,
    spellsDescription: guide.spellsDescription,
  };

  const mainRune: MainRuneDto = {
    primaryRune: guide.primaryRune,
    primarySlots: {
      ...guide.primarySlots,
      fourth: guide.primarySlots.fourth!,
    },
    primaryRuneDescription: guide.primaryRuneDescription,
  };

  const secondaryRune: SecondaryRuneDto = {
    secondaryRune: guide.secondaryRune,
    secondarySlots: guide.secondarySlots,
    secondaryRuneDescription: guide.secondaryRuneDescription,
  };

  const bonus: BonusDto = {
    bonusDescription: guide.bonusDescription,
    bonusSlotOne: guide.bonusSlotOne,
    bonusSlotTwo: guide.bonusSlotTwo,
    bonusSlotThree: guide.bonusSlotThree,
  };

  const items: ItemsDto = {
    items: guide.items,
    itemsDescription: guide.itemsDescription,
  };

  const abilitiesProgression: AbilitiesProgressionDto = {
    abilitiesProgression: guide.abilitiesProgression,
    abilitiesProgressionDescription: guide.abilitiesProgressionDescription,
  };

  const threats: ThreatsDto = {
    threats: guide.threats,
    threatsDescription: guide.threatsDescription,
  };

  const { height } = Dimensions.get('window');

  const isGuideCreator = guide.createdBy.toString() === user?.id;

  const menuItems: { onPress: () => void; title: string; id: string }[] = [];

  if (!isGuideCreator) {
    menuItems.push({
      onPress: () => {
        closeMenu();
        navigation.navigate('ReportGuide', { guide });
      },
      title: 'Denunciar guia',
      id: 'report-guide',
    });
  }

  useEffect(() => {
    const navigationOptions: any = {
      title: guideIntroduction.title,
    };

    if (menuItems.length > 0) {
      navigationOptions.headerRight = () => (
        <Menu
          visible={showMenu}
          onDismiss={closeMenu}
          anchor={
            <IconButton onPress={openMenu} icon={'dots-vertical'} size={24} />
          }
        >
          {menuItems.map(({ id, ...props }) => (
            <Menu.Item {...props} key={id} />
          ))}
        </Menu>
      );
    }

    navigation.setOptions(navigationOptions);
  }, [navigation, showMenu]);

  const expandCard = () => {
    console.log(`expandCard`);
  };

  return (
    <StyledView style={{ height, flex: 1 }}>
      <HeroBanner championId={guide.champion} role={guide.role} />
      <ScrollView>
        <ExpandableCard
          title="Introdução"
          content={guideIntroduction.introduction}
        />
        <List.Accordion title={'Magias'} id={'2'}>
          <SpellsSection
            guideSummonerSpells={guideSummonerSpells}
            hideTitle={true}
          />
        </List.Accordion>
        <List.Accordion title={'Runas'} id={'3'}>
          <RunesSection
            mainRune={mainRune}
            secondaryRune={secondaryRune}
            hideTitle={true}
          />
        </List.Accordion>
        <List.Accordion title={'Bonus'} id={'4'}>
          <BonusSection bonus={bonus} hideTitle={true} />
        </List.Accordion>
        <List.Accordion title={'Items'} id={'5'}>
          <ItemsSection items={items} hideTitle={true} />
        </List.Accordion>
        <List.Accordion title={'Progressão de abilidades'} id={'6'}>
          <AbilitiesProgressionSection
            abilitiesProgression={abilitiesProgression}
            champion={guideIntroduction.champion}
            hideTitle={true}
          />
        </List.Accordion>
        <List.Accordion title={'Ameaças'} id={'7'}>
          <ThreatsSection threats={threats} hideTitle={true} />
        </List.Accordion>
        <List.Accordion title={'Seção de Comentários'} id={'8'}>
          <CommentSection guideId={guide.id} />
        </List.Accordion>
      </ScrollView>
    </StyledView>
  );
}