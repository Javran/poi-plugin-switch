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
    poiSwitchToPlugin: PTyp.func.isRequired,
  }

  modifyStarredPlugins = modifier =>
    this.props.configModify(
      modifyObject('starredPlugins', modifier))

  handleSwitchViewMode = viewMode => () =>
    this.props.configModify(
      modifyObject(
        'view', () => viewMode))

  handleStarPlugin = pluginName => () =>
    this.modifyStarredPlugins(
      sp => [...sp, pluginName])

  handleUnstarPlugin = pluginName => () =>
    this.modifyStarredPlugins(
      sp => sp.filter(s => s !== pluginName))

  handleSwapPlugin = (ind1,ind2) => () =>
    this.modifyStarredPlugins(
      sp => {
        const newSp = [...sp]
        newSp[ind1] = sp[ind2]
        newSp[ind2] = sp[ind1]
        return newSp
      })

  handleSwitchToPlugin = pluginName => () =>
    this.props.poiSwitchToPlugin(pluginName)

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
            pluginInfoList.map((pluginInfo, index) => {
              const plugin = pluginInfo.state
              const icon = plugin.icon.split('/')[1] || plugin.icon || 'th-large'
              const bsStyle = pluginInfo.starred ? 'primary' : 'default'
              const ctrlBtnProps = {
                bsStyle,
                style: {marginLeft: '.2em', width: '3em'},
              }
              return (
                <ButtonGroup
                  key={pluginInfo.pluginName}
                  bsSize="large"
                  style={{display: 'flex', alignItems: 'center'}}>
                  <Button
                    bsStyle={bsStyle}
                    onClick={this.handleSwitchToPlugin(pluginInfo.pluginName)}
                    style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                    <FontAwesome name={icon} style={{marginRight: '.5em', width: '1.2em'}} />
                    <span>{pluginInfo.state.name}</span>
                  </Button>
                  {
                    // allow a starred item to be moved up
                    pluginInfo.starred && index > 0 && (
                      <Button
                        {...ctrlBtnProps}
                        onClick={this.handleSwapPlugin(index,index-1)}
                        >
                        <FontAwesome name="chevron-up" />
                      </Button>
                    )
                  }
                  {
                    pluginInfo.starred && (
                      (
                        index+1 < pluginInfoList.length &&
                        pluginInfoList[index+1].starred
                      ) ? (
                        // if moving down is possible for a starred item
                        <Button
                          {...ctrlBtnProps}
                          onClick={this.handleSwapPlugin(index,index+1)}
                        >
                          <FontAwesome name="chevron-down" />
                        </Button>
                      ) : (
                        // if an starred item can not move down, then moving down unstars it
                        <Button
                          {...ctrlBtnProps}
                          onClick={this.handleUnstarPlugin(pluginInfo.pluginName)}
                          >
                          <FontAwesome name="star-o" />
                        </Button>
                      )
                    )
                  }
                  {
                    // unstarred items can be starred this way
                    !pluginInfo.starred && (
                      <Button
                        {...ctrlBtnProps}
                        onClick={this.handleStarPlugin(pluginInfo.pluginName)}
                        >
                        <FontAwesome name="star" />
                      </Button>
                    )
                  }
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
