import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { TodoRequestNew } from "../interfaces/todo-request-new";
import { ProjectOption } from "../interfaces/project-option";
import { TaskValues } from "../interfaces/task-values";

type TaskFormErrors = {
  text: string,
  project: string
}
@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.scss']
})
export class FormTaskComponent implements OnInit {

  @Input() projects: ProjectOption[] | []

  @Input() data: TaskValues | null

  public errors: TaskFormErrors

  taskForm: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (!this.data) {
      this.data = {
        value: '',
        project: this.projects[0].value
      }
    }

    this.taskForm = this.fb.group({
      text: this.data.value  || '',
      project_id: this.data.project || this.projects[0].value
    })

    this.taskForm.valueChanges.subscribe(values => {
      this.validate(values)
    })

    this.errors = {
      project: '',
      text: ''
    }
  }

  @Output() closeDialog = new EventEmitter()

  onClose() {
    this.closeDialog.emit(true)
  }

  validate(values: TodoRequestNew): boolean {
    if (!values.text || values.text.length < 3) {
      this.errors.text = 'Введите задачу'
    } else {
      this.errors.text = ''
    }

    if (!this.projects.map(p => p.value).includes(values.project_id)) {
      this.errors.project = 'Выберите существующий проект'
    } else {
      this.errors.project = ''
    }

    const isError = !(this.errors.text || this.errors.project)

    return isError
  }

  @Output() newTask = new EventEmitter<TodoRequestNew>()

  onSubmit() {
    if (!this.validate(this.taskForm.value)) {
      return
    }

    const task:TodoRequestNew = {
      text: this.taskForm.value.text,
      project_id: this.taskForm.value.project_id,
      is_completed: false
    }

    this.newTask.emit(task)
  }
}
