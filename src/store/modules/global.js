/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/

export const defaultSpace = {
    left_menu: [],
    right_menu: [],
};

// initial state
export const defaultState = {
    title: '',
    modal_custom_view: '',
    spaces: {},
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
    'CLEAR_GLOBAL'(state, action) {
        state.title = '';
        state.modal_custom_view = '';
        state.spaces = {}
    },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
}
