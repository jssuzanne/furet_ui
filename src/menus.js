/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import './picture';
import _ from 'underscore';
import {dispatchAll} from './store';
import {json_post} from './server-call';

export const Menu = Vue.component('furet-ui-appbar-menu', {
    template: `
        <a class="nav-item" v-if="hasValue">
            <a class="button" v-on:click="isModalActive = true; searchText = ''">
                <furet-ui-picture 
                    v-bind:type="value.image.type" 
                    v-bind:value="value.image.value" 
                />
                <span> {{ value.label }} </span>
            </a>
            <b-modal :active.sync="isModalActive">
                <div class="card">
                    <header class="card-header">
                        <b-field  position="is-centered">
                            <b-input
                                type="search"
                                icon-pack="fa"
                                icon="search"
                                v-bind:placeholder="$t('menus.search')"
                                v-model="searchText">
                            </b-input>
                        </b-field>
                    </header>
                    <div class="card-content">
                        <div v-for="group in groups">
                            <legend>
                                <furet-ui-picture
                                    v-bind:type="group.image.type"
                                    v-bind:value="group.image.value"
                                />
                                {{ group.label }}
                            </legend>
                            <div class="columns is-multiline is-mobile">
                                <div class="column is-12-mobile is-half-tablet is-half-desktop"
                                    v-for="card in group.values">
                                        <article class="box media" v-on:click.stop="selectCard(card)">
                                            <div class="media-left">
                                                <figure class="image is-32x32">
                                                    <furet-ui-picture
                                                        v-bind:type="card.image.type"
                                                        v-bind:value="card.image.value"
                                                    />
                                                </figure>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <strong>{{card.label}}</strong>
                                                    <br />
                                                    <span>{{card.description}}</span>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <p class="card-footer-item">
                            <a v-on:click="isModalActive = false">{{$t('menus.close')}}</a>
                        </p>
                    </footer>
                </div>
            </b-modal>
        </a>`,
    props: ['type'],
    data: () => {
        const data = {isModalActive: false, searchText: ''};
        return data
    },
    computed: {
        url () {
            return 'appbar/' + this.type + '/dialog';
        },
        value () {
            return this.$store.state[this.type + 'menu'].value;
        },
        hasValue () {
            const value = this.$store.state[this.type + 'menu'].value,
                  hasImage = _.keys(value.image || {}).length > 0,
                  hasLabel = value.label.length > 0;
            return hasImage && hasLabel;
        },
        groups () {
            const groups = [],
                  re = new RegExp(this.searchText, 'ig');
            _.each(this.$store.state[this.type + 'menu'].values, g => {
                const cards = _.filter(g.values, c => (re.test(c.label) || re.test(c.description)))
                if (cards.length) groups.push(Object.assign({}, g, {values: cards}));
            });
            return groups;
        },
    },
    methods: {
        selectCard (card) {
            const key = 'UPDATE_' + (this.type || '').toUpperCase() + '_MENU';
            switch (card.type) {
                case 'client':
                    this.$router.push({name: 'custom_view', params: {viewName: card.id}}); 
                    break;
                case 'space':
                    this.$router.push({name: 'space', params: {spaceId: card.id}});
                    this.$store.commit(key, {
                        value: {
                            label: card.label,
                            image: card.image,
                        },
                    });
                    break;
            }
            this.isModalActive = false;
        }
    }
});

export const LeftMenu = Vue.component('furet-ui-appbar-left-menu', {
    template: '<furet-ui-appbar-menu type="left"/>',
});

export const RightMenu = Vue.component('furet-ui-appbar-right-menu', {
    template: '<furet-ui-appbar-menu type="right"/>',
});
