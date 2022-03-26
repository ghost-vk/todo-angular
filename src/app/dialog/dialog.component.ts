import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TodoRequestNew } from "../interfaces/todo-request-new";
import { ProjectRequestNew } from "../interfaces/project-request-new";
import { Dialog } from "../interfaces/dialog";
import { ProjectOption } from "../interfaces/project-option";

export interface DialogWithProjects {
  dialog: Dialog,
  projects: ProjectOption[]
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  constructor(private dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogWithProjects) { }

  onClose() {
    this.dialogRef.close()
  }

  addTask($event: TodoRequestNew) {
    this.dialogRef.close({ task: $event })
  }

  addProject($event: ProjectRequestNew) {
    this.dialogRef.close({ project: $event })
  }
}
