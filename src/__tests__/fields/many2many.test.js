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
import {FieldListMany2Many, FieldThumbnailMany2Many, FieldFormMany2Many} from '../../fields/relationship/many2many'

describe('Many2Many list component', () => {
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
            render: h => h(FieldListMany2Many, {props: {
                row: {fieldname: ['1']},
                header: {name: 'fieldname', model: 'Test', display: 'fields.name'},
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render without data 1', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldListMany2Many, {props: {
                row: {},
                header: {name: 'fieldname', model: 'Test', display: 'fields.name'},
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render without data 2', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldListMany2Many, {props: {
                row: {fieldname: ['1']},
                header: {name: 'fieldname', model: 'Test', display: 'fields.name'},
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
            render: h => h(FieldListMany2Many, {props: {
                row: {fieldname: ['1']},
                header: {name: 'fieldname', invisible: true, model: 'Test', display: 'fields.name'},
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
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
            render: h => h(FieldListMany2Many, {props: {
                row: {fieldname: ['1']},
                header: {name: 'fieldname', invisible: false, model: 'Test', display: 'fields.name'},
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
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
            render: h => h(FieldListMany2Many, {props: {
                row: {fieldname: ['1'], invisible: true},
                header: {name: 'fieldname', invisible: 'fields.invisible', model: 'Test', display: 'fields.name'},
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
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
            render: h => h(FieldListMany2Many, {props: {
                row: {fieldname: ['1'], invisible: false},
                header: {name: 'fieldname', invisible: 'fields.invisible', model: 'Test', display: 'fields.name'},
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render fieldcolor', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldListMany2Many, {props: {
                row: {fieldname: ['1']},
                header: {name: 'fieldname', fieldcolor: 'color', model: 'Test', display: 'fields.name'},
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test', color: '#123456'}},
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
});

describe('Many2Many Thumbnail component', () => {
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
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: ['1']},
                name: 'fieldname',
                model: 'Test',
                display: 'fields.name',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render without data 1', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {},
                name: 'fieldname',
                model: 'Test',
                display: 'fields.name',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render without data 1', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: 1},
                name: 'fieldname',
                model: 'Test',
                display: 'fields.name',
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
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: ['1']},
                name: 'fieldname',
                invisible: true,
                model: 'Test',
                display: 'fields.name',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
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
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: ['1']},
                name: 'fieldname',
                invisible: false,
                model: 'Test',
                display: 'fields.name',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
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
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: ['1'], invisible: true},
                name: 'fieldname',
                invisible: 'fields.invisible',
                model: 'Test',
                display: 'fields.name',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
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
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: ['1'], invisible: false},
                name: 'fieldname',
                invisible: 'fields.invisible',
                model: 'Test',
                display: 'fields.name',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
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
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: ['1']},
                name: 'fieldname',
                label: 'The label',
                model: 'Test',
                display: 'fields.name',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
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
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: ['1']},
                name: 'fieldname',
                tooltip: 'The tooltip',
                model: 'Test',
                display: 'fields.name',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
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
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: ['1']},
                name: 'fieldname',
                tooltip: 'The left tooltip',
                tooltip_position: 'is-left',
                model: 'Test',
                display: 'fields.name',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test'}},
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render with fieldcolor', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(FieldThumbnailMany2Many, {props: {
                data: {fieldname: ['1']},
                name: 'fieldname',
                model: 'Test',
                display: 'fields.name',
                fieldcolor: 'color',
            }}),
        });
        store.commit({
            type: 'UPDATE_DATA',
            model: 'Test',
            data: {'1': {name: 'Test', color: '#123456'}},
        });
        Vue.nextTick(() => {
            renderer.renderToString(vm, (err, str) => {
                expect(str).toMatchSnapshot();
            });
        });
    });
});

