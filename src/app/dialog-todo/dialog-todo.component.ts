import { Observable } from "rxjs";
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

import { ProjectsService } from "../services/projects.service";
import { IProjectOption } from "../interfaces/project-option";
import { CrudActionType } from "../interfaces/dialog";
import { IProjectResponse } from "../interfaces/project-response";
import { ProjectRequest } from "../interfaces/project-request";

@Component({
  selector: 'app-dialog-todo',
  templateUrl: './dialog-todo.component.html',
  styleUrls: ['../styles/form.scss']
})
export class DialogTodoComponent implements OnInit {

  form: FormGroup
  options$: Observable<IProjectOption[]>
  options: IProjectOption[]
  actionType: CrudActionType = 'create'

  public formError: string = ''

  public todo: any

  constructor(
    private ref: MatDialogRef<DialogTodoComponent>,
    private fb: FormBuilder,
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.actionType = this.projectsService.todoAction

    const currentTodo = this.projectsService.getCurrentTodo()

    this.todo = currentTodo

    this.options$ = this.projectsService.options$

    const text = currentTodo ? currentTodo.text : ''
    const projectId = this.projectsService.currentProjectId
      ? this.projectsService.currentProjectId
      : -1
    const isCompleted = currentTodo ? currentTodo.isCompleted : false

    const config = {
      text: new FormControl(text, [Validators.required]),
      project_id: new FormControl(projectId),
      isCompleted: new FormControl(isCompleted),
      deleteCheck: new FormControl(false),
      newProject: new FormControl('', [Validators.required])
    }

    this.form = this.fb.group(config)

    this.options$.subscribe((options) => {
      this.options = options
    })

    this.form.valueChanges.subscribe(values => {
      const initialAction = this.actionType

      if (values.deleteCheck) {
        this.projectsService.todoAction = 'delete'
      } else {
        this.projectsService.todoAction = initialAction
      }

      if (values.project_id === -1) {
        this.projectsService.projectAction = 'create'
      }
    })
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.form.controls[controlName].hasError(errorName)
  }

  isValid(): boolean {
    if (this.form.value.project_id === -1) {
      if (this.options.map(o => o.viewValue).includes(this.form.value.newProject)) {
        this.formError = `Проект с названием "${this.form.value.newProject}" уже существует.`
        return false
      }

      return this.form.valid
    } else {
      this.formError = ''
    }

    return !this.hasError('text', 'required')
  }

  onSubmit() {
    switch (this.projectsService.todoAction) {
      case 'create': {
        // create new project first
        if (this.form.value.project_id === -1) {
          const newProjectTitle = this.form.value.newProject

          const newProjectRequest: ProjectRequest = {
            title: newProjectTitle
          }

          this.projectsService
            .createProject(newProjectRequest)
            .subscribe((res: IProjectResponse) => {
              const newProject = this.projectsService.addProject(res)

              this.projectsService.addTodo(
                newProject.id,
                {
                  text: this.form.value.text,
                  is_completed: false,
                  project_id: res.id
                }
              )
          })
        } else {
          this.projectsService.addTodo(
              this.form.value.project_id,
              {
                text: this.form.value.text,
                is_completed: false,
                project_id: this.form.value.project_id
              }
          )
        }

        this.onClose()
        return
      }

      case 'update': {
        this.projectsService.updateTodo(
          this.form.value.project_id,
          {
            id: this.projectsService.currentTodoId,
            text: this.form.value.text,
            is_completed: this.form.value.isCompleted
          }
        )

        this.onClose()
        return
      }

      case 'delete': {
        this.projectsService.deleteTodo()

        this.onClose()
        return
      }
    }
  }

  onClose() {
    this.projectsService.resetCurrentTodo()
    this.projectsService.resetCurrentProject()
    this.ref.close()
  }

  optionsTrackBy(index: number, option: IProjectOption) {
    return option.value
  }
}
