import { CHAMPIONS } from '../../constants/champions.constant';
import { ChampionsDataDragonDetails } from '../dto/champion.dto';
import { ItemsDataDragon } from '../dto/item.dto';
import { SummonerSpellDataDragon } from '../dto/spell.dto';
import { SUMMONER_SPELL_MAP_ID } from '../../constants/summoner-spell.constant';
import {
  MAIN_RUNES,
  RUNE_SLOTS,
} from '../../constants/runes-reforged.constant';
import { IUserWithPuuid } from '../../users/schema/user.schema';
import { ChampionMastery } from '../../riot-api/interfaces/champion-mastery.interface';
import { LeagueEntry } from '../../riot-api/interfaces/league-entry.interface';
import { Match } from '../../riot-api/interfaces/match.interface';
import { Summoner } from '../../riot-api/interfaces/summoner.interface';

export class DataDragonService {
  static transformChampionsMastery(championMastery: ChampionMastery) {
    return {
      championId: championMastery.championId,
      championLevel: championMastery.championLevel,
      championPoints: championMastery.championPoints,
      lastPlayTime: championMastery.lastPlayTime,
      championPointsSinceLastLevel:
        championMastery.championPointsSinceLastLevel,
      championPointsUntilNextLevel:
        championMastery.championPointsUntilNextLevel,
      champion: DataDragonService.getChampionName(championMastery.championId),
    };
  }

  static transformRankedStatus(entry: LeagueEntry) {
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

  static transformMatchInfo(match: Match, puuid: IUserWithPuuid['puuid']) {
    const gameDuration = match.info.gameDuration;
    const gameMode = match.info.gameMode;
    const gameType = match.info.gameType;

    const userFromParticipants = match.info.participants.find(
      (participants) => participants.puuid === puuid,
    );

    const win = userFromParticipants.win;
    const championId = userFromParticipants.championId;
    const championName = DataDragonService.getChampionName(
      userFromParticipants.championId,
    );
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

    const spells = spellsIds.map(this.getSummonerSpell);

    const mainPerksIds = {
      style: userFromParticipants.perks.styles[0].style,
      slots: userFromParticipants.perks.styles[0].selections.map(
        (selection) => selection.perk,
      ),
    };

    const mainPerks = {
      style: this.getRune(mainPerksIds.style),
      slots: mainPerksIds.slots.map(this.getRuneSlot),
    };

    const secondaryPerksIds = {
      style: userFromParticipants.perks.styles[1].style,
      slots: userFromParticipants.perks.styles[1].selections.map(
        (selection) => selection.perk,
      ),
    };

    const secondaryPerks = {
      style: this.getRune(secondaryPerksIds.style),
      slots: secondaryPerksIds.slots.map(this.getRuneSlot),
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

    const items = itemsId.filter((item) => item > 0).map(this.getItem);

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

  static transformSummoner(summoner: Summoner) {
    return {
      profileIconId: summoner.profileIconId,
      revisionDate: summoner.revisionDate,
      summonerLevel: summoner.summonerLevel,
    };
  }

  private static loadChampionJSON(championName: string) {
    const championJSON: ChampionsDataDragonDetails = require(
      `../../../assets/ddragon/champion/${championName}.json`,
    );
    return championJSON['data'][championName];
  }

  static async getChampion(
    championId: number,
  ): Promise<ChampionsDataDragonDetails> {
    const championName = CHAMPIONS.getChampionName(championId);
    return this.loadChampionJSON(championName);
  }

  static getChampionName(championId: number): string {
    return CHAMPIONS.getChampionName(championId);
  }

  static getItem(itemId: number) {
    const itemsJSON: ItemsDataDragon = require(
      `../../../assets/ddragon/item.json`,
    );

    return itemsJSON['data'][itemId];
  }

  static getRune(runeId: number) {
    return MAIN_RUNES[runeId];
  }

  static getRuneSlot(runeSlotId: number) {
    return RUNE_SLOTS[runeSlotId];
  }

  static getSummonerSpell(spellId: number) {
    const summonerSpellsJSON: SummonerSpellDataDragon = require(
      `../../../assets/ddragon/summoner.json`,
    );

    const spellFromMap = SUMMONER_SPELL_MAP_ID[spellId];
    return summonerSpellsJSON.data[spellFromMap];
  }
}
