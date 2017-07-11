/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import chai from 'chai';
import Vue from 'vue';
import Buefy from 'buefy';
Vue.use(Buefy, {defaultIconPack: 'fa',});
import {store} from '../../store';
import {router} from '../../routes';
import {i18n} from '../../i18n';
import {ThumbnailView, addNewDataId, selectCardDataId,
        X2MThumbnailView, addNewX2MDataId, updateValueX2M} from '../../views/thumbnail';
import '../../views/search';
import '../../fields';
import '../../space';

jest.mock('../../server-call')

const views = [
    {
        viewId: '1',
        viewType: 'Thumbnail',
    },
    {
        viewId: '2',
        viewType: 'Thumbnail',
    },
    {
        viewId: '3',
        viewType: 'Form',
        unclickable: true,
    },
    {
        viewId: '4',
        viewType: 'Unknown',
    },
];

const view_thumbnail = {
    viewId: '1',
    viewType: 'Thumbnail',
    label: 'View : 2',
    creatable: true,
    onSelect: '3',
    model: 'Test',
    search: [],
    template: `
        <div class="columns is-multiline is-mobile">
            <div class="column is-4">
                <furet-ui-thumbnail-field-boolean
                    v-bind:data="card"
                    name="bool"
                    label="Boolean"
                />
            </div>
            <div class="column is-8">
                <furet-ui-thumbnail-field-string
                    v-bind:data="card"
                    name="name"
                    label="Label"
                />
            </div>
            <div class="column is-6">
                <furet-ui-thumbnail-field-selection
                    v-bind:data="card"
                    name="state"
                    label="State"
                    v-bind:selections="{'new': 'New'}"
                />
            </div>
            <div class="column is-6">
                <furet-ui-thumbnail-field-integer
                    v-bind:data="card"
                    name="id"
                    label="ID"
                />
            </div>
        </div>
    `,
    buttons: [],
    fields: ["id", "name", "bool", "state"],
}

const dataIds = ['1', '2', '3'];
const dataIds2 = ['1', '2', '3', 'newId'];

const data = {
    '1': {
        id: 1,
        name: 'Label 1',
        state: 'new',
        bool: true,
    },
    '2': {
        id: 2,
        name: 'Label 2',
        state: 'new',
        bool: true,
    },
    '3': {
        id: 3,
        name: 'Label 3',
        state: 'new',
        bool: true,
    },
    '4': {
        id: 4,
        name: 'Label 4',
        state: 'new',
        bool: true,
    },
};

const change = {
    '1': {
        id: 1,
        name: 'Label 1 bis',
        state: 'new',
        bool: false,
    },
};

describe('furet-ui-thumbnail-view component', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    beforeEach(() => {
        store.dispatch('UNITEST_CLEAR');
        router.push({path: '/'});
    });
    it('Render without data', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(ThumbnailView, {props: {
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render with data 1', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(ThumbnailView, {props: {
                view: view_thumbnail,
                dataIds,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render with data 2', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(ThumbnailView, {props: {
                view: view_thumbnail,
                dataIds,
                data,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render with data 3', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(ThumbnailView, {props: {
                view: view_thumbnail,
                dataIds,
                data,
                change,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('addNewDataId 1', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            template: '<div />',
        });
        router.push({path: '/'});
        expect(vm.$route.path).toBe('/');
        addNewDataId({
            view: view_thumbnail,
            $router: router,
            spaceId: '1',
            menuId: '2',
            actionId: '3',
        });
        expect(vm.$route.name).toBe('space_menu_action_view_dataId');
        chai.expect(vm.$route.params).to.deep.equal({
            spaceId: '1',
            menuId: '2',
            actionId: '3',
            viewId: '3',
            dataId: vm.$route.params.dataId,
            mode: 'new',
        });
    });
    it('addNewDataId 2', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            template: '<div />',
        });
        router.push({path: '/'});
        expect(vm.$route.path).toBe('/');
        addNewDataId({
            view: view_thumbnail,
            $router: router,
            spaceId: '1',
            actionId: '3',
        });
        expect(vm.$route.name).toBe('space_action_view_dataId');
        chai.expect(vm.$route.params).to.deep.equal({
            spaceId: '1',
            menuId: undefined,
            actionId: '3',
            viewId: '3',
            dataId: vm.$route.params.dataId,
            mode: 'new',
        });
    });
    it('selectCardDataId 1', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            template: '<div />',
        });
        router.push({path: '/'});
        expect(vm.$route.path).toBe('/');
        selectCardDataId({
            view: view_thumbnail,
            $router: router,
            spaceId: '1',
            menuId: '2',
            actionId: '3',
        }, {__dataId: '4'});
        expect(vm.$route.name).toBe('space_menu_action_view_dataId');
        chai.expect(vm.$route.params).to.deep.equal({
            spaceId: '1',
            menuId: '2',
            actionId: '3',
            viewId: '3',
            dataId: '4',
            mode: 'readonly',
        });
    });
    it('selectCardDataId 2', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            template: '<div />',
        });
        router.push({path: '/'});
        expect(vm.$route.path).toBe('/');
        selectCardDataId({
            view: view_thumbnail,
            $router: router,
            spaceId: '1',
            actionId: '3',
        }, {__dataId: '4'});
        expect(vm.$route.name).toBe('space_action_view_dataId');
        chai.expect(vm.$route.params).to.deep.equal({
            spaceId: '1',
            menuId: undefined,
            actionId: '3',
            viewId: '3',
            dataId: '4',
            mode: 'readonly',
        });
    });
});

describe('furet-ui-x2m-thumbnail-view component', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    beforeEach(() => {
        store.dispatch('UNITEST_CLEAR');
        router.push({path: '/'});
    });
    it('Render without data 1', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(X2MThumbnailView, {props: {
                view: view_thumbnail,
                views: [],
            }}),
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
            render: h => h(X2MThumbnailView, {props: {
                view: view_thumbnail,
                views,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render with data 1', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(X2MThumbnailView, {props: {
                view: view_thumbnail,
                views,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render with data 2', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(X2MThumbnailView, {props: {
                view: view_thumbnail,
                views,
                viewId: '1',
                dataIds: dataIds2,
                model: 'Test',
                data,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render with data 2', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(X2MThumbnailView, {props: {
                view: view_thumbnail,
                views,
                viewId: '1',
                dataIds: dataIds2,
                model: 'Test',
                data,
                change,
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('addNewX2MDataId', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            template: '<div />',
        });
        addNewX2MDataId({
            view: view_thumbnail,
            dataIds,
            x2oField: 'x2oField',
            x2oFieldId: '1',
            $emit: (key, value) => {
                switch (key) {
                    case 'changeView':
                        expect(value).toBe('3');
                        break;
                    case 'updateDataIds':
                        expect(value.length).toBe(4);
                        break;
                    default:
                        expect('Bad key').toBe(1);
                }
            },
            updateValueX2M: (newId, values, bool) => {
                expect(values.dataId).toBe(newId);
                expect(values.x2oField).toBe('1');
                expect(bool).toBe(true);
            },
        });
    });
    it('updateValueX2M', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            template: '<div />',
        });
        updateValueX2M({
            view: view_thumbnail,
            $store: store,
        }, '1', {'x2oField': 'x2oFieldId'}, true);
        chai.expect(store.state.data.changes.new.Test['1']).to.deep.equal({x2oField: 'x2oFieldId'});
    });
});
