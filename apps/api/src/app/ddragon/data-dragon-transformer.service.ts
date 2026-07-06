import { IUserWithPuuid } from '../users/schema/user.schema';
import { ChampionMastery } from '../riot-api/interfaces/champion-mastery.interface';
import { LeagueEntry } from '../riot-api/interfaces/league-entry.interface';
import { Match } from '../riot-api/interfaces/match.interface';
import { Summoner } from '../riot-api/interfaces/summoner.interface';
import { ChampionsLookup } from './lookups/champions.lookup';
import { SummonersSpellLookup } from './lookups/summoner-spell.lookup';
import { RunesLookup } from './lookups/runes-reforged.lookup';
import { ItemsLookup } from './lookups/items.lookup';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IChampionMasteryResponse } from '../riot-api/service/riot-api.service';

@Injectable()
export class DataDragonTransformerService {
  constructor(private i18n: I18nService) {}

  transformChampionsMastery(
    championMastery: ChampionMastery,
  ): IChampionMasteryResponse {
    const champion = ChampionsLookup.getChampionById(
      championMastery.championId,
    );
    return {
      championId: championMastery.championId,
      championLevel: championMastery.championLevel,
      championPoints: championMastery.championPoints,
      lastPlayTime: championMastery.lastPlayTime,
      championPointsSinceLastLevel:
        championMastery.championPointsSinceLastLevel,
      championPointsUntilNextLevel:
        championMastery.championPointsUntilNextLevel,
      champion: champion.name,
    };
  }
  transformRankedStatus(entry: LeagueEntry) {
    return {
      queueType: entry.queueType,
      tier: entry.tier,
      rank: entry.rank,
      leaguePoints: entry.leaguePoints,
      wins: entry.wins,
      losses: entry.losses,
      hotStreak: entry.hotStreak,
    };
  }
  transformMatchInfo(
    match: Match,
    puuid: IUserWithPuuid['puuid'],
  ): {
    gameDuration: number;
    gameMode;
    gameType;
    kills;
    deaths;
    assists;
    win;
    championId;
    championName;
    teamPosition;
    lane;
    role;
    items;
    spells;
    mainPerks;
    secondaryPerks;
  } {
    const gameDuration = match.info.gameDuration;
    const gameMode = match.info.gameMode;
    const gameType = match.info.gameType;

    const userFromParticipants = match.info.participants.find(
      (participants) => participants.puuid === puuid,
    );

    if (!userFromParticipants) {
      throw new Error(
        this.i18n.t('ddragon.errors.matchInfo.participantNotFound', {
          args: { puuid },
        }),
      );
    }

    const win = userFromParticipants.win;
    const championId = userFromParticipants.championId;
    const champion = ChampionsLookup.getChampionById(championId);
    const championName = champion.name;

    const lane = userFromParticipants.lane;
    const teamPosition = userFromParticipants.teamPosition;
    const role = userFromParticipants.role;

    const kills = userFromParticipants.kills;
    const deaths = userFromParticipants.deaths;
    const assists = userFromParticipants.assists;

    const spellsIds = [
      userFromParticipants.summoner1Id,
      userFromParticipants.summoner2Id,
    ];

    const spells = spellsIds.map(SummonersSpellLookup.getSummonerSpellById);

    const mainPerksIds = {
      style: userFromParticipants.perks.styles[0].style,
      slots: userFromParticipants.perks.styles[0].selections.map(
        (selection) => selection.perk,
      ),
    };

    const mainPerks = {
      style: RunesLookup.getMainRuneById(mainPerksIds.style),
      slots: mainPerksIds.slots.map(RunesLookup.getRuneSlotById),
    };

    const secondaryPerksIds = {
      style: userFromParticipants.perks.styles[1].style,
      slots: userFromParticipants.perks.styles[1].selections.map(
        (selection) => selection.perk,
      ),
    };

    const secondaryPerks = {
      style: RunesLookup.getMainRuneById(secondaryPerksIds.style),
      slots: secondaryPerksIds.slots.map(RunesLookup.getRuneSlotById),
    };

    const itemsId = [
      userFromParticipants.item0,
      userFromParticipants.item1,
      userFromParticipants.item2,
      userFromParticipants.item3,
      userFromParticipants.item4,
      userFromParticipants.item5,
      userFromParticipants.item6,
    ];

    const items = itemsId
      .filter((item) => item > 0)
      .map(ItemsLookup.getItemById);

    return {
      gameDuration,
      gameMode,
      gameType,
      kills,
      deaths,
      assists,
      win,
      championId,
      championName,
      teamPosition,
      lane,
      role,
      items,
      spells,
      mainPerks,
      secondaryPerks,
    };
  }
  transformSummoner(summoner: Summoner): {
    profileIconId: Summoner['profileIconId'];
    revisionDate: Summoner['revisionDate'];
    summonerLevel: Summoner['summonerLevel'];
  } {
    return {
      profileIconId: summoner.profileIconId,
      revisionDate: summoner.revisionDate,
      summonerLevel: summoner.summonerLevel,
    };
  }
}
