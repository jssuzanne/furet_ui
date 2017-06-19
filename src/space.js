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
            if (menu.actionId) {
                json_post('/action/' + menu.actionId, {}, {
                    onSuccess: (results) => {
                        dispatchAll(results)
                    }
                });
            }
            dispatchAll([
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
            <div class="column">
                <nav class="nav">
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
                <router-view></router-view>
            </div>
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
    props: ['spaceId', 'menuId'],
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
        }
    },
});
