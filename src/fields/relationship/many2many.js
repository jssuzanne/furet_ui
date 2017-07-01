/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import {FormMixin, ThumbnailMixin, ListMixin} from '../common';
import {RelationShip, RelationShipX2MList, RelationShipX2MThumbnail} from './common';
import {dispatchAll} from '../../store';
import {json_post} from '../../server-call';

export const FieldListMany2Many = Vue.component('furet-ui-list-field-many2many', {
    mixins: [ListMixin, RelationShip, RelationShipX2MList],
})

export const FieldThumbnailMany2Many = Vue.component('furet-ui-thumbnail-field-many2many', {
    mixins: [ThumbnailMixin, RelationShip, RelationShipX2MThumbnail],
})

export const FieldFormMany2Many = Vue.component('furet-ui-form-field-many2many-checkbox', {
    props: ['checkbox_class', 'model', 'display', 'fields', 'fieldcolor'],
    mixins: [FormMixin, RelationShip],
    template: `
        <div v-if="this.isInvisible" />
        <b-tooltip 
            v-bind:label="getTooltip" 
            v-bind:position="tooltipPosition"
            v-bind:style="{'width': '100%'}"
            v-else
        >
            <b-field 
                v-bind:label="this.label"
                v-bind:type="getType"
                v-bind:message="getMessage"
                v-bind:style="{'width': 'inherit'}"
            >
                <div class="columns is-multiline is-mobile">
                    <div 
                        v-for="value in existing"
                        v-bind:id="value.dataId"
                        v-bind:class="['column', checkbox_class]" 
                    >
                        <b-checkbox 
                            v-bind:checked="isChecked(value.dataId)" 
                            v-bind:disabled="isReadonly"
                            v-on:change="onChange"
                        >
                            {{value.label}}
                            <div v-bind:style="getStyle(value.dataId)" />
                        </b-checkbox>
                    </div>
                </div>
            </b-field>
        </b-tooltip>`,
    created () {
        json_post('/field/x2x/search', 
                  {model: this.model, fields:this.fields}, 
                  {
                      onSuccess: (result) => {
                          dispatchAll(result.data);
                      }
                  }
        );
    },
    computed: {
        existingIds () {
            if (this.model) {
                let data = this.$store.state.data.data;
                if (data[this.model]) {
                    return _.keys(data[this.model]);
                }
            }
            return [];
        },
        existing () {
            const data = this.$store.state.data.data[this.model];
            return _.map(this.existingIds, dataId => ({
                dataId, label: this.format(this.display, data[dataId])
            }));
        }
    },
    methods: {
        isChecked(dataId) {
            const value = this.config && this.config.data && this.config.data[this.name] || [];
            const values = _.map(value, v => String(v));
            if (values.indexOf(dataId) > -1) return true;
            return false;
        },
        getStyle (dataId) {
            if (this.fieldcolor) {
                const data = this.$store.state.data.data[this.model][dataId];
                if (data[this.fieldcolor]) return {width: '100%', height: '5px', backgroundColor: data[this.fieldcolor]};
            }
            return {'display': 'none'};
        },
        onChange (value, event) {
            const values = ({}, this.config && this.config.data && this.config.data[this.name] || []).slice(0);
            if (value) {
                values.push(event.path[2].id);
            } else {
                const index = values.indexOf(event.path[2].id);
                if (index > -1) values.splice(index, 1);
            }
            this.updateValue(values);
        },
    },
})
