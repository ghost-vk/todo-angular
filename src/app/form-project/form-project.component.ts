import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ProjectOption } from "../interfaces/project-option";
import { ProjectValues } from "../interfaces/project-values";

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss']
})
export class FormProjectComponent implements OnInit {

  @Input() projects: ProjectOption[] | []

  @Input() data: ProjectValues | null

  projectForm: FormGroup

  formTitle: string

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formTitle = this.data && this.data?.type === 'update'
      ? 'Редактировать проект'
      : 'Новый проект'

    this.projectForm = this.fb.group({
      title: this.data?.title || ''
    })
  }

  @Output() public closeDialog = new EventEmitter()

  onClose() {
    this.closeDialog.emit(true)
  }

  @Output() public projectAction = new EventEmitter<ProjectValues>()

  onSubmit() {
    if (!this.projectForm.value.title) return

    if (!this.projects) return

    if (
      !(this.projects.length > 0)
      || this.projects
        .map(p => p.viewValue)
        .includes(this.projectForm.value.title)
    ) {
      // todo Error: project already exist
    }

    const toEmit:ProjectValues = {
      title: this.projectForm.value.title,
      type: this.data?.type ? this.data.type : 'create'
    }

    if (this.data?.id) {
      toEmit.id = this.data?.id
    }

    this.projectAction.emit(toEmit)
  }
}
