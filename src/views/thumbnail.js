/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import plugin from '../plugin';
import {json_post_dispatch_all} from '../server-call';
import {getNewID} from '../view';
import _ from 'underscore';

/**
 * Add Icon for Thumbnail view
**/
export const ThumbnailViewIcon = Vue.component('furet-ui-thumbnail-view-icon', {
    template: '<i class="fa fa-th"></i>',
});

plugin.set(['views', 'icon'], {Thumbnail: 'furet-ui-thumbnail-view-icon'})

export const addNewDataId = (obj) => {
    if (obj.view.onSelect) {
        obj.$router.push({
            name: obj.menuId ? 'space_menu_action_view_dataId' : 'space_action_view_dataId',
            params: {
                spaceId: obj.spaceId,
                menuId: obj.menuId,
                actionId: obj.actionId,
                viewId: obj.view.onSelect,
                dataId: getNewID(obj.view.model),
                mode: 'new',
            }
        });
    }
};
export const selectCardDataId = (obj, card) => {
    if (obj.view.onSelect) {
        obj.$router.push({
            name: obj.menuId ? 'space_menu_action_view_dataId' : 'space_action_view_dataId',
            params: {
                spaceId: obj.spaceId,
                menuId: obj.menuId,
                actionId: obj.actionId,
                viewId: obj.view.onSelect,
                dataId: card.__dataId,
                mode: 'readonly',
            }
        });
    }
}

export const ThumbnailView = Vue.component('furet-ui-thumbnail-view', {
    props: ['spaceId', 'menuId', 'actionId','viewId', 'view', 'viewName', 'dataId', 'mode', 'dataIds', 'data', 'change', 'column_size'],
    template: `
        <div>
            <nav class="level">
                <div class="level-left">
                    <div class="field has-addons">
                        <p class="control" v-if="view && view.creatable">
                            <a  class="button"
                                v-on:click="addNew"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-plus"></i>
                                </span>
                                <span>{{$t('views.common.create')}}</span>
                            </a>
                        </p>
                        <p class="control" 
                            v-if="view && (view.buttons || []).length >0"
                        >
                            <b-dropdown>
                                <button class="button" slot="trigger">
                                    <span>{{$t('views.common.actions')}}</span>
                                    <span class="icon is-small">
                                        <i class="fa fa-caret-down"></i>
                                    </span>
                                </button>
                                <b-dropdown-option 
                                    v-for="button in view.buttons"
                                    v-bind:value="button.buttonId"
                                    v-bind:key="button.buttonId"
                                    v-on:change="selectAction(button.buttonId)"
                                >
                                    {{button.label}}
                                </b-dropdown-option>
                            </b-dropdown>
                        </p>
                    </div>
                </div>
                <div class="level-right">
                    <furet-ui-search-bar-view v-bind:search="search" v-model="filter"/>
                </div>
            </nav>
            <div class="columns is-multiline is-mobile">
                <div v-bind:class="['column', view.column_size || 'is-12-mobile is-one-third-tablet is-one-quarter-desktop']"
                     v-for="card in tableData"
                >
                    <article class="box" v-on:click.stop="selectCard(card)">
                        <component v-bind:is="thumbnail_card" v-bind:card="card"/>
                    </article>
                </div>
            </div>
        </div>
    `,
    data: () => {
        return {
            filter: {},
        };
    },
    created: function () {
        if (this.view) this.getData();
    },
    computed: {
        tableData () {
            const dataIds = this.dataIds ? this.dataIds : _.keys(this.data || {});
            return _.map(dataIds, dataId => Object.assign(
                {__dataId: dataId}, 
                (this.data || {})[dataId], 
                (this.change || {})[dataId]
            ));
        },
        thumbnail_card () {
            if (this.view) {
                return {
                    template: this.view.template,
                    props: ['card'],
                };
            }
            return {
                template: '<div></div>'
            };
        },
        search () {
            if (this.view) {
                return this.view.search;
            }
            return {};
        },
    },
    methods: {
        getData () {
            json_post_dispatch_all('/thumbnail/get', {model: this.view.model, filter: this.filter, fields: this.view.fields, viewId: this.viewId});
        },
        addNew () {
            addNewDataId(this);
        },
        selectCard (card) {
            selectCardDataId(this, card);
        }
    }
});

