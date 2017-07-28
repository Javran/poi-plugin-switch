/*

   pState is short for 'persistent state'.

 */
import _ from 'lodash'
import { modifyObject } from 'subtender'
import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const { APPDATA_PATH } = window

const emptyPState = {
  switchCounterRecords: {
    /*
       - key: pluginName
       - value: Object

         - pluginName :: string
         - count :: int
         - lastTime :: int

     */
  },
  config: {
    view: 'most-frequent', // most-recent / most-frequent
    limit: null, // null = no limit, otherwise a positive int
    switchByMidClick: false,
    switchByKey: null,
    starredPlugins: [], // Array of starred plugins
  },
  dataVersion: 'initial-a',
}

// using downcase for types, otherwise it messes up autocomplete
// switchCounterRecordNew(<string>)(<switchCounterRecords>) => switchCounterRecords
const switchCounterRecordNew = pluginName =>
  modifyObject(
    pluginName,
    (pluginRecord = {pluginName}) => _.flow([
      modifyObject('count', (count=0) => count+1),
      modifyObject('lastTime', () => Number(new Date())),
    ])(pluginRecord)
  )

// merge actionRecords into existing one
const switchCounterRecordMerge = actionRecords => {
  const modifyFuncs = Object.entries(actionRecords)
    .map(([pluginName, pluginRecord]) =>
      modifyObject(pluginName, (record = null) => {
        if (! record)
          return pluginRecord
        // need merging
        return {
          ...record,
          count: record.count + pluginRecord.count,
          lastTime: Math.max(record.lastTime, pluginRecord.lastTime),
        }
      }))
  return _.flow(modifyFuncs)
}

const getPStateFilePath = () => {
  ensureDirSync(APPDATA_PATH)
  return join(APPDATA_PATH,'plugin-switch.json')
}

const savePState = pState => {
  const path = getPStateFilePath()
  try {
    writeJsonSync(path,pState)
  } catch (err) {
    console.error('Error while writing to config file', err)
  }
}

const updatePState = oldPState => {
  if (oldPState.dataVersion === emptyPState.dataVersion)
    return oldPState

  throw new Error('failed to update the config')
}

const loadPState = () => {
  try {
    return updatePState(readJsonSync(getPStateFilePath()))
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading config', err)
    }
  }
  return emptyPState
}

export {
  emptyPState,
  savePState,
  loadPState,

  switchCounterRecordNew,
  switchCounterRecordMerge,
}
