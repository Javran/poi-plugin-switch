import _ from 'lodash'
import { modifyObject } from 'subtender'
import {
  emptyPState,
  switchCounterRecordNew,
  switchCounterRecordMerge,
} from '../p-state'

const initState = {
  // indiciates whether old config has been loaded so
  // that observer knows when to save
  ready: false,
  records: emptyPState.switchCounterRecords,
}

const reducer = (state = initState, action) => {
  if (action.type === '@@TabSwitch') {
    const pluginName =
      _.get(action,'tabInfo.activePluginName')

    // record plugin switching actions, which
    // can be done regardless of whether we are ready
    if (
      pluginName &&
      typeof pluginName === 'string' &&
      pluginName !== 'poi-plugin-switch'
    ) {
      return modifyObject(
        'records',
        switchCounterRecordNew(pluginName),
      )(state)
    }
  }

  if (action.type === '@poi-plugin-switch@switchCounter@Merge') {
    const {records: actionRecords} = action
    return _.flow([
      modifyObject(
        'records', switchCounterRecordMerge(actionRecords)),
      modifyObject('ready', () => true),
    ])(state)
  }

  return state
}

export { reducer }
