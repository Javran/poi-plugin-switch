import _ from 'lodash'
import {
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'
import shallowEqual from 'shallowequal'

import {
  extReadySelector,
  pStateSelector,
} from '../selectors'
import {
  savePState,
} from '../p-state'

const debouncedSavePState = _.debounce(
  pState => setTimeout(() => savePState(pState)),
  1000)

const pStateSaver = observer(
  createStructuredSelector({
    ready: extReadySelector,
    pState: pStateSelector,
  }),
  (_dispatch, cur, prev) => {
    if (
      // transition from ready to ready (loaded state changed)
      cur.ready === true && prev.ready === true &&
      ! shallowEqual(cur.pState, prev.pState)
    ) {
      const {pState} = cur
      debouncedSavePState(pState)
    }
  }
)

export { pStateSaver }
