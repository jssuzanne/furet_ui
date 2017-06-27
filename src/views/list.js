/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
console.error('FIX ME, find a better way to load data')
console.error('FIX ME, search bar')
import Vue from 'vue';
import plugin from '../plugin';
import {dispatchAll} from '../store';
import {json_post} from '../server-call';
import {getNewID} from '../view';

/**
 * Add Icon for List view
**/
export const ListViewIcon = Vue.component('furet-ui-list-view-icon', {
    template: '<i class="fa fa-list"></i>',
});

plugin.set(['views', 'icon'], {List: 'furet-ui-list-view-icon'})

/**
 * List view
 *
**/
export const ListView = Vue.component('furet-ui-list-view', {
    props: ['spaceId', 'menuId', 'actionId','viewId', 'view', 'viewName', 'dataId', 'mode', 'dataIds', 'data', 'change'],
    template: `
        <div>
            <nav class="level">
                <div class="level-left">
                    <div class="field has-addons">
                        <p class="control" v-if="view && view.creatable">
                            <a  class="button"
                                v-on:click="addNew"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-plus"></i>
                                </span>
                                <span>{{$t('views.common.create')}}</span>
                            </a>
                        </p>
                        <p class="control" v-if="hasChecked && view && view.deletable">
                            <a class="button"
                               v-on:click="deleteData"
                            >
                                <span class="icon is-small">
                                    <i class="fa fa-trash"></i>
                                </span>
                                <span>{{$t('views.common.delete')}}</span>
                            </a>
                        </p>
                        <p class="control" 
                            v-if="view && (view.buttons || []).length >0"
                        >
                            <b-dropdown>
                                <button class="button" slot="trigger">
                                    <span>{{$t('views.common.actions')}}</span>
                                    <span class="icon is-small">
                                        <i class="fa fa-caret-down"></i>
                                    </span>
                                </button>
                                <b-dropdown-option 
                                    v-for="button in view.buttons"
                                    v-bind:value="button.buttonId"
                                    v-bind:key="button.buttonId"
                                    v-on:change="selectAction(button.buttonId)"
                                >
                                    {{button.label}}
                                </b-dropdown-option>
                            </b-dropdown>
                        </p>
                        <p class="control" 
                            v-if="hasChecked && view && (view.onSelect_buttons || []).length >0"
                        >
                            <b-dropdown>
                                <button class="button" slot="trigger">
                                    <span>{{$t('views.common.more')}}</span>
                                    <span class="icon is-small">
                                        <i class="fa fa-caret-down"></i>
                                    </span>
                                </button>
                                <b-dropdown-option 
                                    v-for="button in view.onSelect_buttons"
                                    v-bind:value="button.buttonId"
                                    v-bind:key="button.buttonId"
                                    v-on:change="selectMore(button.buttonId)"
                                >
                                    {{button.label}}
                                </b-dropdown-option>
                            </b-dropdown>
                        </p>
                    </div>
                </div>
                <div class="level-right">
                    search bar
                </div>
            </nav>
            <b-table
                v-bind:data="tableData"
                v-bind:narrowed="narrowed"
                v-bind:checkable="isCheckable"
                v-bind:mobile-cards="mobileCard"
                v-bind:paginated="paginated"
                v-bind:per-page="perPage"
                v-bind:selected.sync="selected"
                v-bind:checked-rows.sync="checkedRows"
                v-on:dblclick="selectRow"
            >
                <template scope="props">
                    <b-table-column v-for="header in headers"
                        v-bind:key="header.field"
                        v-bind:field="header.field"
                        v-bind:label="header.label"
                        v-bind:width="header.width"
                        v-bind:numeric="header.numeric"
                        v-bind:sortable="header.sortable"
                        v-bind:custom-sort="header.customSort"
                    >
                        <div v-if="header.render">
                            {{ header.render(props.row) }}
                        </div>
                        <furet-ui-list-component v-else v-bind:row="props.row" v-bind:header="header"/>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    `,
    data: () => {
        return {
            selected: {},
            checkedRows: [],
            narrowed: true,
            mobileCard: true,
            paginated: true,
            filter: {},
        };
    },
    computed: {
        headers () {
            if (this.view) {
                return _.map(this.view.headers || [], header => {
                    let field = plugin.get(['field', 'List', header.type]);
                    if (!field) field = plugin.get(['field', 'List', 'Unknown']);
                    return field(header);
                });
            }
            return [];
        },
        tableData () {
            const dataIds = this.dataIds ? this.dataIds : _.keys(this.data || {});
            return _.map(dataIds, dataId => Object.assign(
                {__dataId: dataId}, 
                (this.data || {})[dataId], 
                (this.change || {})[dataId]
            ));
        },
        isCheckable () {
            if (this.view) {
                this.getData()
                return this.view.selectable;
            }
            return false;
        },
        perPage () {
            const defaultPerPage = 20;
            if (this.view) return this.view.perPage || defaultPerPage;
            return defaultPerPage;
        },
        hasChecked () {
            return this.checkedRows.length > 0;
        },
    },
    methods: {
        getData() {
            json_post(
                '/list/get', 
                {
                    model: this.view.model,
                    filter: this.filter,
                    fields: this.view.fields,
                    viewId: this.viewId,
                },
                {
                    onSuccess: (results) => {
                        dispatchAll(results);
                    },
                },
            );
        },
        addNew: function () {
            if (this.view.onSelect) {
                this.$router.push({
                    name: this.menuId ? 'space_menu_action_view_dataId' : 'space_action_view_dataId',
                    params: {
                        spaceId: this.spaceId,
                        menuId: this.menuId,
                        actionId: this.actionId,
                        viewId: this.view.onSelect,
                        dataId: getNewID(this.view.model),
                        mode: 'new',
                    }
                });
            }
        },
        deleteData: function () {
            const dataIds = _.map(this.checkedRows, row => row.__dataId);
            json_post('/data/delete', {model: this.view.model, dataIds}, {
                onSuccess: (result) => {
                    dispatchAll(result)
                    this.getData()
                },
            });
        },
        selectRow: function (row) {
            if (this.view.onSelect) {
                this.$router.push({
                    name: this.menuId ? 'space_menu_action_view_dataId' : 'space_action_view_dataId',
                    params: {
                        spaceId: this.spaceId,
                        menuId: this.menuId,
                        actionId: this.actionId,
                        viewId: this.view.onSelect,
                        dataId: row.__dataId,
                        mode: 'readonly',
                    }
                });
            }
        }
    }
});

Vue.component('furet-ui-list-component', {
    props: ['row', 'header'],
    render: function(createElement) {
        return this.header.renderHtml(createElement, this.row);
    },
});

plugin.set(['views', 'type'], {List: 'furet-ui-list-view'});

plugin.set(['field', 'List'], {Unknown: (header) => {
    const res = {
        label: header.label,
        field: header.name,
        numeric: false,
        width: '200px',
        render: (row) => {
            return row[header.name] || '';
        },
    }
    if (header.width) res.width = header.width;
    if (header.sortable) res.sortable = header.sortable;
    console.log('Unknown field for', header)
    return res;
}})
