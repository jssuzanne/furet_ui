/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import {dispatchAll} from './store';
import {json_post} from './server-call';

Vue.component('furet-ui-space-menu', {
    template: `
        <ul class="menu-list">
            <li v-for="menu in menus">
                <span v-if="(menu.submenus || []).length != 0">
                    <furet-ui-picture 
                        v-bind:type="menu.image.type"
                        v-bind:value="menu.image.value"
                    />
                    {{menu.label}}
                </span>
                <furet-ui-space-menu 
                    v-if="(menu.submenus || []).length != 0"
                    v-bind:menus="menu.submenus || []"
                    v-bind:menuId="menuId"
                    v-bind:spaceId="spaceId"
                />
                <a v-if="menu.actionId || menu.custom_view"
                   v-on:click="onClick(menu)"
                   v-bind:class="[menu.id == menuId ? 'is-active' : '']"
                >
                    <furet-ui-picture 
                        v-bind:type="menu.image.type"
                        v-bind:value="menu.image.value"
                    />
                    {{menu.label}}
                </a>
            </li>
        </ul>`,
    props: ['menus', 'menuId', 'spaceId'],
    methods: {
        onClick (menu) {
            if (menu.actionId) {
                this.$router.push({
                    name: 'space_menu_action',
                    params: {
                        spaceId: this.spaceId,
                        menuId: menu.id,
                        actionId: menu.actionId,
                    },
                });
            }
            dispatchAll([
                {type: 'RESET_ACTION_MANAGER'},
                {type: 'CLEAR_ALL_CHANGES'},
            ]);
        }
    }
});

export const Space = Vue.component('furet-ui-space', {
    template: `
        <div class="columns is-gapless">
            <div v-if="isOpenLeft && left_menu.length > 0" class="column is-one-quarter is-half-mobile">
                <aside class="menu">
                    <furet-ui-space-menu 
                        v-bind:menus="left_menu" 
                        v-bind:menuId="menuId" 
                        v-bind:spaceId="spaceId"
                    />
                </aside>
            </div>
            <div class="column">
                <nav class="nav">
                    <div class="nav-left">
                        <a class="button" v-on:click="isOpenLeft = !isOpenLeft" v-if="left_menu.length > 0">
                            <i class="fa fa-bars fa-2x" aria-hidden="true"></i>
                        </a>
                        <ul v-bind:style="{padding: '10px 0px', listStyle: 'none'}">
                            <li v-bind:style="{display: 'inline'}" 
                                v-for="a in actions"
                            >
                                <a v-on:click="onClick(a)">
                                    {{a.label}}
                                </a>
                                /
                            </li>
                            <li v-bind:style="{display: 'inline'}" >
                                {{action.label}}
                            </li>
                        </ul>
                    </div>
                    <div class="nav-right">
                        <div class="field has-addons" v-if="action.views.length > 0">
                            <p class="control" v-for="view in action.views">
                                <b-tooltip v-bind:label="view.type" position="is-left" type="is-info">
                                    <a class="button" 
                                        v-on:click.stop="changeView(view.viewId)"
                                        v-bind:disabled="view.viewId == viewId"
                                        v-bind:class="[view.viewId == viewId ? 'is-primary': '']"
                                    >
                                        <span class="icon is-small">
                                            <furet-ui-view-icon v-bind:type="view.type" />
                                        </span>
                                    </a>
                                </b-tooltip>
                            </p>
                        </div>
                        <a class="button" v-on:click="isOpenRight = !isOpenRight" v-if="right_menu.length > 0">
                            <i class="fa fa-bars fa-2x" aria-hidden="true"></i>
                        </a>
                    </div>
                </nav>
                <router-view></router-view>
            </div>
            <div v-if="isOpenRight && right_menu.length > 0" class="column is-one-quarter is-half-mobile">
                <aside class="menu">
                    <furet-ui-space-menu 
                        v-bind:menus="right_menu" 
                        v-bind:menuId="menuId" 
                        v-bind:spaceId="spaceId"
                    />
                </aside>
            </div>
        </div>`,
    props: ['spaceId', 'menuId', 'actionId', 'viewId'],
    data: () => {
        const data = {
            isOpenLeft: false,
            isOpenRight: false,
        }
        return data
    },
    computed: {
        space_state () {
            return this.$store.state.global.spaces[String(this.spaceId)];
        },
        left_menu () {
            return this.space_state && this.space_state.left_menu || [];
        },
        right_menu () {
            return this.space_state && this.space_state.right_menu || [];
        },
        actions () {
            return this.$store.state.global.breadscrumbs || [];
        },
        action () {
            if (this.actionId) {
                const action = this.$store.state.data.actions[String(this.actionId)];
                if (action) return {label: action.label, views: action.views || []}
           }
           return {label: '', views: []};
        }
    },
    methods: {
        changeView (viewId) {
            this.$store.commit('CLEAR_ALL_CHANGE');
            this.$router.push({
                name: this.menuId ? 'space_menu_action_view' : 'space_action_view',
                params: {
                    spaceId: this.spaceId,
                    menuId: this.menuId,
                    actionId: this.actionId,
                    viewId
                }
            });
        },
        onClick (action) {
            this.$store.commit('REMOVE_FROM_BREADSCRUMB', {position: action.position});
            this.$store.commit('REPLACE_CHANGE', {changes: action.changes});
            this.$router.push({path: action.path});
        },
    },
});
