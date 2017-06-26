/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import plugin from '../plugin';
import Vue from 'vue';
import './string';
// import './selection';
// import './date';
// import './datetime';
// import './time';
import './integer';
// import './float';
// import './url';
// import './uuid';
// import './sequence';
// import './password';
// import './color';
// import './text';
// import './boolean';
// import './json';
// import './x2one';
// import './x2many';
// import './largebinary';

/**
 * Unknown field, used only if the wanted field is not available
**/
const Field = Vue.component('furet-ui-field-unknown', {
    props: ['config', 'values'],
    template: `
        <div>
            {{ config }}
            {{ values }}
        </div>
    `,
    computed: {
        value () {
            return this.parentProps.row[this.config.name];
        }
    }
});

plugin.set(['field'], {Unknown: 'furet-ui-field-unknown'});
