import React from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";
import { CreateGuideFormDto } from "../../../../../../../../libs/contracts/src";
import useDataDragonContext from "../../../../../contexts/data-dragon/useDataDragonContext";

export default function GuideFormReview() {
  const useDataDragon = useDataDragonContext();
  const mainFormContext = useFormContext<CreateGuideFormDto>();

  return (
    <View>

    </View>
  )

}