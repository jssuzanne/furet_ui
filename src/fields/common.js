/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import _ from 'underscore';

export const safe_eval = (condition, fields) => {
    const now = Date.now(),
          toDate = (v) => new Date(v);
    let res = false;
    try {
        res = eval(condition) ? true : false;
    } catch (e) {};
    return res;
}


export const ListMixin = {
    props: ['row', 'index', 'header'],
    template: `
        <div>
            <span v-if="isInvisible" />
            <span v-else>{{value}}</span>
        </div>`,
    computed: {
        value () {
            if (this.row[this.header.name] != undefined)
                return this.row[this.header.name];
            return '';
        },
        isInvisible () {
            return safe_eval(this.header.invisible, this.row || {});
        },
    },
};


export const ThumbnailMixin = {
    props: ['name', 'label', 'data', 'invisible', 'tooltip', 'tooltip_position'],
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
                <span>{{value}}</span>
            </b-field>
        </b-tooltip>`,
    computed: {
        value () {
            return this.data && this.data[this.name] || '';
        },
        isInvisible () {
            return safe_eval(this.invisible, this.data || {});
        },
        getTooltip () {
            return this.tooltip || '';
        },
        tooltipPosition () {
            return this.tooltip_position || 'is-top';
        },
    },
};


export const FormMixin = {
    props: ['name', 'label', 'config', 'invisible', 'tooltip', 'tooltip_position',
            'readonly', 'required'],
    computed: {
        data () {
            return this.config && this.config.data && this.config.data[this.name] || '';
        },
        isReadonly () {
            const readonlyParams = safe_eval(this.readonly, this.config.data || {});
            const readonly = this.config.mode == 'readonly';
            return readonly || readonlyParams;
        },
        isRequired () {
            return safe_eval(this.required, this.config.data || {});
        },
        isInvisible () {
            return safe_eval(this.invisible, this.config.data || {});
        },
        getTooltip () {
            return this.tooltip || '';
        },
        tooltipPosition () {
            return this.tooltip_position || 'is-top';
        },
        getType () {
            if (this.isRequired) {
                if (this.data) return 'is-info';
                return 'is-danger';
            }
            return '';
        },
        getMessage () {
            if (this.isRequired) {
                if (!this.data) return this.$i18n.t('fields.common.required');
            }
            return ''
        },
    },
    methods: {
        updateValue (value, fieldname) {
            this.$store.commit(this.config.store_key, {
                model: this.config.view.model,
                dataId: this.config.dataId,
                fieldname: fieldname || this.name,
                value
            })
        }
    },
};
