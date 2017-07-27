import { combineReducers } from 'redux'
import { reducer as switchCounter } from './switch-counter'
import { reducer as config } from './config'

const reducer = combineReducers({
  switchCounter,
  config,
})

// reducers are supposed to be pure,
// meaning that we can save the resulting value
// which will always be the initial state
const initState = reducer(undefined, {type: 'INIT'})

export * from './action-creator'
export {
  reducer,
  initState,
}
