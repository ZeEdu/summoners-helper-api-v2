import type { ReactNode } from 'react';
import type { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface DropdownItemProps {
  /**
   * Conteúdo principal do item.
   */
  title: ReactNode;

  /**
   * Elemento renderizado à esquerda.
   *
   * Ex:
   * <Icon source="check" />
   * <ChampionAvatar />
   */
  leading?: ReactNode;

  /**
   * Elemento renderizado à direita.
   *
   * Ex:
   * <Icon source="chevron-right" />
   * <Badge />
   */
  trailing?: ReactNode;

  /**
   * Desabilita interação.
   */
  disabled?: boolean;

  /**
   * Exibe o estado de seleção.
   */
  selected?: boolean;

  /**
   * Diminui a altura do item.
   */
  dense?: boolean;

  /**
   * Fecha automaticamente o menu ao clicar.
   *
   * @default true
   */
  closeOnPress?: boolean;

  onPress?: (event: GestureResponderEvent) => void;

  containerStyle?: StyleProp<ViewStyle>;

  contentStyle?: StyleProp<ViewStyle>;

  titleStyle?: StyleProp<TextStyle>;

  testID?: string;
}