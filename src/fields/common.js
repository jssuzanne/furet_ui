/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/


export const safe_eval = (condition, fields) => {
    return eval(condition) ? true : false;
}


export const ListMixin = {
    props: ['row', 'index', 'header'],
    computed: {
        value () {
            return this.row[this.header.name] || '';
        },
        isInvisible () {
            return safe_eval(this.header.invisible, this.row || {});
        },
    },
};


export const ThumbnailMixin = {
    computed: {
        value () {
            return this.data && this.data[this.name] || '';
        },
        isInvisible () {
            return safe_eval(this.invisible, this.config && this.config.data || {});
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
        updateValue (value) {
            this.$store.commit('UPDATE_CHANGE', {
                model: this.config.view.model,
                dataId: this.config.dataId,
                fieldname: this.name,
                value
            })
        }
    },
};
