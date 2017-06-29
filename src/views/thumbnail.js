/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import plugin from '../plugin';
import {dispatchAll} from '../store';
import {json_post} from '../server-call';
import {getNewID} from '../view';

/**
 * Add Icon for Thumbnail view
**/
export const ThumbnailViewIcon = Vue.component('furet-ui-thumbnail-view-icon', {
    template: '<i class="fa fa-th"></i>',
});

plugin.set(['views', 'icon'], {Thumbnail: 'furet-ui-thumbnail-view-icon'})

export const ThumbnailView = Vue.component('furet-ui-thumbnail-view', {
    props: ['spaceId', 'menuId', 'actionId','viewId', 'view', 'viewName', 'dataId', 'mode', 'dataIds', 'data', 'change'],
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
                <div class="column is-12-mobile is-one-third-tablet is-one-quarter-desktop"
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
            json_post(
                '/thumbnail/get', 
                {
                    model: this.view.model,
                    filter: this.filter,
                    fields: this.view.fields,
                    viewId: this.viewId,
                },
                {
                    onSuccess: (results) => {
                        dispatchAll(results);
                    },
                },
            );
        },
        addNew () {
            if (this.view.onSelect) {
                this.$router.push({
                    name: this.menuId ? 'space_menu_action_view_dataId' : 'space_action_view_dataId',
                    params: {
                        spaceId: this.spaceId,
                        menuId: this.menuId,
                        actionId: this.actionId,
                        viewId: this.view.onSelect,
                        dataId: getNewID(this.view.model),
                        mode: 'new',
                    }
                });
            }
        },
        selectCard (card) {
            if (this.view.onSelect) {
                this.$router.push({
                    name: this.menuId ? 'space_menu_action_view_dataId' : 'space_action_view_dataId',
                    params: {
                        spaceId: this.spaceId,
                        menuId: this.menuId,
                        actionId: this.actionId,
                        viewId: this.view.onSelect,
                        dataId: card.__dataId,
                        mode: 'readonly',
                    }
                });
            }
        }
    }
});

plugin.set(['views', 'type'], {Thumbnail: 'furet-ui-thumbnail-view'});
