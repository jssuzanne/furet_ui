// /**
// This file is a part of the FuretUI project
// 
//    Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>
// 
// This Source Code Form is subject to the terms of the Mozilla Public License,
// v. 2.0. If a copy of the MPL was not distributed with this file,You can
// obtain one at http://mozilla.org/MPL/2.0/.
// **/
import Vue from 'vue';
import plugin from '../plugin';
import {FormMixin, ThumbnailMixin} from './common';
import {i18n} from '../i18n';

Vue.component('furet-ui-list-field-boolean', {
    props: ['checked'],
    template: '<b-checkbox v-bind:checked="checked" disabled></b-checkbox>',
})


plugin.set(['field', 'List'], {Boolean: (header) => {
    const res = {
        label: header.label,
        field: header.name,
        width: 40,
        renderHtml: (createElement, row) => {
            return createElement('furet-ui-list-field-boolean', {
                props: {checked: eval(row[header.name]) ? true : false}
            });
        },
    }
    if (header.sortable) res.sortable = header.sortable;
    return res;
}})

export const FieldThumbnailBoolean = Vue.component('furet-ui-thumbnail-field-boolean', {
    props: ['name', 'label', 'params', 'data'],
    mixins: [ThumbnailMixin],
    template: `
        <div v-if="this.isInvisible" />
        <b-checkbox 
            v-else
            v-bind:checked="value" 
            disabled
        >
            {{this.label}}
        </b-checkbox>`,
    computed: {
        value () {
            return eval(this.data[this.name]) ? true : false;
        },
    }
})
plugin.set(['field', 'Thumbnail'], {Boolean: 'furet-ui-thumbnail-field-boolean'});

export const FieldFormBoolean = Vue.component('furet-ui-form-field-boolean', {
    props: ['name', 'label', 'params', 'config'],
    mixins: [FormMixin],
    template: `
        <div v-if="this.isInvisible" />
        <b-checkbox 
            v-else
            v-bind:checked="data" 
            v-bind:disabled="isReadonly"
        >
            {{this.label}}
        </b-checkbox>`,
    computed: {
        data () {
            const value = this.config && this.config.data && this.config.data[this.name] || '';
            return eval(value) ? true : false;
        },
    },
})
plugin.set(['field', 'Form'], {Boolean: 'furet-ui-form-field-boolean'});
