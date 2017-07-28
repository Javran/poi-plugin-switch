import _ from 'lodash'
import { modifyObject } from 'subtender'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {
  Checkbox, Button,
  FormControl,
} from 'react-bootstrap'

import {
  configSelector,
} from '../../selectors'

import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import { __ } from '../../tr'

class TriggeringEventSettingsImpl extends Component {
  static propTypes = {
    switchByMidClick: PTyp.bool.isRequired,
    switchByKey: PTyp.string,
    configModify: PTyp.func.isRequired,
  }

  static defaultProps = {
    switchByKey: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      editingKey: false,
      keyContent: '',
    }
  }

  handleToggleSwitchByMidClick = e => {
    const b = e.target.checked
    this.props.configModify(
      modifyObject('switchByMidClick', () => b))
  }

  handleStartEditingKey = () => {
    const {switchByKey} = this.props
    this.setState({
      editingKey: true,
      keyContent: switchByKey === null ? '' : switchByKey,
    })
  }

  handleCancelEditingKey = () =>
    this.setState({editingKey: false})

  handleKeyContentChange = e => {
    const str = e.target.value
    this.setState({
      keyContent: str.length > 0 ? _.last(str) : '',
    })
  }

  handleDisbleSwitchByKey = () => {
    this.props.configModify(
      modifyObject('switchByKey', () => null))
    this.setState({editingKey: false})
  }

  handleEnableSwitchByKey = () => {
    const {keyContent} = this.state
    if (keyContent.length !== 1)
      return

    this.props.configModify(
      modifyObject('switchByKey', () => keyContent))
    this.setState({editingKey: false})
  }

  render() {
    const {
      switchByMidClick,
      switchByKey,
    } = this.props
    return (
      <div>
        <div style={{fontWeight: 'bold'}} >
          {__('Settings.SwitchToThisPluginOn')}
        </div>
        <Checkbox
          onChange={this.handleToggleSwitchByMidClick}
          checked={switchByMidClick}
          style={{marginLeft: '2em'}}>
          {__('Settings.MouseMiddleClick')}
        </Checkbox>
        <div style={{marginLeft: '2em'}}>
          {
            this.state.editingKey ? (
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Button
                  onClick={this.handleCancelEditingKey}
                  style={{width: '3.6em'}} bsSize="small">
                  <FontAwesome name="undo" />
                </Button>
                <FormControl
                  onChange={this.handleKeyContentChange}
                  style={{width: '4em', marginLeft: '.4em', marginRight: '.4em'}}
                  type="text" value={this.state.keyContent}
                />
                <Button
                  onClick={this.handleEnableSwitchByKey}
                  disabled={this.state.keyContent.length === 0}
                  style={{width: '3.6em', marginRight: '.4em'}}
                  bsStyle="success"
                  bsSize="small"
                >
                  <FontAwesome name="check" />
                </Button>
                <Button style={{width: '3.6em'}}
                  onClick={this.handleDisbleSwitchByKey}
                  bsStyle="danger"
                  bsSize="small"
                >
                  <FontAwesome name="close" />
                </Button>
              </div>
            ) : (
              <Button
                style={{width: '20em'}}
                onClick={this.handleStartEditingKey}
                >
                {
                  switchByKey === null ? __('Settings.KeyPressDisabled') :
                  __('Settings.KeyPressEnabled', switchByKey)
                }
              </Button>
            )
          }
        </div>
      </div>
    )
  }
}

const TriggeringEventSettings = connect(
  state => {
    const {switchByMidClick, switchByKey} = configSelector(state)
    return {switchByMidClick, switchByKey}
  },
  mapDispatchToProps
)(TriggeringEventSettingsImpl)

export { TriggeringEventSettings }
