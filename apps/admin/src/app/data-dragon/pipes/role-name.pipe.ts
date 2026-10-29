import { Pipe, PipeTransform } from "@angular/core";
import { ROLES_LABEL } from "@org/contracts";

function isRoleLabel(value: string): value is keyof typeof ROLES_LABEL {
  return value in ROLES_LABEL;
}

@Pipe({
  name: 'roleName'
})
export class RoleName implements PipeTransform {
  transform(value: string) {
    if (isRoleLabel(value)) {
      return ROLES_LABEL[value]
    }

    return value
  }
}