plugin.set(['views', 'type'], {Thumbnail: 'furet-ui-thumbnail-view'});

export const addNewX2MDataId = (obj) => {
    if (obj.view.onSelect) {
        const newId = getNewID(obj.view.model)
        const dataIds = obj.dataIds.slice(0);
        dataIds.push(newId);
        const values = {dataId: newId};
        if (obj.x2oField != undefined) values[obj.x2oField] = obj.x2oFieldId;
        obj.updateValueX2M(newId, values, true);
        obj.$emit('updateDataIds', dataIds);
        obj.$emit('changeView', obj.view.onSelect, newId);
    }
}
export const updateValueX2M = (obj, dataId, values, create) => {
    if (create) obj.$store.commit('CREATE_CHANGE_X2M', {model: obj.view.model, dataId});
    _.each(_.keys(values), fieldname => {
        obj.$store.commit('UPDATE_CHANGE_X2M', {
            model: obj.view.model,
            dataId,
            fieldname,
            value: values[fieldname],
        });
    });
}

export const X2MThumbnailView = Vue.component('furet-ui-x2m-thumbnail-view', {
    props: ['model', 'views', 'viewId', 'view', 'dataIds', 'dataId', 'data', 'change', 'isReadonly', 'x2oField', 'x2oFieldId'],
    template: `
        <div>
            <nav class="level">
                <div class="level-left">
                    <div class="field has-addons" v-if="!isReadonly">
                        <p class="control" v-if="view && view.creatable">
                            <a  class="button"
                                v-on:click="addNew"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-plus"></i>
                                </span>
                                <span>{{$t('views.common.create')}}</span>
                            </a>
                        </p>
                    </div>
                </div>
                <div class="level-right">
                    <furet-ui-view-selector
                        v-bind:views="views"
                        v-bind:viewId="viewId"
                        v-on:changeView="changeView"
                    />
                </div>
            </nav>
            <div class="columns is-multiline is-mobile">
                <div v-bind:class="['column', view.column_size || 'is-12-mobile is-one-half-tablet is-one-third-desktop']"
                     v-for="card in tableData"
                >
                    <article class="box" v-on:click.stop="selectCard(card)">
                        <component v-bind:is="thumbnail_card" v-bind:card="card"/>
                    </article>
                </div>
            </div>
        </div>
    `,
    created () {
        const changes = this.$store.state.data.changes.new || {};
        const newIds = _.keys(changes[this.model] || {});
        json_post_dispatch_all('/list/x2m/get', {model: this.model, fields: this.view.fields, dataIds: _.filter(this.dataIds, dataId => newIds.indexOf(dataId) == -1)});
    },
    computed: {
        tableData () {
            return _.map(this.dataIds, dataId => Object.assign(
                {__dataId: dataId}, 
                (this.data || {})[dataId], 
                (this.change || {})[dataId]
            ));
        },
        thumbnail_card () {
            if (this.view) {
                return {
                    template: this.view.template,
                    props: ['card'],
                };
            }
            return {
                template: '<div></div>'
            };
        },
    },
    methods: {
        addNew () {
            addNewX2MDataId(this);
        },
        selectCard (card) {
            if (this.view.onSelect) {
                this.$emit('changeView', this.view.onSelect, card.__dataId);
            }
        },
        changeView(viewId) {
            this.$emit('changeView', viewId);
        },
        updateValueX2M(dataId, values, create) {
            updateValueX2M(this, dataId, values, create);
        },
    }
});

plugin.set(['views', 'x2m-type'], {Thumbnail: 'furet-ui-x2m-thumbnail-view'});
