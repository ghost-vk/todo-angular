import { CrudActionType } from "./dialog";

export interface TaskValues {
  type: CrudActionType,
  text: string,
  is_completed: boolean,
  project_id: number,
  id?: number
}
