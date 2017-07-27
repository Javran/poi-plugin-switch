import { SwitchMain as reactClass } from './ui'
import { reducer, withBoundActionCreator } from './store'
import { loadPState } from './p-state'
import { observeAll } from './observers'

// for observer
let unsubscribe = null

// for p-state loading process
let pStateInitId = null

const pluginDidLoad = () => {
  if (unsubscribe !== null) {
    console.error(`unsubscribe function should be null`)
  }
  unsubscribe = observeAll()

  if (pStateInitId !== null) {
    console.error(`pStateInitId should be null`)
  }
  pStateInitId = setTimeout(() => {
    const pState = loadPState()
    const {switchCounterRecords, config} = pState
    withBoundActionCreator(bac => {
      bac.configReady(config)
      bac.switchCounterMerge(switchCounterRecords)
    })
    pStateInitId = null
  })
}

const pluginWillUnload = () => {
  if (typeof unsubscribe !== 'function') {
    console.error(`invalid unsubscribe function`)
  } else {
    unsubscribe()
    unsubscribe = null
  }

  if (pStateInitId !== null) {
    clearTimeout(pStateInitId)
    pStateInitId = null
  }
}

export {
  pluginDidLoad,
  pluginWillUnload,
  reactClass,
  reducer,
}
