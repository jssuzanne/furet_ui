/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import Vuex from 'vuex';
import Buefy from 'buefy';
Vue.use(Buefy, {defaultIconPack: 'fa',});
import {store} from '../../store';
import {router} from '../../routes';
import {i18n} from '../../i18n';
import {FieldListText, FieldThumbnailText, FieldFormText} from '../../fields/text'

describe('String list component', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    beforeEach(() => {
        store.dispatch('UNITEST_CLEAR');
    });
    it('Render with data', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldListText, {props: {
                row: {fieldname: 'The text'},
                header: {name: 'fieldname'},
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render without data', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldListText, {props: {
                row: {},
                header: {name: 'fieldname'},
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible is True', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldListText, {props: {
                row: {fieldname: 'The text'},
                header: {name: 'fieldname', invisible: true},
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible is false', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldListText, {props: {
                row: {fieldname: 'The text'},
                header: {name: 'fieldname', invisible: false},
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible condition is true', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldListText, {props: {
                row: {fieldname: 'The text', invisible: true},
                header: {name: 'fieldname', invisible: 'fields.invisible'},
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible condition is false', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldListText, {props: {
                row: {fieldname: 'The text', invisible: false},
                header: {name: 'fieldname', invisible: 'fields.invisible'},
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
});

describe('String Thumbnail component', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    beforeEach(() => {
        store.dispatch('UNITEST_CLEAR');
    });
    it('Render', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailText, {props: {
                data: {fieldname: 'The text'},
                name: 'fieldname',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render without data', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailText, {props: {
                data: {},
                name: 'fieldname',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible is True', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailText, {props: {
                data: {fieldname: 'The text'},
                name: 'fieldname',
                invisible: true,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible is false', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailText, {props: {
                data: {fieldname: 'The text'},
                name: 'fieldname',
                invisible: false,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible condition is true', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailText, {props: {
                data: {fieldname: 'The text', invisible: true},
                name: 'fieldname',
                invisible: 'fields.invisible',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible condition is false', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailText, {props: {
                data: {fieldname: 'The text', invisible: false},
                name: 'fieldname',
                invisible: 'fields.invisible',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render label', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailText, {props: {
                data: {fieldname: 'The text'},
                name: 'fieldname',
                label: 'The label',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render tooltip up', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailText, {props: {
                data: {fieldname: 'The text'},
                name: 'fieldname',
                tooltip: 'The tooltip',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render tooltip left', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailText, {props: {
                data: {fieldname: 'The text'},
                name: 'fieldname',
                tooltip: 'The left tooltip',
                tooltip_position: 'is-left',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
});

describe('String Form component', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    beforeEach(() => {
        store.dispatch('UNITEST_CLEAR');
    });
    it('Render', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text'}},
                name: 'fieldname',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render without data', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {}},
                name: 'fieldname',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible is True', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text'}},
                name: 'fieldname',
                invisible: true,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible is false', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text'}},
                name: 'fieldname',
                invisible: false,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible condition is true', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text', invisible: true}},
                name: 'fieldname',
                invisible: 'fields.invisible',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render invisible condition is false', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text', invisible: false}},
                name: 'fieldname',
                invisible: 'fields.invisible',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render label', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text'}},
                name: 'fieldname',
                label: 'The label',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render tooltip up', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text'}},
                name: 'fieldname',
                tooltip: 'The tooltip',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render tooltip left', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text'}},
                name: 'fieldname',
                tooltip: 'The left tooltip',
                tooltip_position: 'is-left',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render mode readonly by config', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text'}, mode: 'readonly'},
                name: 'fieldname',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render mode readonly param', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text'}},
                name: 'fieldname',
                readonly: true,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render mode readonly conditional param', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text', readonly: 1}},
                name: 'fieldname',
                readonly: 'fields.readonly',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render required', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text'}},
                name: 'fieldname',
                required: true,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render required conditionnal', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {fieldname: 'The text', required: true}},
                name: 'fieldname',
                required: 'fields.required',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render required without value', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {}},
                name: 'fieldname',
                required: true,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render placeholder', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {}},
                name: 'fieldname',
                placeholder: 'The placeholder'
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render maxlength', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldFormText, {props: {
                config: {data: {}},
                name: 'fieldname',
                maxlength: 200,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
});
