/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import './menus';
import './view';
import './space';

export const App = Vue.component('furet-ui', {
    template: `
        <div>
            <nav class="nav">
                <div class="nav-left">
                    <furet-ui-appbar-left-menu />
                </div>
                <div class="nav-center">
                    {{ title }}
                </div>
                <div class="nav-right">
                    <furet-ui-appbar-right-menu />
                </div>
            </nav>
            <router-view></router-view>
        </div>`,
    computed: {
        spaceId () {
            return this.$store.state.global.spaceId;
        },
        custom_view () {
            return this.$store.state.global.custom_view;
        },
        title () {
            return this.$store.state.global.title;
        }
    },
});

export default App
