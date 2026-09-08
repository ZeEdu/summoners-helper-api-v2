export type Lvls = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
export type LvlKey = `l${Lvls}`

export const keyFromLvlsBuilder = (level: Lvls): LvlKey => {
  return `l${level}`
}

export const CHAMPION_LEVELS = 18

export const lvlsArrayBuilder = () => {
  return Array.from({ length: CHAMPION_LEVELS }, (_, i) => i + 1) as Array<Lvls>
}