import { Component, Output, EventEmitter, OnInit } from '@angular/core'
import { ProjectsService } from "../services/projects.service";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.components.scss']
})
export class HeaderComponent implements OnInit {

  public authorized$: Observable<boolean>

  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authorized$ = this.authService.authorized$
  }

  @Output() addTask = new EventEmitter()

  onAddTask() {
    this.projectsService.todoAction = 'create'
    this.addTask.emit()
  }

  @Output() addProject = new EventEmitter()

  onAddProject() {
    this.projectsService.projectAction = 'create'
    this.addProject.emit()
  }

  onLogout() {
    this.authService.logout()
  }
}
