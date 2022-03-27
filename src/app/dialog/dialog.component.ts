import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { ProjectValues } from "../interfaces/project-values";
import { Dialog } from "../interfaces/dialog";
import { ProjectOption } from "../interfaces/project-option";
import { TaskValues } from "../interfaces/task-values";

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
    this.dialogRef.close(null)
  }

  addTask($event: TaskValues) {
    this.dialogRef.close({ task: $event })
  }

  onProjectAction($event: ProjectValues) {
    this.dialogRef.close({ project: $event })
  }
}
