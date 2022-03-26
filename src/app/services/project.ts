import { Project } from "../models/project";
import { ITodo } from "../models/todo";
import { HttpClient } from '@angular/common/http';

export class ProjectService {
  constructor(
    private httpClient: HttpClient,
    private project: Project
  ) { }

  async addTodo(todo: ITodo) {
    this.httpClient.post(`http://localhost:3000/todos`, todo)
      .subscribe({
        next: (todo) => {
          console.log(todo)
          return todo
        }
      })
  }
}
