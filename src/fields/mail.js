/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import {FormMixin, ThumbnailMixin, ListMixin} from './common';

export const FieldListMail = Vue.component('furet-ui-list-field-mail', {
    mixins: [ListMixin],
})

export const FieldThumbnailMail = Vue.component('furet-ui-thumbnail-field-mail', {
    mixins: [ThumbnailMixin],
})

export const FieldFormMail = Vue.component('furet-ui-form-field-mail', {
    props: ['maxlength', 'placeholder', 'icon'],
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
                    type="email"
                    step="1"
                    v-bind:value="data" 
                    v-on:change="updateValue"
                    v-bind:maxlength="maxlength"
                    v-bind:placeholder="placeholder"
                    icon-pack="fa"
                    v-bind:icon="icon"
                >
                </b-input>
            </b-field>
        </b-tooltip>`,
})
