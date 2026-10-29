export enum RIOT_SERVERS {
  br1 = 'br1',
  eun1 = 'eun1',
  euw1 = 'euw1',
  jp1 = 'jp1',
  kr = 'kr',
  la1 = 'la1',
  la2 = 'la2',
  me1 = 'me1',
  na1 = 'na1',
  oc1 = 'oc1',
  ru = 'ru',
  sg2 = 'sg2',
  tr1 = 'tr1',
  tw2 = 'tw2',
  vn2 = 'vn2',
}

export enum RIOT_SERVERS_LABEL {
  br1 = 'Brasil',
  eun1 = 'Europa Nórdica e Oriental',
  euw1 = 'Europa Ocidental',
  jp1 = 'Japão',
  kr = 'Coreia',
  la1 = 'América Latina Norte',
  la2 = 'América Latina Sul',
  me1 = 'Oriente Médio',
  na1 = 'América do Norte',
  oc1 = 'Oceania',
  ru = 'Rússia',
  sg2 = 'Singapura, Malásia e Outros (SEA)',
  tr1 = 'Turquia',
  tw2 = 'Taiwan',
  vn2 = 'Vietnã',
}

function isRiotServer(value: string): value is RIOT_SERVERS {
  return !!RIOT_SERVERS[value as RIOT_SERVERS]
}

export function getServer(value: string) {
  if (isRiotServer(value)) {
    return RIOT_SERVERS[value]
  }
  return ''
}

function isRiotServerLabel(value: string): value is keyof typeof RIOT_SERVERS_LABEL {
  return Object.hasOwn(RIOT_SERVERS_LABEL, value)
}

export function getServerLabel(value: string) {
  if (isRiotServerLabel(value)) {
    return RIOT_SERVERS_LABEL[value]
  }

  return ''
}