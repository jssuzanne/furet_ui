/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import {dispatchAll} from '../../store';
import {json_post} from '../../server-call';

export const RelationShip = {
    computed: {
    },
    methods: {
        format (condition, fields) {
            return eval(condition);
        },
        addInBreadscrumb (options) {
            const changes = Object.assign({}, this.$store.state.data.changes);
            const route = this.$route;
            const action = this.$store.state.data.actions[String(route.params.actionId)];
            this.$store.commit('ADD_IN_BREADSCRUMB', {
                path: route.path,
                label: action.label,
                changes,
            });
            const params = {
                spaceId: options.spaceId || route.params.spaceId,
                menuId: options.menuId,
                dataId: options.dataId,
                mode: options.mode || 'readonly',
            }
            json_post('/action/' + options.actionId, params, {
                onSuccess: (results) => {
                    dispatchAll(results);
                },
            })
            this.$store.commit('CLEAR_ALL_CHANGE', {});
        },
    },
}
