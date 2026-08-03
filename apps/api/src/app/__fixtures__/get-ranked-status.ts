import { LeagueEntry } from "../riot-api/interfaces/league-entry.interface";

export const getRankedStatus = (userPuuid: string) => {
  return [
    {
      queueType: 'RANKED_FLEX_SR',
      tier: 'DIAMOND',
      rank: 'IV',
      puuid: userPuuid,
      leaguePoints: 20,
      wins: 15,
      losses: 19,
      veteran: false,
      inactive: false,
      freshBlood: false,
      hotStreak: false,
    },
    {
      queueType: 'RANKED_SOLO_5x5',
      tier: 'CHALLENGER',
      rank: 'I',
      puuid: userPuuid,
      leaguePoints: 2343,
      wins: 317,
      losses: 232,
      veteran: true,
      inactive: false,
      freshBlood: false,
      hotStreak: false,
    },
  ] as unknown as LeagueEntry[]
};
