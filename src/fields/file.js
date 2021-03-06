/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import {FormMixin, ThumbnailMixin, ListMixin} from './common';


export const FieldListFile = Vue.component('furet-ui-list-field-file', {
    mixins: [ListMixin],
    template: `
        <div>
            <span v-if="isInvisible" />
            <a
                v-else
                v-bind:href="value"
                v-bind:download="getFilename"
                v-bind:title="getFilename"
                target="_blank"
            >
                <div v-bind:style="{'max-width': width}">
                    <figure class="image">
                        <img 
                            v-bind:src="value" 
                            v-bind:alt="getFilename"
                        />
                    </figure>
                </div>
            </a>
        </div>`,
    computed: {
        getFilename () {
            return this.row[this.header.filename] || '';
        },
        width () {
            return this.header.width;
        },
    },
})

export const FieldThumbnailFile = Vue.component('furet-ui-thumbnail-field-file', {
    props: ['filename', 'width'],
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
                <div 
                    class="field" 
                    v-bind:style="{'max-width': width}"
                >
                    <a
                        v-bind:href="value"
                        v-bind:download="getFilename"
                        v-bind:title="getFilename"
                        v-on:click.stop="() => {}"
                        target="_blank"
                    >
                        <figure class="image">
                            <img 
                                v-bind:src="value" 
                                v-bind:alt="getFilename"
                            />
                        </figure>
                    </a>
                </div>
            </b-field>
        </b-tooltip>`,
    computed: {
        getFilename () {
            return this.data[this.filename] || '';
        },
    },
})

export const onClickDelete = (obj) => {
    obj.updateValue('');
    if (obj.filename) obj.updateValue('', obj.filename);
    if (obj.filesize) obj.updateValue(0, obj.filesize);
};
export const updateFile = (obj, file, value) => {
    obj.updateValue(value);
    if (obj.filename) obj.updateValue(file.name, obj.filename);
    if (obj.filesize) obj.updateValue(file.size, obj.filesize);
}

export const FieldFormFile = Vue.component('furet-ui-form-field-file', {
    props: ['filename', 'accept', 'filesize', 'width'],
    mixins: [FormMixin],
    template: `
        <div>
            <div v-if="this.isInvisible" />
            <div v-else>
                <b-tooltip 
                    v-bind:label="getTooltip" 
                    v-bind:position="tooltipPosition"
                    v-bind:style="{'width': '100%'}"
                >
                    <b-field 
                        v-bind:label="this.label"
                        v-bind:type="getType"
                        v-bind:message="getMessage"
                        v-bind:style="{'width': 'inherit'}"
                    >
                        <div 
                            class="field" 
                            v-bind:style="{'max-width': width}"
                        >
                            <figure class="image">
                                <img 
                                    v-bind:src="data" 
                                    v-bind:alt="getFilename"
                                />
                            </figure>
                        </div>
                    </b-field>
                </b-tooltip>
                <div class="field has-addons">
                    <p class="control">
                        <b-tooltip v-bind:label="$t('fields.file.upload')" >
                            <a 
                                class="button" 
                                v-if="!isReadonly"
                                v-on:click="() => {this.$refs.fileInput.click()}"
                            >
                                <input 
                                    v-bind:style="{'display': 'none'}"
                                    ref="fileInput"
                                    type="file"
                                    v-on:change="onFileChange"
                                    v-bind:accept="accept"
                                />
                                <span class="icon is-small">
                                    <i class="fa fa-upload"></i>
                                </span>
                            </a>
                        </b-tooltip>
                    </p>
                    <p class="control">
                        <b-tooltip v-bind:label="$t('fields.file.download')" >
                            <a 
                                class="button" 
                                v-if="data"
                                v-bind:href="data"
                                v-bind:download="getFilename"
                                v-bind:title="getFilename"
                                target="_blank"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-download"></i>
                                </span>
                            </a>
                        </b-tooltip>
                    </p>
                    <p class="control">
                        <b-tooltip v-bind:label="$t('fields.file.delete')" >
                            <a 
                                v-if="!isReadonly && data"
                                class="button" 
                                v-on:click="onClickDelete"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-trash"></i>
                                </span>
                            </a>
                        </b-tooltip>
                    </p>
                </div>
            </div>
        </div>`,
    computed: {
        getFilename () {
            return this.config && this.config.data && this.config.data[this.filename] || '';
        },
    },
    methods: {
        onClickDelete () {
            onClickDelete(this);
        },
        onFileChange (e) {
            const files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            const reader = new FileReader(), self = this;
            reader.onload = (e) => {
                updateFile(self, files[0], e.target.result);
            };
            reader.readAsDataURL(files[0]);
        },
    },
})
