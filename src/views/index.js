/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
// import AlertWarning from 'material-ui/svg-icons/alert/warning';
// 
// /**
//  * Unknown icon for view selector
// **/
// plugin.set(['views', 'icon'], {Unknown: (props) => {
//     return <AlertWarning />;
// }});

import './clients';
// import './list';
// import './thumbnail';
// import './form';
import Vue from 'vue';
import plugin from '../plugin';

/**
 * Unknown view, use if no view found
 *
 * props:
 *  @selector: Component used by the view
 *  @viewName: Name of the custom view which is not available
 *  @viewType: Name of the standard view which is not available
 *
**/
                // <div className="col-xs-12 col-sm-8 col-md-8 col-lg-9">
                // </div>
                // <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3">
                //     {this.props.selector || null}
                // </div>
export const VueUnknown = Vue.component('furet-ui-view-unknown', {
    props: ['selector', 'viewName'],
    template: `
        <div>
            <div v-if="selector">
                {{selector}}
            </div>
            <section class="section">
                <div class="container">
                    <h1 class="title">{{$t('views.unknown.title', {name: viewName})}}</h1>
                    <h2 class="subtitle">
                        {{$t('views.unknown.message')}}
                    </h2>
                </div>
            </section>
        </div>`,
});

plugin.set(['views'], {Unknown: {vue: 'furet-ui-view-unknown'}})
