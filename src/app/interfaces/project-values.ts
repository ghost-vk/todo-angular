import { CrudActionType } from "./dialog";

export interface ProjectValues {
  type: CrudActionType,
  title: string,
  id?: number
}
