import type { MD3Theme } from "react-native-paper";

const stateOpacity = {
  dragged: 0.16,
  pressed: 0.1,
  focused: 0.1,
  hovered: 0.08,
  disabled: 0.38,
  enabled: 1.0,
};

export const MIN_WIDTH = 112;
export const MAX_WIDTH = '100%';

type ColorProps = {
  theme: MD3Theme;
  disabled?: boolean;
};

const getTitleColor = ({ theme }: ColorProps) => {
  return theme.colors.onSurface;
};

const getIconColor = ({ theme }: ColorProps) => {
  return theme.colors.onSurfaceVariant;
};

export const getMenuItemColor = ({ theme, disabled }: ColorProps) => {
  const contentOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;

  return {
    titleColor: getTitleColor({ theme, disabled }),
    iconColor: getIconColor({ theme, disabled }),
    contentOpacity,
  };
};