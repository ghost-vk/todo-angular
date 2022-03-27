import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ProjectOption } from "../interfaces/project-option";
import { TaskValues } from "../interfaces/task-values";

type ControlsConfig = {
  text: string,
  project_id: number,
  deleteCheck?: boolean
}

@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.scss']
})
export class FormTaskComponent implements OnInit {

  @Input() projects: ProjectOption[] | []

  @Input() data: TaskValues | null

  taskForm: FormGroup

  isDeleteBoxVisible: boolean

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (!this.data) {
      this.data = {
        type: 'create',
        text: '',
        project_id: this.projects[0].value,
        is_completed: false
      }

      this.isDeleteBoxVisible = false
    }

    const config:ControlsConfig = {
      text: this.data.text,
      project_id: this.data.project_id,
    }

    if (this.data?.type === 'update') {
      config.deleteCheck = false

      this.isDeleteBoxVisible = true
    }

    this.taskForm = this.fb.group(config)

    this.taskForm.valueChanges.subscribe(values => this.validate(values))
  }

  @Output() closeDialog = new EventEmitter<null>()

  onClose() {
    this.closeDialog.emit(null)
  }

  validate(values: TaskValues): boolean {
    if (!values.text || values.text.length < 3) return false

    return this.projects.map(p => p.value).includes(values.project_id);
  }

  @Output() newTask = new EventEmitter<TaskValues>()

  onSubmit() {
    if (!this.validate(this.taskForm.value)) return

    const actionType = this.taskForm.value.deleteCheck
      ? 'delete'
      : this.data?.type || 'create'

    const isCompleted = this.data?.is_completed || false

    const taskValues:TaskValues = {
      type: actionType,
      text: this.taskForm.value.text,
      project_id: this.taskForm.value.project_id,
      is_completed: isCompleted,
    }

    if (this.data?.id) {
      taskValues.id = this.data.id
    }

    this.newTask.emit(taskValues)
  }
}
