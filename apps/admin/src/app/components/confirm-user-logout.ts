import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";

export enum CONFIRM_LOGOUT_ACTIONS {
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL'
}

@Component({
  selector: 'app-confirm-user-logout',
  templateUrl: `./confirm-user-logout.html`,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent
  ]
})
export class ConfirmUserLogout {
  dialogRef = inject(MatDialogRef<ConfirmUserLogout>)

  cancel() {
    this.dialogRef.close(CONFIRM_LOGOUT_ACTIONS.CANCEL)
  }

  confirm() {
    this.dialogRef.close(CONFIRM_LOGOUT_ACTIONS.CONFIRM)
  }
}