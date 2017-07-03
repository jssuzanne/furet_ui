/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import plugin from './plugin';
import uuid from 'uuid/v1';

export const getNewID = (model) => {
    return 'new-' + model + '-' + uuid();
}

/**
 * Return the stanadrd view
 *
 * @viewId: (string) id of the view
 * @params: object
 *
**/
export const View = Vue.component('furet-ui-view', {
    props: ['spaceId', 'menuId', 'actionId', 'viewId', 'dataId', 'mode'],
    render: function(createElement) {
        let view = plugin.get(['views', 'type', this.view.viewType]);
        if (!view) view = plugin.get(['views', 'Unknown']).vue;
        return createElement(view, {
            props: {
                spaceId: this.spaceId,
                menuId: this.menuId,
                actionId: this.actionId,
                viewId: this.viewId,
                view: this.view,
                viewName: this.view.viewType,
                dataId: this.dataId,
                data: this.data,
                change: this.change,
                mode: this.mode,
            },
        });
    },
    computed: {
        view () {
            const views = this.$store.state.data.views;
            if (this.viewId) return views[String(this.viewId)] || {};
            return {};
        },
        model () {
            if (this.view) {
                return this.view.model;
            }
            return null;
        },
        data () {
            if (this.model) {
                let data = this.$store.state.data.data;
                let changes = this.$store.state.data.changes;

                if (this.dataId) {
                    data = (data[this.model]) ? data[this.model][String(this.dataId)] || {} : {};
                    changes = (changes[this.model]) ? changes[this.model][String(this.dataId)] || {} : {};
                    return Object.assign({}, data, changes);
                }

                return data[this.model] || {};
            }
            if (this.dataId) return {};
            return [];
        },
        change () {
            if (this.dataId) {
                const changes = this.$store.state.data.changes;
                return (changes[this.model]) ? changes[this.model][String(this.dataId)] || {} : {};
            }
            return {};
        },
    },
});


/**
 * Return the Icon component which represent the standard view
 *
 * @type: typs of the standard view
 *
**/
export const ViewIcon = Vue.component('furet-ui-view-icon', {
    props: ['type'],
    render: function(createElement) {
        let view = plugin.get(['views', 'icon', this.type]);
        if (!view) view = plugin.get(['views', 'icon', 'Unknown']);
        return createElement(view, {});
    }
});

/**
 * Return a component with the wanted view, if no view the the return view will be the Unknown view
 *
 * @viewName: name of the wanted view
 *
**/
export const CustomView = Vue.component('furet-ui-custom-view', {
    props: ['viewName'],
    render: function(createElement) {
        let view = plugin.get(['views', 'type', 'client', this.viewName]);
        if (!view) view = plugin.get(['views', 'Unknown']);
        if (view.vue) return createElement(view.vue, {props: {viewName: this.viewName}});
        else if (view.function) return view.function({
            createElement, store: this.$store, router: this.$router});
    }
});
