/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import _ from 'underscore';
export const defaultState = {}

// getters
export const getters = {
};

// actions
export const actions = {
};

// mutations
export const mutations = {
    'UPDATE_DATA'(state, action) {
        if (state[action.model] == undefined) state[action.model] = {};
        else state[action.model] = Object.assign({}, state[action.model]);
        _.each(_.keys(action.data), dataId => {
            if (state[action.model][dataId] == undefined) state[action.model][dataId] = {};
            Object.assign(state[action.model][dataId], action.data[dataId]);
        });
    },
    'DELETE_DATA'(state, action) {
        _.each(_.keys(state), model => {
            if (action.data[model] != undefined) {
                state[model] = Object.assign({}, state[model]);
                _.each(action.data[model], dataId => {
                    if (state[model][dataId] != undefined) delete state[model][dataId];
                    if (_.keys(state[model]).length == 0) delete state[model];
                });
            }
        });
    },
    'CLEAR_DATA'(state, action) {
        _.each(_.keys(state), k => delete state[k]);
    },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
}
