import { Image, StyleSheet } from "react-native"
import { MD3Theme, useTheme } from "react-native-paper"
import useDataDragonContext from "../../../../../../../../contexts/data-dragon/useDataDragonContext"

export default function ThreatImage({ championId }: { championId: string }) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const dataDragon = useDataDragonContext()
  const uri = `https://ddragon.leagueoflegends.com/cdn/${dataDragon.getPatch()}/img/champion/${championId}.png`

  return <Image
    style={styles.image}
    source={{ uri }}
  />
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    image: {
      width: 48,
      height: 48,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.primary
    }
  })
}