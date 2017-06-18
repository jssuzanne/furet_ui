/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
export const defaultState = {};

// getters
export const getters = {
};

// actions
export const actions = {
};

// mutations
export const mutations = {
    'UPDATE_VIEW'(state, action) {
        const value = Object.assign({}, action);
        delete value.viewId;
        const values = {};
        values[action.viewId] = Object.assign({}, state[action.viewId], value);
        Object.assign(state, values);
    },
    'CLEAR_VIEW'(state, action) {
        _.each(_.keys(state), k => delete state[k]);
        Object.assign(state, defaultState);
    },
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
}
