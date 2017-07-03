/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import {FormMixin, ThumbnailMixin, ListMixin} from '../common';
import {RelationShip, RelationShipX2MList, RelationShipX2MThumbnail} from './common';
import {dispatchAll} from '../../store';
import {json_post} from '../../server-call';

export const FieldListOne2Many = Vue.component('furet-ui-list-field-one2many', {
    mixins: [ListMixin, RelationShip, RelationShipX2MList],
})

export const FieldThumbnailOne2Many = Vue.component('furet-ui-thumbnail-field-one2many', {
    mixins: [ThumbnailMixin, RelationShip, RelationShipX2MThumbnail],
})

export const View = Vue.component('furet-ui-x2m-view', {
    props: ['model', 'views', 'viewId', 'dataIds', 'dataId', 'isReadonly', 'x2oField', 'x2oFieldId'],
    render: function(createElement) {
        let view = plugin.get(['views', 'x2m-type', this.view.viewType]);
        if (!view) view = plugin.get(['views', 'Unknown']).vue;
        return createElement(view, {
            props: {
                model: this.model,
                views: this.views,
                viewId: this.viewId,
                view: this.view,
                viewName: this.view.viewType,
                dataIds: this.dataIds,
                dataId: this.dataId,
                data: this.data,
                change: this.change,
                isReadonly: this.isReadonly,
                x2oField: this.x2oField,
                x2oFieldId: this.x2oFieldId,
            },
            on: {
                changeView: this.changeView,
                updateDataIds: this.updateDataIds,
            },
        });
    },
    computed: {
        view () {
            const views = this.$store.state.data.views;
            if (this.viewId) return views[String(this.viewId)] || {};
            return {};
        },
        data () {
            if (this.model) {
                let data = this.$store.state.data.data;
                let changes = this.$store.state.data.changes;

                if (this.dataId) {
                    data = (data[this.model]) ? data[this.model][String(this.dataId)] || {} : {};
                    if (changes[this.model] && changes[this.model][String(this.dataId)] != undefined) changes = changes[this.model][String(this.dataId)];
                    else if (changes.new && changes.new[this.model] && changes.new[this.model][String(this.dataId)] != undefined) changes = changes.new[this.model][String(this.dataId)];
                    else changes = {};
                    return Object.assign({}, data, changes);
                }
                const d = {};
                _.each(this.dataIds, dataId => {
                    const _data = (data[this.model]) ? data[this.model][String(dataId)] || {} : {};
                    let _changes = {};
                    if (changes[this.model] && changes[this.model][String(dataId)] != undefined) _changes = changes[this.model][String(dataId)];
                    else if (changes.new && changes.new[this.model] && changes.new[this.model][String(dataId)] != undefined) _changes = changes.new[this.model][String(dataId)];
                    d[dataId] = Object.assign({}, _data, _changes);
                });
                return d;
            }
            return {};
        },
        change () {
            if (this.dataId) {
                const changes = this.$store.state.data.changes;
                if (changes[this.model] && changes[this.model][String(this.dataId)] != undefined) return changes[this.model][String(this.dataId)];
                else if (changes.new && changes.new[this.model] && changes.new[this.model][String(this.dataId)] != undefined) return changes.new[this.model][String(this.dataId)];
            }
            return {};
        },
    },
    methods: {
        changeView (viewId, dataId) {
            this.$emit('changeView', viewId, dataId);
        },
        updateDataIds (dataIds) {
            this.$emit('updateDataIds', dataIds);
        },
    },
});

export const FieldFormOne2Many = Vue.component('furet-ui-form-field-one2many', {
    mixins: [FormMixin, RelationShip],
    props: ['model', 'views', 'x2oField'],
    template: `
        <div v-if="this.isInvisible" />
        <b-tooltip 
            v-bind:label="getTooltip" 
            v-bind:position="tooltipPosition"
            v-bind:style="{'width': '100%'}"
            v-else
        >
            <b-field 
                v-bind:label="label"
                v-bind:type="getType"
                v-bind:message="getMessage"
                v-bind:style="{'width': 'inherit'}"
            >
                <furet-ui-x2m-view 
                    v-bind:model="model"
                    v-bind:views="views"
                    v-bind:viewId="viewId"
                    v-bind:dataIds="dataIds"
                    v-bind:dataId="dataId"
                    v-bind:isReadonly="isReadonly"
                    v-bind:x2oField="x2oField"
                    v-bind:x2oFieldId="config.dataId"
                    v-on:changeView="changeView"
                    v-on:updateDataIds="updateDataIds"
                />
            </b-field>
        </b-tooltip>`,
    data () {
        return {
            viewId: this.views && this.views[0] && this.views[0].viewId,
            dataId: null,
        }
    },
    created () {
        json_post('/field/x2m/get/views', {viewIds: _.map(this.views, v => v.viewId)}, {
            onSuccess: (result) => {
                dispatchAll(result);
            }
        });
    },
    computed: {
        dataIds () {
            return this.config && this.config.data && this.config.data[this.name] || [];
        },
        view () {
            return this.$store.state.data.view[this.viewId];
        },
    },
    methods: {
        changeView (viewId, dataId) {
            this.viewId = viewId;
            this.dataId = dataId;
        },
        updateDataIds (dataIds) {
            this.updateValue(dataIds)
        },
    },
})
