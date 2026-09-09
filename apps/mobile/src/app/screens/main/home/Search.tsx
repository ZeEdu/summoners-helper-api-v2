import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { StyledView } from "../../../../../../../libs/ui/src";
import { HomeStackParamList, RootStackParamList } from "../../../navigation/types";

export type SearchProps = CompositeScreenProps<
  BottomTabScreenProps<HomeStackParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>

export default function Search({ }: SearchProps) {
  return (
    <StyledView>

    </StyledView>
  )

}