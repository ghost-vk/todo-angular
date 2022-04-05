import { Component, EventEmitter, Input, Output } from '@angular/core'

import { ProjectsService } from "../services/projects.service";
import { Todo } from '../models/todo'
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

  constructor(private projectsService: ProjectsService) { }

  @Input() public project: Project

  onCheckTodo(todo: ITodo) {
    this.projectsService.updateTodo(this.project.id, todo)
  }

  onDeleteProject() {
    this.projectsService.deleteProject(this.project.id)
  }

  @Output() addTask = new EventEmitter<Dialog>()

  onAddTask() {
    this.projectsService.todoAction = 'create'
    this.projectsService.currentProjectId = this.project.id
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
    this.projectsService.currentProjectId = this.project.id
    this.projectsService.projectAction = 'update'
    this.editProject.emit({
      type: 'project',
      project: {
        title: this.project.title,
        type: 'update',
        id: this.project.id
      }
    })
  }

  @Output() updateTodo = new EventEmitter()

  onUpdateTodo(todoId: number) {
    this.projectsService.currentProjectId = this.project.id
    this.projectsService.currentTodoId = todoId
    this.projectsService.todoAction = 'update'

    this.updateTodo.emit()
  }

  taskTrackBy(index: number, task: Todo) {
    return task.id
  }
}
