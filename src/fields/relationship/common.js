/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import {dispatchAll} from '../../store';
import {json_post} from '../../server-call';
import _ from 'underscore';

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
            <span 
                v-for="value in values"
                class="tag" 
                v-bind:style="getStyle(value.dataId)"
            >
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
        },
    },
    methods: {
        getStyle (dataId) {
            if (this.header.fieldcolor) {
                const data = this.$store.state.data.data[this.header.model][dataId];
                if (data[this.header.fieldcolor]) return {border: '4px solid ' + data[this.header.fieldcolor]};
            }
            return {};
        },
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
    props: ['model', 'spaceId', 'menuId', 'actionId', 'mode', 'display', 'fieldcolor'],
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
                <span 
                    v-for="value in values"
                    class="tag" 
                    v-bind:style="getStyle(value.dataId)"
                >
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
        getStyle (dataId) {
            if (this.fieldcolor) {
                const data = this.$store.state.data.data[this.model][dataId];
                if (data[this.fieldcolor]) return {border: '4px solid ' + data[this.fieldcolor]};
            }
            return {};
        },
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

export const RelationShipX2MForm = {
    props: ['model', 'spaceId', 'menuId', 'actionId', 'mode', 'display', 'fieldcolor'],
    computed: {
        values () {
            const values = this.config && this.config.data && this.config.data[this.name] || '';
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
        getStyle (dataId) {
            if (this.fieldcolor) {
                const data = this.$store.state.data.data[this.model][dataId];
                if (data[this.fieldcolor]) return {border: '4px solid ' + data[this.fieldcolor]};
            }
            return {};
        },
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
