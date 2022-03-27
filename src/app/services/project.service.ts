import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map, Observable } from "rxjs";
import { environment } from 'src/environments/environment';

import { Project } from "../models/project";
import { Todo } from "../interfaces/todo";
import { TodoResponse } from "../interfaces/todo-response";
import { ProjectValues } from "../interfaces/project-values";
import { TaskValues } from "../interfaces/task-values";

const BASE_URL = environment.production
  ? 'https://todo-oblako-group.herokuapp.com'
  : 'http://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) { }

  fetchProjects(): Observable<Project[]>{
    return this.httpClient.get<Project[]>(`${BASE_URL}/projects`)
  }

  addTodo(todo: TaskValues): Observable<TodoResponse> {
    return this.httpClient.post<TodoResponse>(`${BASE_URL}/todos`, todo)
  }

  updateTodo(projectId: number, todo: Todo): Observable<TodoResponse> {
    return this.httpClient.patch<TodoResponse>(
      `${BASE_URL}/projects/${projectId}/todos/${todo.id}`,
      todo
    )
  }

  deleteTodo(projectId: number, todoId: number):Observable<boolean> {
    return this.httpClient.delete<null>(
      `${BASE_URL}/projects/${projectId}/todos/${todoId}`
    ).pipe(map(res => res === null))
  }

  newProject(data: ProjectValues): Observable<Project> {
    return this.httpClient.post<Project>(`${BASE_URL}/projects`, data)
  }

  deleteProject(id: number): Observable<boolean> {
    return this.httpClient.delete<null>(`${BASE_URL}/projects/${id}`)
      .pipe(
        map(res => res === null)
      )
  }

  editProject(id: number, title: string) {
    return this.httpClient.patch<Project>(
      `${BASE_URL}/projects/${id}`,
      { title }
    )
  }
}
