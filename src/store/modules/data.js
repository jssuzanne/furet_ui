/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import _ from 'underscore';
export const defaultState = {
    actions: {},
    views: {},
    data: {}
}

// getters
export const getters = {
};

// actions
export const actions = {
};

// mutations
export const mutations = {
    'UPDATE_ACTION'(state, action) {
        const value = Object.assign({}, action);
        delete value.actionId;
        const actions = Object.assign({}, state.actions)
        actions[action.actionId] = value;
        state.actions = actions;
    },
    'UPDATE_VIEW'(state, action) {
        const value = Object.assign({}, action);
        delete value.viewId;
        const views = Object.assign({}, state.views)
        if (views[action.viewId] == undefined) views[action.viewId] = {};
        Object.assign(views[action.viewId], value);
        state.views = views;
    },
    'UPDATE_DATA'(state, action) {
        const data = Object.assign({}, state.data)
        if (data[action.model] == undefined) data[action.model] = {};
        Object.assign(data[action.model], action.data)
        state.data = data;
    },
    'CLEAR_DATA'(state, action) {
        state.actions = {};
        state.views = {};
        state.data = {};
    },
    // 'DELETE_DATA'(state, action) {
    //     _.each(_.keys(state), model => {
    //         if (action.data[model] != undefined) {
    //             state[model] = Object.assign({}, state[model]);
    //             _.each(action.data[model], dataId => {
    //                 if (state[model][dataId] != undefined) delete state[model][dataId];
    //                 if (_.keys(state[model]).length == 0) delete state[model];
    //             });
    //         }
    //     });
    // },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
}
