/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import {FormMixin, ThumbnailMixin, ListMixin} from './common';
import PictureInput from 'vue-picture-input';


export const FieldListFile = Vue.component('furet-ui-list-field-file', {
    mixins: [ListMixin],
    template: `
        <span v-if="isInvisible" />
        <a
            v-else
            v-bind:href="value"
            v-on:click.stop="onClick"
            v-bind:download="filename"
            v-bind:title="filename"
            target="_blank"
        >
            <figure class="['image', value ? '' : 'is-64x64']">
                <img
                    v-bind:src="value" 
                    v-bind:alt="filename"
                />
            </figure>
        </a>`,
    computed: {
        filename () {
            return this.row[this.header.filename] || '';
        },
    },
    methods: {
        onClick () {
            console.log('plop');
        },
    },
})

export const FieldThumbnailFile = Vue.component('furet-ui-thumbnail-field-file', {
    props: ['name', 'label', 'data', 'invisible', 'tooltip', 'tooltip_position'],
    mixins: [ThumbnailMixin],
    template: `
        <div v-if="this.isInvisible" />
        <b-tooltip 
            v-bind:label="getTooltip" 
            v-bind:position="tooltipPosition"
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

export const FieldFormFile = Vue.component('furet-ui-form-field-file', {
    props: ['name', 'label', 'config', 'invisible', 'tooltip', 'tooltip_position',
            'readonly', 'required', 'filename', 'accept', 'width', 'height', 'size'],
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
                <picture-input
                    ref="pictureInput"
                    v-on:change="onChange"
                    v-bind:accept="accept"
                    v-bind:width="width"
                    v-bind:height="height"
                    v-bind:size="size"
                />
            </b-field>
        </b-tooltip>`,
    components: {
        PictureInput,
    },
    methods: {
        onChange () {
            console.log('New picture selected!')
            if (this.$refs.pictureInput.image) {
                console.log('Picture loaded.')
            } else {
                console.log('FileReader API not supported: use the <form>, Luke!')
            }
        },
    },
})
