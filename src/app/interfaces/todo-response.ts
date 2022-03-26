export interface TodoResponse {
  id: number,
  text: string,
  is_completed: boolean,
  project: {
    id: number,
    title: string
  }
}
