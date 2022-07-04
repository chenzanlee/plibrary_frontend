/**
 *
 * @file vuex入口
 * @author author-name(李红波 15537053107)
 */

import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import buildPigHouse from './modules/buildPigHouse'
import treeData from './modules/treeData'
import carOperation from './modules/carOperation'
import IntelligentControl from '@/views/IntelligentControl/A.Public/store/index'
import userManagement from '@/views/userManagement/store/index'
import getters from './getters'
import echartStyle from './modules/echartsStyle'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    treeData,
    IntelligentControl,
    buildPigHouse,
    userManagement,
    echartStyle,
    carOperation
  },
  getters
})

export default store
