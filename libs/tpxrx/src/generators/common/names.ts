export interface Names {
  name: string;
  className: string;
  propertyName: string;
  constantName: string;
  fileName: string;
  actionType?: ActionType;
}

export interface Action {
  name: string;
  type?: ActionType;
}

export enum ActionType {
  LOAD_ALL = 'LOAD_ALL',
  LOAD_BY_ID = 'LOAD_BY_ID',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  RESET = 'RESET',
  RESET_ALL = 'RESET_ALL',
  UNDEFINED = 'UNDEFINED',
}

export type ActionSuffix = 'default' | 'success' | 'failure';
