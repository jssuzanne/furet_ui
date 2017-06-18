/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
export const defaultState = {
    actions: [],
    action_data: {},
}

// getters
export const getters = {
};

// actions
export const actions = {
};

// mutations
export const mutations = {
    'UPDATE_ACTION_MANAGER_ADD_ACTION'(state, action) {
        const actions = state.actions.slice(0);
        actions.push(action.actionId);
        Object.assign(state, {actions});
    },
    'UPDATE_ACTION_MANAGER_REMOVE_FROM_ACTION'(state, action) {
        const index = state.actions.indexOf(action.actionId) ;
        let newactions = []
        if (index != 0) {
            newactions = state.actions.slice(0, index);
        }
        Object.assign(state, {actions: newactions});
    },
    'UPDATE_ACTION_MANAGER_ADD_ACTION_DATA'(state, action) {
        const value = Object.assign({}, action);
        delete value.actionId;
        const action_data = Object.assign({}, state.action_data);
        action_data[action.actionId] = value;
        Object.assign(state, {action_data});
    },
    'RESET_ACTION_MANAGER'(state, action) {
        state.actions = [];
    },
    'CLEAR_ACTION_MANAGER'(state, action) {
        state.actions = [];
        state.action_data = {};
    },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
}
