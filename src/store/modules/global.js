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
    menuId: '',
    actionId: '',
    spaceId: '',
    viewId: '',
    custom_view: '',
};

// initial state
export const defaultState = {
    title: '',
    custom_view: '',
    modal_custom_view: '',
    spaces: {},
    spaceId: '',
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
        if (action.custom_view) {
            state.spaceId = '';
            state.custom_view = action.custom_view;
        } else if (action.spaceId) {
            state.spaceId = action.spaceId;
            state.custom_view = '';
        }
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
        state.custom_view = '';
        state.modal_custom_view = '';
        state.spaceId = '';
        state.spaces = {}
    },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
}
