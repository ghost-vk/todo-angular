import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Project } from './models/project'
import { ProjectsService } from "./services/projects.service";
import { AuthService } from "./services/auth.service";

import {
  DialogProjectComponent
} from "./dialog-project/dialog-project.component";
import { DialogTodoComponent } from "./dialog-todo/dialog-todo.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public projects$: Observable<Project[]>
  public authorized$: Observable<boolean>

  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.projects$ = this.projectsService.projects$
    this.authorized$ = this.authService.authorized$

    this.authService.checkAuthorized()

    this.authorized$.subscribe((val) => {
      if (val) {
        this.projectsService.fetchProjects()
      } else {
        this.projectsService.resetProjects()
      }
    })
  }

  openTodoDialog() {
    const todoDialogRef = this.dialog.open(DialogTodoComponent)

    todoDialogRef.afterClosed().subscribe(() => {
      this.projectsService.resetCurrentProject()
      this.projectsService.resetCurrentTodo()
    })
  }

  openProjectDialog() {
    const projectDialogRef = this.dialog.open(DialogProjectComponent)

    projectDialogRef.afterClosed().subscribe(() => {
      this.projectsService.resetCurrentProject()
    })
  }

  projectTrackBy(index: number, project: Project) {
    return project.id
  }
}
