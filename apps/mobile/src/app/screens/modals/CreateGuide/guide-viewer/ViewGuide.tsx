import { StyledView } from '@org/ui';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { IconButton, Menu, Text } from 'react-native-paper';
import { AbilitiesProgressionDto } from '../forms/AbilitiesProgressionForm';
import { BonusDto } from '../forms/BonusForm';
import { GuideIntroductionDto } from '../forms/GuideIntroductionForm';
import { GuideSummonerSpellsDto } from '../forms/GuideSpellsForm';
import { ItemsDto } from '../forms/items-form/ItemsForm';
import { MainRuneDto } from '../forms/MainRunesForm';
import { SecondaryRuneDto } from '../forms/SecondaryRunesForm';
import { ThreatsDto } from '../forms/ThreatsForm';

import { GuideDto } from '@org/contracts';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import CommentSection from '../../../../../components/comment-section/CommentSection';
import { useAuthContext } from '../../../../../contexts/auth/useAuth';
import AbilitiesProgressionContent from './abilities-progression-content/AbilitiesProgressionContent';
import BonusContent from './bonus-content/BonusContent';
import ExpandableCard from './expandable-card/ExpandableCard';
import HeroBanner from './hero-banner/HeroBanner';
import ItemsContent from './items-content/ItemsContent';
import RuneContent from './rune-content/RuneContent';
import SpellContent from './spell-content/SpellContent';
import ThreatsContent from './threats-content/ThreatsContent';

type Props = StaticScreenProps<{
  guide: GuideDto;
}>;

export default function ViewGuide({ route }: Props) {
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

  return (
    <StyledView style={{ height, flex: 1 }}>
      <HeroBanner championId={guide.champion} role={guide.role} />
      <ScrollView>
        <ExpandableCard title="Introdução" titleIcon="text-box-outline">
          <Text variant="bodySmall">{guideIntroduction.introduction}</Text>
        </ExpandableCard>

        <ExpandableCard title="Magias" titleIcon="creation">
          <SpellContent spells={guideSummonerSpells} />
        </ExpandableCard>
        <ExpandableCard title={'Runas'} titleIcon={'hexagram-outline'}>
          <RuneContent rune={mainRune} />
          <RuneContent rune={secondaryRune} />
        </ExpandableCard>
        <ExpandableCard title={'Bonus'} titleIcon={'shield-cross'}>
          <BonusContent bonus={bonus} />
        </ExpandableCard>
        <ExpandableCard
          title={'Itens'}
          titleIcon={'shopping'}
        >
          <ItemsContent items={items} />
        </ExpandableCard>
        <ExpandableCard
          title={'Progressão de Abilidades'}
          titleIcon={'chart-timeline-variant'}
        >
          <AbilitiesProgressionContent
            abilitiesProgression={abilitiesProgression}
            championId={guideIntroduction.champion}
          />
        </ExpandableCard>

        <ExpandableCard
          title={'Ameaças'}
          titleIcon={'alert-outline'}
        >
          <ThreatsContent threats={threats} />
        </ExpandableCard>

        <ExpandableCard
          title={'Comentários'}
          titleIcon='comment-multiple-outline'
          defaultExpanded={true}
        >
          <CommentSection guideId={guide.id} />
        </ExpandableCard>
      </ScrollView>
    </StyledView>
  );
}
