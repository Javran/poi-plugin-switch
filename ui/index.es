import _ from 'lodash'
import { modifyObject } from 'subtender'
import { createStructuredSelector } from 'reselect'
import FontAwesome from 'react-fontawesome'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ButtonGroup,
  Button, Well,
} from 'react-bootstrap'

import { mapDispatchToProps } from '../store'
import {
  viewSelector,
  actualPluginInfoListSelector,
} from '../selectors'
import { PTyp } from '../ptyp'

class SwitchMainImpl extends Component {
  static propTypes = {
    view: PTyp.ViewMode.isRequired,
    pluginInfoList: PTyp.array.isRequired,
    configModify: PTyp.func.isRequired,
  }

  handleSwitchViewMode = viewMode => () =>
    this.props.configModify(
      modifyObject(
        'view', () => viewMode))

  render() {
    const {
      view,
      pluginInfoList,
    } = this.props
    return (
      <div style={{margin: 8}}>
        <ButtonGroup
          style={{display: 'flex', marginBottom: '.8em'}}>
          {
            [
              ['most-frequent', 'Most Frequently Used'],
              ['most-recent', 'Most Recently Used'],
            ].map(([key,content]) => (
              <Button
                onClick={this.handleSwitchViewMode(key)}
                active={key === view}
                key={key}
                style={{width: '45%', flex: 1}}>
                {content}
              </Button>
            ))
          }
        </ButtonGroup>
        <Well>
          {
            pluginInfoList.map(pluginInfo => {
              const plugin = pluginInfo.state
              const icon = plugin.icon.split('/')[1] || plugin.icon || 'th-large'
              return (
                <ButtonGroup
                  key={pluginInfo.pluginName}
                  bsSize="large"
                  bsStyle="primary"
                  style={{display: 'flex', alignItems: 'center'}}>
                  <Button style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                    <FontAwesome name={icon} style={{marginRight: '.5em', width: '1.6em'}} />
                    <span>{pluginInfo.state.name}</span>
                  </Button>
                  <Button style={{marginLeft: '.2em', width: '3em'}} >
                    <FontAwesome name="star" />
                  </Button>
                </ButtonGroup>
              )
            })
          }
        </Well>
      </div>
    )
  }
}

const SwitchMain = connect(
  createStructuredSelector({
    view: viewSelector,
    pluginInfoList: actualPluginInfoListSelector,
  }),
  mapDispatchToProps
)(SwitchMainImpl)

export { SwitchMain }
