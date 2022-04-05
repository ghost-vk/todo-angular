import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { cloneDeep } from 'lodash'

import { Project } from "../models/project";
import { Todo } from '../models/todo'
import { plainToInstance } from "class-transformer";
import { IProjectResponse } from "../interfaces/project-response";
import { IProjectOption } from "../interfaces/project-option";
import { ITodo } from "../interfaces/todo";
import { ITodoResponse } from "../interfaces/todo-response";
import { ITodoAddRequest } from "../interfaces/todo-add-request";
import { ProjectRequest } from "../interfaces/project-request";
import { CrudActionType } from "../interfaces/dialog";

const BASE_URL = environment.baseUrl

@Injectable({ providedIn: "root" })
export class ProjectsService {
  private projects: BehaviorSubject<Project[]> =
    new BehaviorSubject<Project[]>([])
  projects$: Observable<Project[]> = this.projects.asObservable()

  private options: BehaviorSubject<IProjectOption[]> =
    new BehaviorSubject<IProjectOption[]>([])
  options$: Observable<IProjectOption[]> = this.options.asObservable()

  private _currentProjectId: number
  private _currentTodoId: number

  public todoAction: CrudActionType = 'create'
  public projectAction: CrudActionType = 'create'

  constructor(
    private httpClient: HttpClient,
  ) { }

  get currentProjectId(): number {
    return this._currentProjectId
  }

  set currentProjectId(id: number) {
    this._currentProjectId = id
  }

  get currentTodoId(): number {
    return this._currentTodoId
  }

  set currentTodoId(id: number) {
    this._currentTodoId = id
  }

  getCurrentProject(): Project | null {
    const id = this.currentProjectId

    if (!(Number(id) > 0)) return null

    const projects = this.projects.getValue()

    if (!projects.map(p => p.id).includes(id)) return null

    const project = projects.find(p => p.id === id)

    return project ? project : null
  }

  getCurrentTodo(): Todo | null {
    const project = this.getCurrentProject()

    if (!project || !this.currentTodoId) return null

    const todo = project.todos.find(t => t.id === this.currentTodoId)

    return todo ? todo : null
  }

  resetCurrentTodo() {
    this.currentTodoId = NaN
  }

  resetCurrentProject() {
    this.currentProjectId = NaN
  }

  resetProjects() {
    this.projects.next([])
  }

  fetchProjects() {
    this.httpClient.get<IProjectResponse[]>(`${BASE_URL}/projects`,
    )
      .subscribe((response: IProjectResponse[]) => {
        const projects: Project[] = plainToInstance(Project, response)
        projects.forEach(p => p.plainTodosToInstances())

        const options: IProjectOption[] = projects.map(p => p.getOption())

        this.projects.next(projects)
        this.options.next(options)
      })
  }

  updateTodo(projectId: number, updatedTodo: ITodo) {
    this.httpClient
      .patch<ITodoResponse>(
      `${BASE_URL}/projects/${projectId}/todos/${updatedTodo.id}`,
      updatedTodo,
      )
      .subscribe((response: ITodoResponse) => {
        const projects: Project[] = cloneDeep(this.projects.getValue())
        const project = projects.find(p => p.id === projectId)

        if (!project) return

        const newTodo = new Todo(response)
        project.updateTodo(newTodo)

        this.projects.next(projects)
      })
  }

  addTodo(projectId: number, addedTodo: ITodoAddRequest) {
    this.httpClient
      .post<ITodoResponse>(
        `${BASE_URL}/todos`, addedTodo,
      )
      .subscribe((response: ITodoResponse) => {
        const projects: Project[] = cloneDeep(this.projects.getValue())
        const project = projects.find(p => p.id === projectId)

        if (!project) return

        const newTodo = new Todo(response)
        project.addTodo(newTodo)

        this.projects.next(projects)
      })
  }

  deleteTodo() {
    const projectId = this.currentProjectId
    const todoId = this.currentTodoId

    if (!projectId || !todoId) return

    this.httpClient
      .delete<null>(
        `${BASE_URL}/projects/${projectId}/todos/${todoId}`,
      )
      .subscribe(() => {
        const projects: Project[] = cloneDeep(this.projects.getValue())
        const project = projects.find(p => p.id === projectId)

        if (!project) return

        project.deleteTodo(todoId)

        this.projects.next(projects)
      })
  }

  addProject(project: IProjectResponse | Project): Project {
    const projects: Project[] = cloneDeep(this.projects.getValue())
    let newProject

    if (project instanceof Project) {
      newProject = project
      projects.push(project)
      this.projects.next(projects)
    } else {
      const todos = plainToInstance(Todo, project.todos)
      newProject = new Project(project.id, project.title, todos)
      projects.push(newProject)
      this.projects.next(projects)
    }

    const options = projects.map(p => p.getOption())
    this.options.next(options)

    return newProject
  }

  createProject(request: ProjectRequest): Observable<IProjectResponse> {
    return this.httpClient
      .post<IProjectResponse>(
        `${BASE_URL}/projects`,
        { project: request },
      )
  }

  deleteProject(projectId: number) {
    return this.httpClient
      .delete<null>(
        `${BASE_URL}/projects/${projectId}`,
      )
      .subscribe(() => {
        const projects: Project[] = cloneDeep(this.projects.getValue())
          .filter((p: Project) => p.id !== projectId)

        this.projects.next(projects)

        const options = projects.map(p => p.getOption())
        this.options.next(options)
      })
  }

  editProject(projectId: number, edited: ProjectRequest) {
    return this.httpClient
      .patch<IProjectResponse>(
        `${BASE_URL}/projects/${projectId}`,
        edited,
      )
      .subscribe((res: IProjectResponse) => {
        const projects: Project[] = cloneDeep(this.projects.getValue())

        const project = projects.find(p => p.id === projectId)

        if (!project) return

        const todos = plainToInstance(Todo, res.todos.map(t => ({
          todo: {
            text: t.text,
            is_completed: t.is_completed,
            id: t.id
          }
        })))

        const updatedProject = new Project(res.id, res.title, todos)

        const newProjects = projects.map(p => p.id !== res.id ? p : updatedProject)

        this.projects.next(newProjects)

        const options = newProjects.map(p => p.getOption())
        this.options.next(options)
      })
  }
}
