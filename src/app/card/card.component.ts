import { Component, EventEmitter, Input, Output } from '@angular/core'

import { ITodo } from "../interfaces/todo";
import { Dialog } from "../interfaces/dialog";
import { Project } from "../models/project";

export type TodoInProject = {
  projectId: number,
  todo: ITodo
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.components.scss'],
})
export class CardComponent {
  @Input() public project: Project

  @Output() public updateTodo = new EventEmitter<TodoInProject>()

  onCheckTodo(todo: ITodo) {
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
        type: 'create',
        text: '',
        project_id: this.project.id,
        is_completed: false
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

  @Output() updateTask = new EventEmitter<Dialog>()

  onUpdateTodo(todo: ITodo) {
    this.updateTask.emit({
      type: 'task',
      task: {
        type: 'update',
        project_id: this.project.id,
        text: todo.text,
        id: todo.id,
        is_completed: todo.is_completed
      }
    })
  }
}
