import { Component, EventEmitter, Input, Output } from '@angular/core'

import { Todo } from "../interfaces/todo";
import { Dialog } from "../interfaces/dialog";
import { Project } from "../models/project";

export type TodoInProject = {
  projectId: number,
  todo: Todo
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.components.scss'],
})
export class CardComponent {
  @Input() public project: Project

  @Output() public updateTodo = new EventEmitter<TodoInProject>()

  onCheckTodo(todo: Todo) {
    this.updateTodo.emit({
      projectId: this.project.id,
      todo
    })
  }

  @Output() deleteProject = new EventEmitter<number>()

  onDeleteProject(id: number) {
    this.deleteProject.emit(id)
  }

  @Output() addTask = new EventEmitter<Dialog>()

  onAddTask() {
    this.addTask.emit({
      type: 'task',
      task: {
        value: '',
        project: this.project.id
      }
    })
  }

  @Output() editProject = new EventEmitter<Dialog>()

  onEditProject() {
    this.editProject.emit({
      type: 'project',
      project: {
        title: this.project.title,
        type: 'update',
        id: this.project.id
      }
    })
  }
}
