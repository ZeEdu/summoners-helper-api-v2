import { ChampionMastery } from "../riot-api/interfaces/champion-mastery.interface";

export const getChampionsMasteriesByTop = (userPuuid: string) => {
  return [
    {
      puuid: userPuuid,
      championId: 107,
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
    },
    {
      puuid: userPuuid,
      championId: 11,
      championLevel: 115,
      championPoints: 1241055,
      lastPlayTime: 1781419272000,
      championPointsSinceLastLevel: 10455,
      championPointsUntilNextLevel: 545,
      markRequiredForNextLevel: 2,
      tokensEarned: 46,
      championSeasonMilestone: 1,
      milestoneGrades: [],
      nextSeasonMilestone: {
        requireGradeCounts: {
          'A-': 1,
        },
        rewardMarks: 1,
        bonus: false,
        totalGamesRequires: 1,
      },
    },
    {
      puuid: userPuuid,
      championId: 157,
      championLevel: 76,
      championPoints: 802362,
      lastPlayTime: 1781774368000,
      championPointsSinceLastLevel: 762,
      championPointsUntilNextLevel: 10238,
      markRequiredForNextLevel: 2,
      tokensEarned: 2,
      championSeasonMilestone: 0,
      milestoneGrades: ['B+'],
      nextSeasonMilestone: {
        requireGradeCounts: {
          'A-': 1,
        },
        rewardMarks: 1,
        bonus: false,
        totalGamesRequires: 1,
      },
    },
    {
      puuid: userPuuid,
      championId: 121,
      championLevel: 39,
      championPoints: 421294,
      lastPlayTime: 1780252853000,
      championPointsSinceLastLevel: 26694,
      championPointsUntilNextLevel: -15694,
      markRequiredForNextLevel: 2,
      tokensEarned: 1,
      championSeasonMilestone: 0,
      nextSeasonMilestone: {
        requireGradeCounts: {
          'A-': 1,
        },
        rewardMarks: 1,
        bonus: false,
        totalGamesRequires: 1,
      },
    },
    {
      puuid: userPuuid,
      championId: 238,
      championLevel: 38,
      championPoints: 387782,
      lastPlayTime: 1780263665000,
      championPointsSinceLastLevel: 4182,
      championPointsUntilNextLevel: 6818,
      markRequiredForNextLevel: 2,
      tokensEarned: 14,
      championSeasonMilestone: 0,
      nextSeasonMilestone: {
        requireGradeCounts: {
          'A-': 1,
        },
        rewardMarks: 1,
        bonus: false,
        totalGamesRequires: 1,
      },
    },
  ] as unknown as ChampionMastery[]
};