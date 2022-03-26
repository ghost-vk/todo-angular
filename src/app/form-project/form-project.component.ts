import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ProjectOption } from "../interfaces/project-option";
import {ProjectRequestNew} from "../interfaces/project-request-new";

@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss']
})
export class FormProjectComponent implements OnInit {

  @Input() projects: ProjectOption[] | []

  projectForm: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      title: ''
    })
  }

  @Output() public closeDialog = new EventEmitter()

  onClose() {
    this.closeDialog.emit(true)
  }

  @Output() public newProject = new EventEmitter<ProjectRequestNew>()

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

    this.newProject.emit({
      title: this.projectForm.value.title
    })
  }
}
