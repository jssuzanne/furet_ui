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
                json_post('/action/' + menu.actionId, {}, {
                    onSuccess: (results) => {
                        dispatchAll(results)
                    }
                });
            }
            dispatchAll([
                {
                    type: 'UPDATE_SPACE',
                    spaceId: this.spaceId,
                    menuId: menu.id,
                    actionId: menu.actionId || '',
                    custom_view: menu.custom_view || '',
                },
                {
                    type: 'RESET_ACTION_MANAGER'
                },
                {
                    type: 'CLEAR_ALL_CHANGES'
                },
            ]);
        }
    }
});

                // <div v-if="space_state.actionId">
                //     <furet-ui-action-manager v-bind:actionId="space_state.actionId" />
                // </div>
                // <div v-else-if="space_state.custom_view">
                //     <furet-ui-custom-view v-bind:viewName="space_state.custom_view" />
                // </div>
                // <furet-ui-loading v-else/>
export const Space = Vue.component('furet-ui-space', {
    template: `
        <div class="columns is-gapless">
            <div v-if="isOpenLeft" class="column is-one-quarter is-half-mobile">
                <aside class="menu">
                    <furet-ui-space-menu 
                        v-bind:menus="left_menu" 
                        v-bind:menuId="menuId" 
                        v-bind:spaceId="spaceId"
                    />
                </aside>
            </div>
            <nav class="nav column">
                <div class="nav-left">
                    <a class="button" v-on:click="isOpenLeft = !isOpenLeft" v-if="left_menu.length > 0">
                        <i class="fa fa-bars fa-2x" aria-hidden="true"></i>
                    </a>
                </div>
                <div class="nav-right">
                    <a class="button" v-on:click="isOpenRight = !isOpenRight" v-if="right_menu.length > 0">
                        <i class="fa fa-bars fa-2x" aria-hidden="true"></i>
                    </a>
                </div>
            </nav>
            <div v-if="isOpenRight" class="column is-one-quarter is-half-mobile">
                <aside class="menu">
                    <furet-ui-space-menu 
                        v-bind:menus="right_menu" 
                        v-bind:menuId="menuId" 
                        v-bind:spaceId="spaceId"
                    />
                </aside>
            </div>
        </div>`,
    props: ['spaceId'],
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
        menuId () {
            return this.space_state.menuId;
        },
        left_menu () {
            return this.space_state && this.space_state.left_menu || [];
        },
        right_menu () {
            return this.space_state && this.space_state.right_menu || [];
        }
    }
});
