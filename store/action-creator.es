import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

const actionCreator = {
  configReplace: newConfig => ({
    type: '@poi-plugin-switch@config@Replace',
    newConfig,
  }),
  configModify: modifier => ({
    type: '@poi-plugin-switch@config@Modify',
    modifier,
  }),
  switchCounterMerge: records => ({
    type: '@poi-plugin-switch@switchCounter@Merge',
    records,
  }),

  configReady: newConfig =>
    actionCreator.configReplace({
      ...newConfig,
      ready: true,
    }),

  poiSwitchToPlugin: activePluginName => ({
    type: '@@TabSwitch',
    tabInfo: {activePluginName},
  }),
}

const mapDispatchToProps = _.memoize(dispatch =>
  bindActionCreators(actionCreator, dispatch))

const withBoundActionCreator = (func, dispatch=store.dispatch) =>
  func(mapDispatchToProps(dispatch))

const asyncBoundActionCreator = (func, dispatch=store.dispatch) =>
  dispatch(() => setTimeout(() =>
    withBoundActionCreator(func, dispatch)))

export {
  actionCreator,
  mapDispatchToProps,
  withBoundActionCreator,
  asyncBoundActionCreator,
}
