import { emptyPState } from '../p-state'

const initState = {
  ...emptyPState.config,
  ready: false,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-switch@config@Replace') {
    const {newConfig} = action
    return newConfig
  }

  if (! state.ready)
    return state

  if (action.type === '@poi-plugin-switch@config@Modify') {
    const {modifier} = action
    return modifier(state)
  }

  return state
}

export { reducer }
