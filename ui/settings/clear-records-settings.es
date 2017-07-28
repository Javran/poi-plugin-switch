import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import FontAwesome from 'react-fontawesome'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import { __ } from '../../tr'
import { switchCounterRecordsSelector } from '../../selectors'

class ClearRecordsSettingsImpl extends Component {
  static propTypes = {
    records: PTyp.object.isRequired,
    switchCounterClear: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      poppingConfirm: false,
    }
  }

  handlePopConfirm = () =>
    this.setState({poppingConfirm: true})

  handleCancelConfirm = () =>
    this.setState({poppingConfirm: false})

  handleClearRecords = () => {
    this.props.switchCounterClear()
    this.setState({poppingConfirm: false})
  }

  render() {
    const {poppingConfirm} = this.state
    const {records} = this.props
    return (
      <div style={{
        marginTop: '1em',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Button
          onClick={this.handlePopConfirm}
          disabled={poppingConfirm || _.isEmpty(records)}
          style={{width: '50%', marginTop: 0}}>
          {__('Settings.ClearAllRecords')}
        </Button>
        {
          poppingConfirm && (
            <div>
              <Button
                onClick={this.handleCancelConfirm}
                style={{
                  marginLeft: '.4em',
                  width: '3.6em',
                }}
              >
                <FontAwesome name="undo" />
              </Button>
              <Button
                onClick={this.handleClearRecords}
                style={{
                  marginLeft: '.4em',
                  width: '3.6em',
                }}
                bsStyle="danger"
              >
                <FontAwesome name="trash" />
              </Button>
            </div>
          )
        }
      </div>
    )
  }
}

const ClearRecordsSettings = connect(
  createStructuredSelector({
    records: switchCounterRecordsSelector,
  }),
  mapDispatchToProps,
)(ClearRecordsSettingsImpl)

export { ClearRecordsSettings }
