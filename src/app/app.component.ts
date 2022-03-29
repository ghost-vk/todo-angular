import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "./dialog/dialog.component";
import { TodoInProject } from "./card/card.component";
import { Project } from './models/project'
import { plainToClass } from "class-transformer";
import { ITodo } from "./interfaces/todo";
import { ProjectOption } from "./interfaces/project-option";
import { Dialog } from "./interfaces/dialog";
import { DialogResult } from "./interfaces/dialog-result";
import { TodoResponse } from "./interfaces/todo-response";
import { ProjectCollectionService } from "./services/project-collection.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public projects$: Observable<Project[]>
  public projectOptions: ProjectOption[]
  private dialogRef: any

  constructor(
    HttpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private projectCollectionService: ProjectCollectionService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.projects$ = this.projectCollectionService.projects$
    this.projectCollectionService.fetchProjects()
  }

  // mapProjectOptions() {
  //   this.projectOptions = this.projects.map(project => project.getOption())
  // }

  // openDialog(dialog: Dialog) {
  //   this.dialogRef = this.dialog.open(DialogComponent, {
  //     data: {
  //       dialog,
  //       projects: this.projectOptions
  //     }
  //   })
  //
  //   this.dialogRef.afterClosed().subscribe((data: DialogResult | null) => {
  //     if (!data) return
  //
  //     if (data.task) {
  //       this.projects.forEach(project => {
  //         if (project.id === data.task?.project_id) {
  //
  //           if (data.task.type === 'create') {
  //             this.projectService.addTodo(data.task)
  //               .subscribe(task => {
  //                 const projectTask:Todo = {
  //                   text: task.text,
  //                   id: task.id,
  //                   is_completed: task.is_completed || false
  //                 }
  //
  //                 project.todos.push(projectTask)
  //               })
  //           } else if (data.task.type === 'update') {
  //             const todoId = Number(data.task.id)
  //
  //             const todo: Todo = {
  //               text: data.task.text,
  //               id: todoId,
  //               is_completed: data.task.is_completed
  //             }
  //
  //             this.projectService.updateTodo(data.task.project_id, todo)
  //               .subscribe((updatedTodo: TodoResponse) => {
  //                 const res:Todo = {
  //                   text: updatedTodo.text,
  //                   id: updatedTodo.id,
  //                   is_completed: updatedTodo.is_completed || false
  //                 }
  //
  //                 project.updateTodo(res)
  //               })
  //           } else if (data.task.type ==='delete') {
  //             const todoId = Number(data.task.id)
  //
  //             this.projectService.deleteTodo(data.task.project_id, todoId)
  //               .subscribe((isDeleted: boolean) => {
  //                 if (isDeleted) project.deleteTodo(todoId)
  //               })
  //           }
  //
  //         }
  //       })
  //     } else if (data.project) {
  //       if (data.project.type === 'create') {
  //         this.projectService.newProject(data.project)
  //           .subscribe((newProjectPlain: Project) => {
  //             const newProject = plainToClass(Project, newProjectPlain)
  //             this.projects.push(newProject)
  //             this.mapProjectOptions()
  //           })
  //       } else if (data.project.type === 'update') {
  //         const id = Number(data.project.id)
  //
  //         if (!(id > 0)) return // todo error
  //
  //         this.projectService.editProject(id, data.project.title)
  //           .subscribe((updated: Project) => {
  //             const project = this.projects.find(p => p.id === updated.id)
  //
  //             if (project) project.title = updated.title
  //           })
  //       }
  //     }
  //   })
  // }

  // onCheckTodo(data: TodoInProject) {
  //   const project = this.projects.find(p => p.id === data.projectId)
  //
  //   if (project) {
  //     this.projectService.updateTodo(project.id, data.todo)
  //       .subscribe(task => {
  //         const res:Todo = {
  //           text: task.text,
  //           id: task.id,
  //           is_completed: task.is_completed || false
  //         }
  //
  //         project.updateTodo(res)
  //       })
  //   }
  // }

  // deleteProject(id: number) {
  //   const project = this.projects.find(p => p.id === id)
  //
  //   if (project) {
  //     this.projectService.deleteProject(project.id)
  //       .subscribe((isDeleted: boolean) => {
  //         if (isDeleted) {
  //           this.projects = this.projects.filter(p => p.id !== id)
  //           this.mapProjectOptions()
  //         }
  //       })
  //   }
  // }
}
