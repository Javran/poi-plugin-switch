import _ from 'lodash'
import { modifyObject, clamp } from 'subtender'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Checkbox,
  FormControl,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import { configSelector } from '../../selectors'
import { __ } from '../../tr'

class CountLimitSettingsImpl extends Component {
  static propTypes = {
    limit: PTyp.number,
    configModify: PTyp.func.isRequired,
  }

  static defaultProps = {
    limit: null,
  }

  handleToggleLimit = e => {
    const {checked} = e.target
    this.props.configModify(
      modifyObject('limit', () => checked ? 5 : null)
    )
  }

  handleLimitChange = e => {
    const newLimitRaw = Number(e.target.value)
    const clamped = clamp(0,100)
    if (! _.isInteger(newLimitRaw))
      return
    this.props.configModify(
      modifyObject('limit', () => clamped(newLimitRaw)))
  }

  render() {
    const {limit} = this.props
    return (
      <div style={{marginTop: '1em', display: 'flex', alignItems: 'baseline'}}>
        <Checkbox
          onChange={this.handleToggleLimit}
          style={{flex: 4}} checked={limit !== null}>
          <span style={{fontWeight: 'bold'}}>
            {__('Settings.LimitUnstarred')}
          </span>
        </Checkbox>
        {
          limit !== null && (
            <FormControl
              type="number"
              onChange={this.handleLimitChange}
              style={{width: '6em', flex: 1}}
              value={limit}
            />
          )
        }
      </div>
    )
  }
}

const CountLimitSettings = connect(
  state => {
    const {limit} = configSelector(state)
    return {limit}
  },
  mapDispatchToProps
)(CountLimitSettingsImpl)

export { CountLimitSettings }
