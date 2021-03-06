/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import {FormMixin, ThumbnailMixin, ListMixin} from './common';
import { VueEditor } from 'vue2-editor'

export const FieldListRichText = Vue.component('furet-ui-list-field-richtext', {
    mixins: [ListMixin],
    template: `
        <div>
            <span v-if="isInvisible" />
            <div 
                v-else 
                class="content is-small"
                v-html="value" 
                v-bind:style="{width: '100%'}"
            />
        </div>`,
})

export const FieldThumbnailRichText = Vue.component('furet-ui-thumbnail-field-richtext', {
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
                <div 
                    class="box content is-small"
                    v-html="value" 
                    v-bind:style="{width: '100%'}"
                />
            </b-field>
        </b-tooltip>`,
})

export const FieldFormRichText = Vue.component('furet-ui-form-field-richtext', {
    props: ['placeholder'],
    mixins: [FormMixin],
    template: `
        <div>
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
                    <div
                        class="box content is-small"
                        v-if="isReadonly"
                        v-html="data"
                    />
                    <vue-editor 
                        v-else
                        v-bind:placeholder="placeholder"
                        v-model="data"
                    />
                </b-field>
            </b-tooltip>
        </div>`,
    components: {
        VueEditor
    },
    computed: {
        data: {
            get: function () {
                return this.config && this.config.data && this.config.data[this.name] || null;
            },
            set: function (value) {
                this.updateValue(value);
            },
        },
    },
})
