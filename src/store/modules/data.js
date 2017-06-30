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
    data: {},
    changes: {},
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
        _.each(_.keys(action.data), dataId => {
            data[action.model][dataId] = Object.assign({}, data[action.model][dataId], action.data[dataId]);
        });
        state.data = data;
    },
    'DELETE_DATA'(state, action) {
        const data = Object.assign({}, state.data)
        _.each(action.dataIds, dataId => {
            if (data[action.model][dataId])
                delete data[action.model][dataId];
        });
        state.data = data;
    },
    'UPDATE_CHANGE'(state, action) {
        const changes = Object.assign({}, state.changes);
        if (changes[action.model] == undefined) changes[action.model] = {}
        if (changes[action.model][action.dataId] == undefined) changes[action.model][action.dataId] = {};
        changes[action.model][action.dataId][action.fieldname] = action.value;
        state.changes = changes
    },
    'REPLACE_CHANGE'(state, action) {
        state.changes = Object.assign({}, actions.changes);
    },
    'CLEAR_CHANGE'(state, action) {
        const changes = Object.assign({}, state.changes);
        if (changes[action.model] && changes[action.model][action.dataId]) {
            delete changes[action.model][action.dataId];
            state.changes = changes;
        }
    },
    'CLEAR_ALL_CHANGE'(state, action) {
        state.changes = {};
    },
    'CLEAR_DATA'(state, action) {
        state.actions = {};
        state.views = {};
        state.data = {};
        state.changes = {};
    },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
}
