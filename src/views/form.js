/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
console.error('FIX ME, find a better way to load data')
import Vue from 'vue';
import plugin from '../plugin';
import {dispatchAll} from '../store';
import {json_post} from '../server-call';
import {getNewID} from '../view';

/**
 * Add Icon for Form view
**/
export const FormViewIcon = Vue.component('furet-ui-form-view-icon', {
    template: '<i class="fa fa-file-o"></i>',
});

plugin.set(['views', 'icon'], {Form: 'furet-ui-form-view-icon'})

export const FormView = Vue.component('furet-ui-form-view', {
    props: ['spaceId', 'menuId', 'actionId','viewId', 'view', 'viewName', 'dataId', 'mode', 'dataIds', 'data', 'change'],
    template: `
        <div>
            <nav class="level">
                <div class="level-left">
                    <div class="field has-addons">
                        <p class="control" v-if="mode == 'readonly' && view && view.creatable">
                            <a  class="button"
                                v-on:click="addNew"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-plus"></i>
                                </span>
                                <span>{{$t('views.common.create')}}</span>
                            </a>
                        </p>
                        <p class="control" v-if="mode == 'readonly' && view && view.editable">
                            <a  class="button"
                                v-on:click="openMode"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-pencil"></i>
                                </span>
                                <span>{{$t('views.common.edit')}}</span>
                            </a>
                        </p>
                        <p class="control" v-if="mode == 'readonly' && view && view.deletable">
                            <a  class="button"
                                v-on:click="deleteData"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-trash"></i>
                                </span>
                                <span>{{$t('views.common.delete')}}</span>
                            </a>
                        </p>
                        <p class="control" v-if="mode == 'readonly'">
                            <a  class="button"
                                v-on:click="closeMode"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-times"></i>
                                </span>
                                <span>{{$t('views.common.close')}}</span>
                            </a>
                        </p>
                        <p class="control" v-if="mode != 'readonly'">
                            <a  class="button"
                                v-on:click="saveData"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-floppy-o"></i>
                                </span>
                                <span>{{$t('views.common.save')}}</span>
                            </a>
                        </p>
                        <p class="control" v-if="mode != 'readonly'">
                            <a  class="button"
                                v-on:click="cancelMode"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-times"></i>
                                </span>
                                <span v-if="mode == 'new'">{{$t('views.common.close')}}</span>
                                <span v-if="mode == 'readwrite'">{{$t('views.common.cancel')}}</span>
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
            </nav>
            <section class="box">
                <component v-bind:is="form_card" v-bind:config="config"/>
            </section>
        </div>
    `,
    data: () => {
        return {
            filter: {},
        };
    },
    computed: {
        config () {
            return {
                data: this.data,
                view: this.view,
                spaceId: this.spaceId,
                menuId: this.menuId,
                actionId: this.actionId,
                viewId: this.viewId,
                dataId: this.dataId,
                mode: this.mode,
            }
        },
        form_card () {
            if (this.view) {
                json_post(
                    '/form/get', 
                    {
                        model: this.view.model,
                        id: this.dataId,
                        new: this.mode == 'new',
                        fields: this.view.fields,
                        viewId: this.viewId,
                    },
                    {
                        onSuccess: (results) => {
                            dispatchAll(results);
                        },
                    },
                );
                return {
                    template: this.view.template,
                    props: ['config'],
                };
            }
            return {
                template: '<div></div>'
            };
        },
    },
    methods: {
        addNew: function () {
            this.$router.push({
                name: this.menuId ? 'space_menu_action_view_dataId' : 'space_action_view_dataId',
                params: {
                    spaceId: this.spaceId,
                    menuId: this.menuId,
                    actionId: this.actionId,
                    viewId: this.viewId,
                    dataId: getNewID(this.view.model),
                    mode: 'new',
                }
            });
        },
        openMode: function () {
            this.$router.push({
                name: this.menuId ? 'space_menu_action_view_dataId' : 'space_action_view_dataId',
                params: {
                    spaceId: this.spaceId,
                    menuId: this.menuId,
                    actionId: this.actionId,
                    viewId: this.viewId,
                    dataId: this.dataId,
                    mode: 'readwrite',
                }
            });
        },
        closeMode: function () {
            if (this.view.onClose) {
                this.$router.push({
                    name: this.menuId ? 'space_menu_action_view' : 'space_action_view',
                    params: {
                        spaceId: this.spaceId,
                        menuId: this.menuId,
                        actionId: this.actionId,
                        viewId: this.view.onClose,
                    }
                });
            }
        },
        cancelMode: function () {
            this.$store.commit('CLEAR_CHANGE', {
                model: this.view.model,
                dataId: this.dataId,
            });
            if (this.mode == 'new') {
                if (this.view.onClose) {
                    this.$router.push({
                        name: this.menuId ? 'space_menu_action_view' : 'space_action_view',
                        params: {
                            spaceId: this.spaceId,
                            menuId: this.menuId,
                            actionId: this.actionId,
                            viewId: this.view.onClose,
                        }
                    });
                }
            } else {
                    this.$router.push({
                        name: this.menuId ? 'space_menu_action_view_dataId' : 'space_action_view_dataId',
                        params: {
                            spaceId: this.spaceId,
                            menuId: this.menuId,
                            actionId: this.actionId,
                            viewId: this.viewId,
                            dataId: this.dataId,
                            mode: 'readonly',
                        }
                    });
            }
        },
        deleteData: function () {
            json_post(
                '/data/delete', 
                { 
                    model: this.view.model, 
                    dataIds: [this.dataId],
                    path: {
                        spaceId: this.spaceId,
                        menuId: this.menuId,
                        actionId: this.actionId,
                        viewId: this.view.onClose,
                    },
                },
                {
                    onSuccess: (result) => {
                        dispatchAll(result)
                    },
                }
            )
        },
        saveData: function () {
            json_post(
                this.mode == 'new' ? '/data/create' : '/data/update', 
                {
                    model: this.view.model,
                    dataId: this.dataId,
                    data: this.change,
                    fields: this.view.fields,
                    path: {
                        spaceId: this.spaceId,
                        menuId: this.menuId,
                        actionId: this.actionId,
                        viewId: this.viewId,
                    },
                },
                {
                    onSuccess: (result) => {
                        dispatchAll(result)
                        this.$store.commit('CLEAR_CHANGE', {
                            model: this.view.model,
                            dataId: this.dataId,
                        });
                    },
                }
            )
        }
    }
});

plugin.set(['views', 'type'], {Form: 'furet-ui-form-view'});
