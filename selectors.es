import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
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

export {
  extSelector,
  extReadySelector,
  switchCounterRecordsSelector,
  pStateSelector,
}
