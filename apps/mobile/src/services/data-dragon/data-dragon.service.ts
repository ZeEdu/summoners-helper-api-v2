const DataDragonService = {
  champion: (championName: string, patchVersion: string) => {
    return `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${championName}.png`;
  }
}


export default DataDragonService