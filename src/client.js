/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import Buefy from 'buefy';
import VueI18n from 'vue-i18n';
import 'buefy/lib/buefy.css';
import 'bulma/css/bulma.css'
import { sync } from 'vuex-router-sync';
import "font-awesome-loader";
import {json_post} from './server-call';
import plugin from './plugin';
import defaultI18n from './i18n';
import './views';
// import './fields';
import './app';

Vue.use(Buefy);
Vue.use(VueI18n);

import {store, dispatchAll} from './store';
import router from './routes';
sync(store, router)  // use vue-router with vuex

plugin.set([], {initData: (router, store) => {
    json_post('/init/required/data', {}, {
        onSuccess: (result) => {
            dispatchAll(router, result);
        },
        onError: (error, response) => {
            console.error('call initial required data', error || response.body)
        },
        onComplete: (error, response) => {
            json_post('/init/optionnal/data', {}, {
                onSuccess: (result) => {
                    dispatchAll(router, result);
                },
                onError: (error, response) => {
                    console.error('call initial optional data', error || response.body)
                },
            });
        },
    });
}});

const i18n = new VueI18n(defaultI18n);

const FuretUI = new Vue({
    el: '#furet-ui-app',
    template: '<furet-ui></furet-ui>',
    store,
    router,
    i18n,
    created: () => {
        const initData = plugin.get(['initData']);
        if (initData) initData(router, store);
    },
})

window.plugin = plugin;
window.FuretUI = FuretUI;
export default FuretUI;
