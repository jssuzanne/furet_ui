/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
// class App extends React.Component {
//     render () {
//         return (
//             <div>
//                 <AppBar
//                     title={this.props.title}
//                     iconElementLeft={<LeftMenu />}
//                     iconElementRight={<RightMenu />}
//                 />
//                 {this.getEntryPointApp()}
//             </div>
//         );
//     }
// }
import Vue from 'vue';
import './menus';
import './view';
import './space';

/**
 * Render children of the application, it may be:
 *  - space
 *  - custom view
 *
**/
export const App = Vue.component('furet-ui', {
    template: `
        <div>
            <nav class="nav">
                <div class="nav-left">
                    <furet-ui-appbar-left-menu />
                </div>
                <div class="nav-center">
                    {{ title }}
                </div>
                <div class="nav-right">
                    <furet-ui-appbar-right-menu />
                </div>
            </nav>
            <furet-ui-space v-if="spaceId" v-bind:spaceId="spaceId" />
            <furet-ui-custom-view v-if="custom_view" v-bind:viewName="custom_view" />
        </div>`,
    computed: {
        spaceId () {
            return this.$store.state.global.spaceId;
        },
        custom_view () {
            return this.$store.state.global.custom_view;
        },
        title () {
            return this.$store.state.global.title;
        }
    },
});

export default App
