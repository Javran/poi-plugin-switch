import _ from 'lodash'
import { store } from 'views/create-store'
import {
  extReadySelector,
  configSelector,
} from './selectors'
import { withBoundActionCreator } from './store'

const switchToSwitch = () =>
  withBoundActionCreator(bac =>
    bac.poiSwitchToPlugin('poi-plugin-switch'))

const eventHandler = e => {
  const state = store.getState()

  // not handling anything if the state isn't ready
  if (! extReadySelector(state))
    return

  const config = configSelector(state)
  const {switchByMidClick, switchByKey} = config

  // handle mid click
  if (
    switchByMidClick &&
    e.type === 'mouseup' && e.button === 1
  ) {
    return switchToSwitch()
  }

  if (
    switchByKey !== null &&
    e.type === 'keyup' && e.key === switchByKey
  ) {
    return switchToSwitch()
  }

  _.noop()
}

export { eventHandler }
