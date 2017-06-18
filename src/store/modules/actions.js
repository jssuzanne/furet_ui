/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import _ from 'underscore';
export const defaultState = {};

// getters
export const getters = {
};

// actions
export const actions = {
};

// mutations
export const mutations = {
    'UPDATE_ACTION_SELECT_VIEW'(state, action) {
        const value = Object.assign({}, action);
        delete value.actionId;
        const values = {};
        values[action.actionId] = Object.assign({}, state[action.actionId], value);
        Object.assign(state, values);
    },
    'UPDATE_NEW_ID'(state, action) {
        _.each(action.data || [], toChange => {
            _.each(_.keys(state), actionId => {
                const action = state[actionId];
                if (action && action.params && action.params.id == toChange.oldId) {
                    action.params.id = toChange.newId;
                    state[actionId] = Object.assign({}, action);
                    if (action.params.readonly != undefined) delete action.params.readonly;
                    if (action.params.new != undefined) action.params.new = false;
                }
            });
        });
    },
    'CLEAR_ACTION'(state, action) {
        _.each(_.keys(state), k => delete state[k]);
    },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
}
