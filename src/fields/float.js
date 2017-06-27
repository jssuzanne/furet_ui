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


const round = (value, step) => {
    if (value != undefined) {
        return Math.round(eval(value) / eval(step || 0.01)) * eval(step || 0.01);
    }
    return '';
}


plugin.set(['field', 'List'], {Float: (header) => {
    const res = {
        label: header.label,
        field: header.name,
        numeric: true,
        width: 40,
        render: (row) => {
            return round(row[header.name], header.step);
        },
    }
    if (header.sortable) res.sortable = header.sortable;
    return res;
}})

export const FieldThumbnailFloat = Vue.component('furet-ui-thumbnail-field-float', {
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
    computed: {
        value () {
            return round(this.data[this.name], this.params && this.params.step);
        },
    }
})
plugin.set(['field', 'Thumbnail'], {Float: 'furet-ui-thumbnail-field-float'});

export const FieldFormFloat = Vue.component('furet-ui-form-field-float', {
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
                    step="getStep"
                    v-bind:value="data" 
                    v-on:change="updateValue"
                >
                </b-input>
            </b-field>
        </b-tooltip>`,
    computed: {
        getStep () {
            return this.params && this.params.step || '0.01';
        },
        data () {
            const value = this.config && this.config.data && this.config.data[this.name] || '';
            return round(value, this.params && this.params.step);
        },
    },
})
plugin.set(['field', 'Form'], {Float: 'furet-ui-form-field-float'});
