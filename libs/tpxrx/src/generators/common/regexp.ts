export const CONSTRUCTOR_REGEX = /constructor\s*\((\s*((private|protected)\s+)?(\w|\$)+:\s*(\w|<|>|\.)+,?)*\s*\)\s*{(\s*|[^}]*)*}/g;
export const CONSTRUCTOR_INJECTION_REGEX = /constructor\s*\(/g;
export const CONSTRUCTOR_CONTENT_REGEX = /constructor\s*\((\s*((private|protected)\s+)?(\w|\$)+:\s*(\w|<|>|\.)+,?)*\s*\)\s*{/g;
export const FACADE_RESET_ASSETS_REGEX = /reset\w+Assets\s*\(\s*\)\s*{/g;
export const FACADE_FUNCTION_REGEX = /(\/\*\s*\*\s*\S*\s*\*\/\s*)?\w+\s*\((\s*((private|protected)\s+)?(\w|\$)+(:\s*(\w|<|>|\.)+)?,?)*\s*\)\s*{(\s*|[^}]*)*}/g;

export const ACTION_RESET_REGEX = /(\/\*\s*\*\s*\S*\s*\*\/\s*)?export\s+const\s+reset\w+\s+=\s+createAction\(/g;
export const ACTION_RESET_ASSETS_REGEX = /(\/\*\s*\*\s*\S*\s*\*\/\s*)?export\s+const\s+reset\w+Assets\s+=\s+createAction\(/g;

export const REDUCER_RESET_REGEX = /(\/\*\s*\*\s*\S*\s*\*\/\s*)?on\s*\(\s*\w+Actions\.reset/g;
export const REDUCER_RESET_ASSETS_REGEX = /(\/\*\s*\*\s*\S*\s*\*\/\s*)?on\s*\(\s*\w+ResetsActions\.reset\w+Assets\s*,\s*\(state\)\s*=>\s*\({/g;
export const REDUCER_STATE_REGEX = /export\s+interface\s+\w+\s*{/g;
export const REDUCER_STATE_CONTENT_REGEX = /export\s+interface\s+\w+\s*{(\s*\w+\??:\s*\w+(\[\])?;?)*\s*}/g;
export const REDUCER_ONS_REGEX = /export\s+function\s+get\w+Ons<T\s+extends\s+\w+>\(\):\s+ReducerTypes<\s*T,\s*ActionCreator\[\]\s*>\[\]\s*{\s*return\s*\[/g;
export const REDUCER_RESET_ONS_REGEX = /export\s+function\s+get\w+ResetOns<T\s+extends\s+\w+>\(\):\s+ReducerTypes<\s*T,\s*ActionCreator\[\]\s*>\[\]\s*{\s*return\s*\[/g;

export const PROJECT_REDUCER_STATE_WITH_EXTENDS_REGEX = /export\s+interface\s+\w+\s+extends\s+/g;
export const PROJECT_REDUCER_STATE_WITHOUT_EXTENDS_REGEX = /export\s+interface\s+\w+\s+/g;
export const PROJECT_REDUCER_INITIAL_STATE_REGEX = /export\s+const\s+initialState:\s+State\s+=\s+{/g;
export const PROJECT_REDUCER_CREATE_REGEX = /const\s+\w+Reducer\s+=\s+createReducer\s*\(/g;

export const MODULE_EFFECTS_REGEX = /EffectsModule\.forFeature\s*\(\s*\[/g;
export const MODULE_PROVIDERS_REGEX = /providers:\s*\[/g;
