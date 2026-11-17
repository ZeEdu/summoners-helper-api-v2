import { PropsWithChildren } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { MD3Theme, Surface, useTheme } from "react-native-paper";

import Utils from "../utils/utils";

export default function Viewport({ children }: PropsWithChildren) {
  const theme = useTheme()
  const dimensions = useWindowDimensions()

  const width = 992
  const isLargeScreen = dimensions.width > width
  const padding = (dimensions.width - width) / 2

  const style = makeStyles({ theme, padding, width })

  if (Utils.isWeb && isLargeScreen) {
    return (
      <View style={style.view}>
        <Surface elevation={5} style={style.surface}>
          {children}
        </Surface>
      </View>
    )
  }

  return children
}

type StyleProps = {
  theme: MD3Theme,
  padding: number,
  width: number
}

const makeStyles = (props: StyleProps) => {
  return StyleSheet.create({
    view: {
      backgroundColor: props.theme.colors.background,
      flex: 1,
      paddingLeft: props.padding,
      paddingRight: props.padding,
    },
    surface: {
      width: props.width,
      flex: 1
    }
  })
}