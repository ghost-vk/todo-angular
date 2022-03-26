import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "./dialog/dialog.component";
import { TodoInProject } from "./card/card.component";
import { Project } from './models/project'
import { plainToClass } from "class-transformer";
import { ProjectService } from "./services/project.service";
import { TodoRequestNew } from "./interfaces/todo-request-new";
import { Todo } from "./interfaces/todo";
import { ProjectOption } from "./interfaces/project-option";
import { ProjectRequestNew } from "./interfaces/project-request-new";
import { Dialog } from "./interfaces/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private httpClient: HttpClient
  public projects: Project[]
  public projectOptions: ProjectOption[]
  private dialogRef: any

  constructor(
    HttpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private projectService: ProjectService,
    public dialog: MatDialog
  ) {
    this.httpClient = HttpClient
  }

  ngOnInit() {
    this.projectService.fetchProjects().subscribe(projects => {
      this.projects = plainToClass(Project, projects)
      this.mapProjectOptions()
    })
  }

  mapProjectOptions() {
    this.projectOptions = this.projects.map(project => project.getOption())
  }

  openDialog(dialog: Dialog) {
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: {
        dialog,
        projects: this.projectOptions
      }
    })

    this.dialogRef.afterClosed().subscribe((data: any) => {
      const task:TodoRequestNew = data.task
      const project:ProjectRequestNew = data.project

      if (task) {
        this.projects.forEach(project => {
          if (project.id === task.project_id) {
            this.projectService.addTodo(task)
              .subscribe(task => {
                const projectTask:Todo = {
                  text: task.text,
                  id: task.id,
                  is_completed: task.is_completed || false
                }

                project.todos.push(projectTask)
              })
          }
        })
      } else if (project) {
        this.projectService.newProject(project)
          .subscribe((newProjectPlain: Project) => {
            const newProject = plainToClass(Project, newProjectPlain)
            this.projects.push(newProject)
            this.mapProjectOptions()
          })
      }
    })
  }

  onUpdateTodo(data: TodoInProject) {
    if (this.projects.length === 0) return

    const project = this.projects.find(p => p.id === data.projectId)

    if (project) {
      this.projectService.updateTodo(project.id, data.todo)
        .subscribe(task => {
          const res:Todo = {
            text: task.text,
            id: task.id,
            is_completed: task.is_completed || false
          }

          project.updateTodo(res)
        })
    }
  }

  deleteProject(id: number) {
    const project = this.projects.find(p => p.id === id)

    if (project) {
      this.projectService.deleteProject(project.id)
        .subscribe((isDeleted: boolean) => {
          if (isDeleted) {
            this.projects = this.projects.filter(p => p.id !== id)
            this.mapProjectOptions()
          }
        })
    }
  }
}
