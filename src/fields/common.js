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


export const ThumbnailMixin = {
    computed: {
        value () {
            return this.data && this.data[this.name] || '';
        },
        isInvisible () {
            const invisible = this.params && this.params.invisible || false;
            return safe_eval(invisible, this.config && this.config.data || {});
        },
        getTooltip () {
            return this.params && this.params.tooltip || '';
        },
        tooltipPosition () {
            return this.params && this.params.tooltip_position || 'is-top';
        },
    },
};


export const FormMixin = {
    computed: {
        data () {
            return this.config && this.config.data && this.config.data[this.name] || '';
        },
        isReadonly () {
            const readonlyParams = safe_eval(
                    this.params && this.params.readonly || 'false', 
                    this.data && this.data.config || {});
            const readonly = this.config && this.config.mode == 'readonly';
            return readonly || readonlyParams;
        },
        isRequired () {
            const required = this.params && this.params.required || false;
            return safe_eval(required, this.config && this.config.data || {});
        },
        isInvisible () {
            const invisible = this.params && this.params.invisible || false;
            return safe_eval(invisible, this.config && this.config.data || {});
        },
        getTooltip () {
            return this.params && this.params.tooltip || '';
        },
        tooltipPosition () {
            return this.params && this.params.tooltip_position || 'is-top';
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
            console.log(value)
            this.$store.commit('UPDATE_CHANGE', {
                model: this.config.view.model,
                dataId: this.config.dataId,
                fieldname: this.name,
                value
            })
        }
    },
};
