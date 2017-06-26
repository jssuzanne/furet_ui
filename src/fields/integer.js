/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import plugin from '../plugin';
import {FormMixin, ThumbnailMixin} from './common';


plugin.set(['field', 'List'], {Integer: (header) => {
    const res = {
        label: header.label,
        field: header.name,
        numeric: true,
        width: 40,
        render: (row) => {
            return row[header.name] || '';
        },
    }
    if (header.sortable) res.sortable = header.sortable;
    return res;
}})

export const FieldThumbnailString = Vue.component('furet-ui-thumbnail-field-integer', {
    props: ['name', 'label', 'params', 'data'],
    mixins: [ThumbnailMixin],
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
                v-bind:style="{'width': 'inherit'}"
            >
                <span> {{value}} </span>
            </b-field>
        </b-tooltip>`,
})
plugin.set(['field', 'Thumbnail'], {Integer: 'furet-ui-thumbnail-field-integer'});

export const FieldFormString = Vue.component('furet-ui-form-field-integer', {
    props: ['name', 'label', 'params', 'config'],
    mixins: [FormMixin],
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
                <span v-if="isReadonly"> {{data}} </span>
                <b-input 
                    v-else 
                    type="number"
                    step="1"
                    v-bind:value="data" 
                    v-on:change="updateValue"
                >
                </b-input>
            </b-field>
        </b-tooltip>`,
})
plugin.set(['field', 'Form'], {Integer: 'furet-ui-form-field-integer'});
