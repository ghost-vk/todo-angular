import { TaskValues } from "./task-values";
import { ProjectRequestNew } from "./project-request-new";

export type DialogType = 'task' | 'project'

export interface Dialog {
  type: DialogType,
  task?: TaskValues,
  project?: ProjectRequestNew
}
