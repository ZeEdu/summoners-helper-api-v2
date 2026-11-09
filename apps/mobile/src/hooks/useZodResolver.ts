import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

import { zodIssueDescriptor, zodIssueDescriptorInputNormalizer } from "@org/contracts";
import useI18n from "../contexts/i18n/useI18n";

export default function useZodResolver(schema: any) {
  const i18n = useI18n()

  const resolver = useMemo(() => {
    return zodResolver(schema, {
      error: (issue) => {
        const input = zodIssueDescriptorInputNormalizer(issue)
        const formatedZodIssue = zodIssueDescriptor(input)
        return i18n.t(formatedZodIssue.key, formatedZodIssue.params)
      }
    })
  }, [i18n, schema])

  return resolver
}