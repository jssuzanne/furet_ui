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

export const RelationShipX2MList = {
    template: `
        <span v-if="isInvisible" />
        <div v-else>
            <span class="tag" v-for="value in values">
                <a 
                    v-on:click.stop="onClick(value.dataId)">{{value.label}}
                </a>
            </span>
        </div>`,
    computed: {
        values () {
            const values = this.row[this.header.name] || '';
            const model = this.header.model; 
            if (model) {
                let data = this.$store.state.data.data;
                if (data[model]) {
                    data = data[model];
                    return _.map(values, dataId => {
                        return {dataId, label: this.format(this.header.display, data[String(dataId)])}
                    })
                }
            }
            return [];
        }
    },
    methods: {
        onClick (dataId) {
            this.addInBreadscrumb({
                spaceId: this.header.spaceId,
                menuId: this.header.menuId,
                actionId: this.header.actionId,
                dataId,
                mode: this.header.mode,
            });
        },
    },
}

export const RelationShipX2MThumbnail = {
    props: ['model', 'spaceId', 'menuId', 'actionId', 'mode', 'display'],
    template: `
        <div v-if="this.isInvisible" />
        <b-tooltip 
            v-bind:label="getTooltip" 
            v-bind:position="tooltipPosition"
            v-else
        >
            <b-field 
                v-bind:label="this.label"
                v-bind:style="{'width': 'inherit'}"
            >
                <span class="tag" v-for="value in values">
                    <a 
                        v-on:click.stop="onClick(value.dataId)">{{value.label}}
                    </a>
                </span>
            </b-field>
        </b-tooltip>`,
    computed: {
        values () {
            const values = this.data && this.data[this.name] || '';
            if (this.model) {
                let data = this.$store.state.data.data;
                if (data[this.model]) {
                    data = data[this.model];
                    return _.map(values, dataId => {
                        return {dataId, label: this.format(this.display, data[String(dataId)])}
                    })
                }
            }
            return [];
        }
    },
    methods: {
        onClick (dataId) {
            this.addInBreadscrumb({
                spaceId: this.spaceId,
                menuId: this.menuId,
                actionId: this.actionId,
                dataId: dataId,
                mode: this.mode,
            });
        },
    },
}
