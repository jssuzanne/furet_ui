/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import {dispatchAll} from './store';
import {json_post} from './server-call';


const spaceChildren = [
    {
        path: 'action/:actionId',
        props: true,
        component: {
            template: '<furet-ui-space v-bind:actionId="actionId" />',
            props: ['actionId'],
        },
        beforeEnter: (to, from, next) => {
            next()
        },
        children: [
            {
                path: 'view/:viewId',
                props: true,
                component: {
                    template: '<furet-ui-space v-bind:viewId="viewId" />',
                    props: ['viewId'],
                },
                beforeEnter: (to, from, next) => {
                    console.log('view', to, from)
                    next()
                },
            },
        ],
    },
];



const router = new VueRouter({
    routes: [
        {
            path: '/custom/view/:viewName',
            name: 'custom_view',
            props: true,
            component: {
                template: '<furet-ui-custom-view v-bind:viewName="viewName" />',
                props: ['viewName'],
                beforeRouteEnter: (to, from, next) => {
                    json_post('/custom/view/' + to.params.viewName, {}, {
                        onSucess: (results) => {
                            dispatchAll(undefined, results);
                        },
                    })
                    next();
                },
                beforeRouteUpdate: (to, from, next) => {
                    json_post('/custom/view/' + to.params.viewName, {}, {
                        onSucess: (results) => {
                            dispatchAll(undefined, results);
                        },
                    })
                    next();
                },
            },
        },
        {
            path: '/space/:spaceId',
            name: 'space',
            props: true,
            component: {
                template: '<furet-ui-space v-bind:spaceId="spaceId" />',
                props: ['spaceId'],
                beforeRouteEnter: (to, from, next) => {
                    call('/space/' + to.params.spaceId, to.params);
                    next();
                },
                beforeRouteUpdate: (to, from, next) => {
                    if (to.params.spaceId != from.params.spaceId) call('/space/' + to.params.spaceId, to.params);
                    next();
                },
            },
            children: spaceChildren,
        },
        {
            path: '/space/:spaceId/menu/:menuId',
            name: 'space_menu',
            props: true,
            component: {
                template: '<furet-ui-space v-bind:spaceId="spaceId" v-bind:menuId="menuId" />',
                props: ['spaceId', 'menuId'],
                beforeRouteEnter: (to, from, next) => {
                    console.log('plop', to.params)
                    call('/space/' + to.params.spaceId, to.params);
                    next();
                },
                beforeRouteUpdate: (to, from, next) => {
                    console.log('plop', to.params)
                    if (to.params.spaceId != from.params.spaceId) call('/space/' + to.params.spaceId, to.params);
                    next();
                },
            },
            children: [
                {
                    path: 'action/:actionId',
                    name: 'space_menu_action',
                    props: true,
                    component: {
                        template: '<div>{{spaceId}} {{menuId}} {{actionId}} </div>',
                        props: ['spaceId', 'menuId', 'actionId'],
                    },
                    beforeEnter: (to, from, next) => {
                        console.log('action', to, from)
                        next()
                    },
                    children: [
                        {
                            path: 'view/:viewId',
                            props: true,
                            component: {
                                template: '<furet-ui-space v-bind:viewId="viewId" />',
                                props: ['viewId'],
                            },
                            beforeEnter: (to, from, next) => {
                                console.log('view', to, from)
                                next()
                            },
                        },
                    ],
                },
            ],
            // children: [
            //     {
            //         path: 'action/:actionId',
            //         name: 'space_menu_action',
            //         props: true,
            //         component: {
            //             template: '<furet-ui-space v-bind:spaceId="spaceId" v-bind:menuId="menuId" v-bind:actionId="actionId"/>',
            //             props: ['spaceId', 'menuId', 'actionId'],
            //             beforeRouteEnter: (to, from, next) => {
            //                 console.log('action.beforeRouteEnter', to)
            //                 next();
            //             },
            //             beforeRouteUpdate: (to, from, next) => {
            //                 console.log('action.beforeRouteUpdate', to)
            //                 next();
            //             },
            //         }
            //     }
            // ],
        },
    ],
});

const call = (path, params) => {
    json_post(path, params, {
        onSuccess: (results) => {
            dispatchAll(router, results);
        },
    })
}

export default router;
