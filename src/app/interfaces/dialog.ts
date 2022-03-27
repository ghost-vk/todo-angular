import { TaskValues } from "./task-values";
import { ProjectValues } from "./project-values";

export type DialogType = 'task' | 'project'

export type CrudActionType = 'create' | 'update'

export interface Dialog {
  type: DialogType,
  task?: TaskValues,
  project?: ProjectValues
}
