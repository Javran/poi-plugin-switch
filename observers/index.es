import { observe } from 'redux-observers'
import { store } from 'views/create-store'

import { pStateSaver } from './p-state-saver'

const observeAll = () =>
  observe(store, [
    pStateSaver,
  ])

export { observeAll }
