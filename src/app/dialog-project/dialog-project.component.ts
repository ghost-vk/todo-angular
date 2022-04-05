import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

import { ProjectsService } from "../services/projects.service"
import { CrudActionType } from "../interfaces/dialog";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { IProjectResponse } from "../interfaces/project-response";
import { Observable } from "rxjs";
import { IProjectOption } from "../interfaces/project-option";

@Component({
  selector: 'app-dialog-project',
  templateUrl: './dialog-project.component.html',
  styleUrls: ['../styles/form.scss']
})
export class DialogProjectComponent implements OnInit {

  actionType: CrudActionType = 'create'
  form: FormGroup
  options: IProjectOption[]
  public formError: string = ''

  constructor(
    private ref: MatDialogRef<DialogProjectComponent>,
    private projectsService: ProjectsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.actionType = this.projectsService.projectAction

    const currentProject = this.projectsService.getCurrentProject()

    const title = currentProject ? currentProject.title : ''

    const config = {
      title: new FormControl(title, [Validators.required]),
      deleteCheck: new FormControl(false)
    }

    this.form = this.fb.group(config)

    this.projectsService.options$.subscribe((options) => this.options = options)


    this.form.valueChanges.subscribe(values => {
      const initialAction = this.actionType

      if (values.deleteCheck) {
        this.projectsService.projectAction = 'delete'
      } else {
        this.projectsService.todoAction = initialAction
      }
    })
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.form.controls[controlName].hasError(errorName)
  }

  isValid(): boolean {
    if (
      this.actionType === 'create'
      && this.options.map(o => o.viewValue).includes(this.form.value.title)
    ) {
      this.formError = `Проект с названием "${this.form.value.title}" уже существует.`
      return false
    } else {
      this.formError = ''
    }

    return !this.hasError('title', 'required')
  }

  onClose() {
    this.projectsService.resetCurrentProject()
    this.ref.close()
  }

  onSubmit() {
    switch (this.projectsService.projectAction) {
      case "create": {
        this.projectsService
          .createProject({ title: this.form.value.title })
          .subscribe((res: IProjectResponse) => {
            this.projectsService.addProject(res)
          })

        this.onClose()
        return
      }

      case "update": {
        this.projectsService
          .editProject(
            this.projectsService.currentProjectId,
            { title: this.form.value.title}
          )

        this.onClose()
        return
      }

      case 'delete': {
        this.projectsService
          .deleteProject(this.projectsService.currentProjectId)

        this.onClose()
        return
      }

      default : {
        this.onClose()
        return
      }
    }
  }
}
