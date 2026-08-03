import { ChampionMastery } from "../riot-api/interfaces/champion-mastery.interface";

export const getChampionsMasteriesByChampion = (puuid: string, championId: number) => {
  return {
    puuid,
    championId,
    championLevel: 125,
    championPoints: 1340969,
    lastPlayTime: 1781731910000,
    championPointsSinceLastLevel: 369,
    championPointsUntilNextLevel: 10631,
    markRequiredForNextLevel: 2,
    tokensEarned: 36,
    championSeasonMilestone: 4,
    milestoneGrades: ['B+'],
    nextSeasonMilestone: {
      requireGradeCounts: {
        'S-': 2,
      },
      rewardMarks: 1,
      bonus: true,
      totalGamesRequires: 2,
    },
  } as unknown as ChampionMastery
};