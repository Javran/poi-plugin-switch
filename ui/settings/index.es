import React, { Component } from 'react'

import {
  TriggeringEventSettings,
} from './triggering-event-settings'
import {
  CountLimitSettings,
} from './count-limit-settings'
import {
  ClearRecordsSettings,
} from './clear-records-settings'

class Settings extends Component {
  render() {
    return (
      <div style={{marginBottom: '2em'}} >
        <TriggeringEventSettings />
        <CountLimitSettings />
        <ClearRecordsSettings />
      </div>
    )
  }
}

export { Settings }
