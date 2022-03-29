import { ITodo } from "./todo";

export interface IProjectResponse {
  id: number,
  title: string,
  todos: ITodo[]
}
