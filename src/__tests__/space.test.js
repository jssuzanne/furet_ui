/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import Buefy from 'buefy';
Vue.use(Buefy, {defaultIconPack: 'fa',});
import {store} from '../store';
import {router} from '../routes';
import {i18n} from '../i18n';
import '../view';
import '../views';
import '../fields';
import {ViewSelector, SpaceMenu, Space} from '../space';

jest.mock('../server-call')
const menus = [
    {
        label: 'Customer',
        image: {'type': 'font-icon', 'value': 'fa-user'},
        actionId: '2',
        id: '1',
        submenus: [],
    },
    {
        label: 'Setting',
        image: {'type': 'font-icon', 'value': 'fa-user'},
        actionId: '',
        id: '2',
        submenus: [
            {
                label: 'Category',
                image: {'type': '', 'value': ''},
                actionId: '3',
                id: '3',
                submenus: [],
            },
            {
                label: 'Address',
                image: {'type': '', 'value': ''},
                actionId: '4',
                id: '4',
                submenus: [],
            },
        ],
    },
]

describe('View Selector component', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    beforeEach(() => {
        store.dispatch('UNITEST_CLEAR');
        router.push({path: '/'});
    });
    it('Render', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(Space, {params: {
                viewId: '1',
                views: [
                    {viewId: '1', type: 'List'},
                    {viewId: '2', type: 'Form', unclickable: true},
                ],
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render unclickable selected', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(Space, {params: {
                viewId: '2',
                views: [
                    {viewId: '1', type: 'List'},
                    {viewId: '2', type: 'Form', unclickable: true},
                ],
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
});

describe('SpaceMenu component', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    beforeEach(() => {
        store.dispatch('UNITEST_CLEAR');
        router.push({path: '/'});
    });
    it('Render', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(SpaceMenu),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render with submenu', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(SpaceMenu, {props: {
                menuId: '1',
                menus,
                spaceId: '1',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
    it('Render with submenu other selected menu', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(SpaceMenu, {props: {
                menuId: '3',
                menus,
                spaceId: '1',
            }}),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
});

describe('Space component', () => {
    const renderer = require('vue-server-renderer').createRenderer();
    beforeEach(() => {
        store.dispatch('UNITEST_CLEAR');
        router.push({path: '/'});
    });
    it('Render App with default path', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            store,
            router,
            i18n,
            render: h => h(Space),
        });
        renderer.renderToString(vm, (err, str) => {
            expect(str).toMatchSnapshot();
        });
    });
});

// test('Render Space with default value from redux store with spaceId', () => {
//     const store = createStore(combineReducers(reducers));
//     updateGlobal();
//     const space = require('../space'),
//           Space = space.default;
//     const component = renderer.create(
//         <Provider store={store}>
//             <MuiThemeProvider>
//                 <Space spaceId='1'/>
//             </MuiThemeProvider>
//         </Provider>
//     );
//     store.dispatch({
//         'type': 'UPDATE_SPACE',
//         'spaceId': '1',
//         'menuId': '1',
//         'actionId': '1',
//         'viewId': '1',
//         'custom_view': '',
//     });
//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
// });
// 
// test('Render Space with default value from redux store with spaceId with menu', () => {
//     const store = createStore(combineReducers(reducers));
//     updateGlobal();
//     const space = require('../space'),
//           Space = space.default;
//     const component = shallow(
//         <Provider store={store}>
//             <MuiThemeProvider>
//                 <Space spaceId='1'/>
//             </MuiThemeProvider>
//         </Provider>
//     );
//     const getMenu = (label, spaceId) => {
//         return [
//             {
//                 'label': 'Menu ' + label + ' 1 : ' + spaceId,
//                 'image': {'type': 'font-icon', 'value': 'fa-user'},
//                 'actionId': '1',
//                 'custom_view': '',
//                 'id': label + '1',
//                 'submenus': [],
//             },
//             {
//                 'label': 'Menu ' + label + ' 2 : ' + spaceId,
//                 'image': {'type': '', 'value': ''},
//                 'actionId': '',
//                 'custom_view': 'Login',
//                 'id': label + '3',
//                 'submenus': [],
//             },
//             {
//                 'label': 'Menu ' + label + ' 2 : ' + spaceId,
//                 'image': {'type': '', 'value': ''},
//                 'actionId': '',
//                 'custom_view': '',
//                 'id': label + '4',
//                 'submenus': [
//                     {
//                         'label': 'Menu ' + label + ' 1 : ' + spaceId,
//                         'image': {'type': 'font-icon', 'value': 'fa-user'},
//                         'actionId': '2',
//                         'custom_view': '',
//                         'id': label + '41',
//                         'submenus': [],
//                     },
//                 ],
//             },
//         ]
//     }
//     store.dispatch({
//         'type': 'UPDATE_SPACE',
//         'spaceId': '1',
//         'left_menu': getMenu('left', '1'),
//         'menuId': '1',
//         'right_menu': getMenu('right', '1'),
//         'actionId': '1',
//         'viewId': '1',
//         'custom_view': '',
//     });
//     let tree = toJson(component);
//     expect(tree).toMatchSnapshot();
// });
// 
// test('Render Space with default value from redux store with custom client', () => {
//     const store = createStore(combineReducers(reducers));
//     updateGlobal();
//     const space = require('../space'),
//           Space = space.default;
//     const component = renderer.create(
//         <Provider store={store}>
//             <MuiThemeProvider>
//                 <Space spaceId='1'/>
//             </MuiThemeProvider>
//         </Provider>
//     );
//     store.dispatch({
//         'type': 'UPDATE_SPACE',
//         'spaceId': '',
//         'menuId': '1',
//         'actionId': '',
//         'viewId': '1',
//         'custom_view': 'Login',
//     });
//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
// });
