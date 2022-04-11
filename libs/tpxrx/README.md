# tpxrx
tpxrx is a collection of nx workspace generators for a specific ngrx store pattern. 
tpxrx combines two goals to improve ngrx stores.

1) Split store contents into smaller parts to make store more clear.
2) Standardize asset properties to access the state of http requests.

## Installation
Install @tpx1/tpxrx via npm:

```shell
npm i @tpx1/tpxrx@latest
```

##Store concepts
tpxrx combines two goals to improve ngrx stores.

1) Split store contents into smaller parts to make store more clear.
2) Standardize asset properties to access the state of http requests.

### Split store
In large projects there might be many store actions, properties, etc. 
Dozens of actions, effects and selectors can become confusing.
tpxrx provides a concept to divide contents into domains. 

The domain concept will be explained by an example:

There is a store containing actions to set one or many companies and users and selectors for each property.
The store will be split into domains, so that each domain contains action, effect, facade, reducer and selector file.
How many and which items you want to split is your own decision as long as you don't split actions using the same state property. 
Often it makes sense to use each domain model type in a domain.
In this example we create a company domain and a user domain.

Domains will be aggregated by base reducer, base selectors and base facade.
They are explained at the end of this chapter.

#### File structure
The store contains the following file structure:

```shell
| +state
|--- company
|---|--- company.actions.ts
|---|--- company.actions.resets.ts
|---|--- company.effects.ts
|---|--- company.facade.ts
|---|--- company.facade.resets.ts
|---|--- company.reducer.ts
|---|--- company.reducer.resets.ts
|---|--- company.selectors.ts
|--- user
|---|--- user.actions.ts
|---|--- user.actions.resets.ts
|---|--- user.effects.ts
|---|--- user.facade.ts
|---|--- user.facade.resets.ts
|---|--- user.reducer.ts
|---|--- user.reducer.resets.ts
|---|--- user.selectors.ts
|--- example.facade.ts
|--- example.reducer.ts
|--- example.selectors.ts
| example.module.ts
```
Run
```shell
nx g @tpx1/tpxrx:lib example --domains=company,user --crud
```
inside your nx workspace to generate this file structure and have a look at each file content.

#### actions
*.actions.ts contains all actions of the domain in the same format you already know.

*.actions.resets.ts contains all actions to reset properties of the store. 
Read more about reset actions in chapter Generator commands.
Use comments for each action group.

#### effects
*.effects.ts contains an injectable class, including all effects of the domain in the same format you already know.

#### reducer
*.reducer.ts contains a state definition, an initialState definition and a function to get ReducerTypes.

*.reducer.resets.ts contains a function to get ReducerTypes of resets actions.
Use comments for each action group.

#### selectors
*.selectors.ts contains all selectors of the domain in the same format you already know.

#### facade
*.facade.ts contains Observable properties of selectors and action functions.

*.facade.resets.ts contain resets action functions.

#### base reducer
The base reducer (example.reducer.ts in this example) aggregates all domain reducers.
The state interface extends all domain state interfaces.
The initialState Object aggregates all domain initialState Objects.
The reducer function returns an array of all domain Reducer Types.

#### base selectors
The base selectors file defines a feature selector used by all domain selectors.

#### base facade
The base facade injects all domain facades to provide functions to base facade usage.
This is the service used in your components to interact with the store.
It's the only store file visibile for other libs.
So it's important to export this file in the index.ts

Use ExampleFacade this way:

```typescript
this.exampleFacade.userFacade.user$.pipe(
    filter(u => !!u)
).subscribe((user) => {
    console.log(user);
});
this.exampleFacade.userFacade.loadUserById('123');
```

### Standardization

In most projects store asset properties are defined in confusing ways. Sometimes there is a loading property, sometimes there is a loadingFinished or a loadingStarted.
Each developer chooses an own naming and boolean logic. 
This becomes confusing and might produce errors.

tpxrx improves assets behaviour by standardized property names.
Each action group for http requests (consisting of a default action, success action and failure action) defines a pending property, success property and failure property which indicates if the request is actually pending (waiting for response), successfully responded or responded with an error.
The action loadUserById implicates the actions loadUserByIdSuccess and loadUserByIdFailure.
The state defines a property user which is set when the http request is responded successfully.
Additional the state defines three properties:

```typescript
loadUserByIdPending?: boolean;
loadUserByIdSuccess?: boolean;
loadUserByIdError?: Error;
```

The action listeners for the loadUserById actions underly strict rules for value assignment:

```typescript
/*
 * loadUserById
 */
on(UserActions.loadUserById, (state) => ({
  ...state,
  user: null,
  loadUserByIdPending: true,
  loadUserByIdSuccess: false,
  loadUserByIdError: null,
})),
on(UserActions.loadUserByIdSuccess, (state, {user}) => ({
  ...state,
  user: user,
  loadUserByIdPending: false,
  loadUserByIdSuccess: true,
})),
on(UserActions.loadUserByIdFailure, (state, {error}) => ({
  ...state,
  loadUserByIdPending: false,
  loadUserByIdError: error,
})),
```

In default action the data property user might be resetted. 
It's not required because update and create actions might not want to lose data.
Pending is set to true, success is set to false and error is set to null. 
These assignments are required and have to be set in each default action.

In success action the data property is set to response data.
Other properties might also be set, like add user to users array when created.
Pending is set to false, success is set to true.

In error action there is no data property set.
Pending is set to false, error is set to error response.

#### reset properties
For each property of the state there should be a reset action to set the property to null.
Additionally add a resetAssets action to reset all action properties of a domain in one.

## Generator commands
tpxrx provides a collection of nx generator commands to generate a tpxrx store or parts of it.

Some commands are available with optional flag --crud.
If this flag is set actions are generated as crud actions: load all, load by id, create, update, delete, reset.

#### lib
```shell
nx g @tpx1/tpxrx:lib example/domain
nx g @tpx1/tpxrx:lib example/domain --domains=domain1,domain2
nx g @tpx1/tpxrx:lib example/domain --domains=domain1,domain2 --crud
```

#### domain
```shell
nx g @tpx1/tpxrx:domain domain1 --project=example/domain
nx g @tpx1/tpxrx:domain domain1 --project=example/domain --crud
```

#### action
```shell
nx g @tpx1/tpxrx:action loadPropertyById --project=example/domain --domain=domain1
nx g @tpx1/tpxrx:action property --project=example/domain --domain=domain1 --crud
```

#### property
```shell
nx g @tpx1/tpxrx:property propertyA --project=example/domain --domain=domain1
nx g @tpx1/tpxrx:property propertyA --project=example/domain --domain=domain1 --array
```

