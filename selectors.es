import _ from 'lodash'
import {
  chainComparators,
  flipComparator,
  projectorToComparator,
} from 'subtender'

import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
  stateSelector as poiStateSelector,
} from 'views/utils/selectors'

import { initState } from './store'
import { emptyPState } from './p-state'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-switch'),
  extStore =>
    _.isEmpty(extStore) ? initState : extStore)

// consider the state is ready (so that observer starts recording)
// when both sub-states are ready
const extReadySelector = createSelector(
  extSelector,
  ext =>
    ext.switchCounter.ready === true &&
    ext.config.ready === true)

const switchCounterRecordsSelector = createSelector(
  extSelector,
  ext => ext.switchCounter.records)

const configSelector = createSelector(
  extSelector,
  ext => ext.config)

const pStateSelector = createSelector(
  switchCounterRecordsSelector,
  configSelector,
  (switchCounterRecords, config) => ({
    ...emptyPState,
    switchCounterRecords,
    config,
  })
)

const allEnabledPluginsSelector = createSelector(
  poiStateSelector,
  poiState => _.fromPairs(_.flatMap(
    poiState.plugins,
    plugin =>
      plugin.enabled === true ?
        [[plugin.packageName, plugin]] :
        []
  ))
)

// combine plugin record info from that of enabled plugins,
// the list order is unspecified
const pluginInfoListSelector = createSelector(
  allEnabledPluginsSelector,
  switchCounterRecordsSelector,
  (allEnabledPlugins, switchCounterRecords) => _.flatMap(
    _.toPairs(switchCounterRecords),
    ([pluginName, record]) =>
      (pluginName in allEnabledPlugins) ?
        [{pluginName, record, state: allEnabledPlugins[pluginName]}] :
        []
  )
)

// break tie while sorting by taking into account plugin priority
// and lastly pluginName
const pluginResolvingComparator =
  chainComparators(
    projectorToComparator(p => p.state.priority),
    projectorToComparator(p => p.pluginName))

/*
   MFU: Most Frequently Used
   MRU: Most Recently Used
 */
const pluginInfoListMFUSelector = createSelector(
  pluginInfoListSelector,
  xs => [...xs].sort(
    chainComparators(
      flipComparator(projectorToComparator(p => p.record.count)),
      pluginResolvingComparator))
)

const pluginInfoListMRUSelector = createSelector(
  pluginInfoListSelector,
  xs => [...xs].sort(
    chainComparators(
      flipComparator(projectorToComparator(p => p.record.lastTime)),
      pluginResolvingComparator))
)

const actualPluginInfoListSelector = createSelector(
  configSelector,
  pluginInfoListMFUSelector,
  pluginInfoListMRUSelector,
  (config, mfuList, mruList) => {
    const {view, limit} = config
    const limiter = limit === null ?
      _.identity : xs => _.take(xs,limit)

    const list =
      view === 'most-frequent' ? mfuList :
      view === 'most-recent' ? mruList :
      (console.error(`invalid view: ${view}`), [])
    return limiter(list)
  }
)

const viewSelector = createSelector(
  configSelector,
  c => c.view)

export {
  extSelector,
  extReadySelector,
  switchCounterRecordsSelector,
  pStateSelector,
  actualPluginInfoListSelector,
  viewSelector,
}
