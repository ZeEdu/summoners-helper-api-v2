export interface RunesReforgedDataDragon {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: [
    {
      runes: RunesReforgedSlots[];
    },
  ];
}

export interface RunesReforgedSlots {
  id: number;
  key: string;
  icon: string;
  name: string;
  shortDesc: string;
  longDesc: string;
}
