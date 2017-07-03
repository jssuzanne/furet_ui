/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import sinon from 'sinon';
import chai from 'chai';
import '../views';
import '../fields';
import {store} from '../store';
import {router} from '../routes';
import {i18n} from '../i18n';

test('Render App with default value from store', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    const FuretUI = require('../app').default;
    renderer.renderToString(FuretUI, (err, str) => {
        expect(str).toMatchSnapshot();
    });
});

test('Render App with default value from store', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    const App = require('../app').default;
    const vm = new Vue({
        el: document.createElement('div'),
        store,
        router,
        i18n,
        render: h => h(App),
    });
    renderer.renderToString(vm, (err, str) => {
        expect(str).toMatchSnapshot();
    });
    store.commit('UPDATE_GLOBAL', {title: 'Test'})
    renderer.renderToString(vm, (err, str) => {
        expect(str).toMatchSnapshot();
    });
});
