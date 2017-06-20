/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import plugin from './plugin';
import Vue from 'vue';

/**
 * return the component for viewType and fieldType
**/
export const View = Vue.component('furet-ui-field', {
    props: ['config', 'viewType', 'parentProps'],
    render: function(createElement) {
        let field = plugin.get(['field', this.viewType, this.fieldType]);
        if (!field) {
            field = plugin.get(['field', 'Unknown']);
            console.log('furet-ui-field', this.viewType, this.fieldType)
        }
        console.log(field, this.config, this.parentProps)
        return createElement(field, {
            props: {
                config: this.config,
                parentProps: this.parentProps,
            },
        });
    },
    computed: {
    },
});
