/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import _ from 'underscore';

export const defaultSpace = {
    left_menu: [],
    right_menu: [],
};

// initial state
export const defaultState = {
    title: '',
    modal_custom_view: '',
    spaces: {},
    breadscrumbs: [],
};

// getters
export const getters = {
};

// actions
export const actions = {
};

// mutations
export const mutations = {
    'UPDATE_GLOBAL'(state, action) {
        if (action.title) state.title = action.title;
        if (action.modal_custom_view) state.modal_custom_view = action.modal_custom_view;
    },
    'UPDATE_SPACE'(state, action) {
        const spaces = Object.assign({}, state.spaces)
        const value = Object.assign({}, action);
        delete value.spaceId;
        if (spaces[action.spaceId] == undefined) {
            spaces[action.spaceId] = Object.assign({}, defaultSpace, value)
        } else {
            Object.assign(spaces[action.spaceId], value)
        }
        state.spaces = spaces;
    },
    'ADD_IN_BREADSCRUMB'(state, action) {
        const breadscrumbs = state.breadscrumbs.slice(0);
        breadscrumbs.push({
            path: action.path,
            label: action.label,
            changes: action.changes,
            position: breadscrumbs.length,
        });
        state.breadscrumbs = breadscrumbs;
    },
    'REMOVE_FROM_BREADSCRUMB'(state, action) {
        const breadscrumbs = _.filter(state.breadscrumbs.slice(0), a => a.position < action.position);
        state.breadscrumbs = _.sortBy(breadscrumbs, a => a.position);
    },
    'CLEAR_BREADSCRUMB'(state, action) {
        state.breadscrumbs = [];
    },
    'CLEAR_GLOBAL'(state, action) {
        state.title = '';
        state.modal_custom_view = '';
        state.spaces = {};
        state.breadscrumbs = [];
    },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
}
