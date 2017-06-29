/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import Vueditor from 'vueditor';
import "vueditor/dist/css/vueditor.min.css";

let config = {
    toolbar: [
        'removeFormat', 'undo', '|', 'elements', 'fontName', 'fontSize', 'foreColor', 'backColor'
    ],
    fontName: [
        {val: "arial black"}, {val: "times new roman"}, {val: "Courier New"}
    ],
    fontSize: ['12px', '14px', '16px', '18px', '0.8rem', '1.0rem', '1.2rem', '1.5rem', '2.0rem'],
    emoji: [
        "1f600", "1f601", "1f602", "1f923", "1f603", "1f604", "1f605", "1f606", "1f609", "1f60a", "1f60b",
        "1f60e", "1f60d", "1f618", "1f617", "1f619", "1f61a", "263a", "1f642", "1f917", "1f914", "1f610",
        "1f611", "1f636", "1f644", "1f60f", "1f623", "1f625", "1f62e", "1f910", "1f62f", "1f62a", "1f62b",
        "1f634", "1f60c", "1f913", "1f61b", "1f61c", "1f61d", "1f924", "1f612", "1f613", "1f614", "1f615",
        "1f643", "1f911", "1f632", "2639", "1f641", "1f616", "1f61e", "1f61f", "1f624", "1f622", "1f62d",
        "1f626", "1f627", "1f628", "1f629", "1f62c", "1f630", "1f631", "1f633", "1f635", "1f621", "1f620",
        "1f607", "1f920", "1f921", "1f925", "1f637", "1f912", "1f915", "1f922", "1f927"
    ],
    lang: 'en',
    mode: 'default',
    iframePath: '',
    fileuploadUrl: ''
};

Vue.use(Vueditor, config);
import {FormMixin, ThumbnailMixin, ListMixin} from './common';

export const FieldFormText = Vue.component('furet-ui-form-field-text', {
    mixins: [FormMixin],
    template: `
        <div v-if="this.isInvisible" />
        <b-tooltip 
            v-bind:label="getTooltip" 
            v-bind:position="tooltipPosition"
            v-bind:style="{'width': '100%'}"
            v-else
        >
            <b-field 
                v-bind:label="this.label"
                v-bind:type="getType"
                v-bind:message="getMessage"
                v-bind:style="{'width': 'inherit'}"
            >
                <Vueditor
                    v-bind:style="{'width': '100%'}"
                    v-on:blur="onBlur"
                />
                </Vueditor>
            </b-field>
        </b-tooltip>`,
    methods: {
        onBlur (e) {
            console.log('plop', this, e)
        }
    },
})
// import React from 'react';
// import plugin from '../plugin';
// import {BaseList, BaseThumbnail, BaseForm} from './base';
// import translate from 'counterpart';
// 
// /** CFor unit test **/
// let RichTextEditor = null;
// if (process.env.NODE_ENV == 'test') {
//     RichTextEditor = () => {return <div />};
//     RichTextEditor.createValueFromText = () => {return 'Test'};
// } else {
//     RichTextEditor = require('react-rte').default;
// }
// /** CFor unit test **/
// 
// export class TextList extends BaseList {
//     getInput () {
//         return (
//             <RichTextEditor
//                 value={RichTextEditor.createValueFromText(this.value || '', 'html')}
//                 readOnly={true}
//             />
//         );
//     }
// }
// 
// export class TextThumbnail extends BaseThumbnail {
//     getInput () {
//         return (
//             <RichTextEditor
//                 id={this.props.id}
//                 value={RichTextEditor.createValueFromText(this.value || '', 'html')}
//                 readOnly={true}
//             />
//         );
//     }
// }
// 
// export class TextForm extends BaseForm {
//     constructor(props) {
//         super(props);
//         this.state = {
//             value: RichTextEditor.createValueFromText(props.value || '', 'html'),
//         };
//     }
//     componentWillReceiveProps(nextProps) {
//         if (nextProps.readonly !== this.props.readonly) {
//             this.setState({
//                 value: RichTextEditor.createValueFromText(nextProps.value || this.props.value || '', 'html'),
//             });
//         }
//         else if (nextProps.readonly && this.props.value != nextProps.value) {
//             this.setState({
//                 value: RichTextEditor.createValueFromText(nextProps.value || this.props.value || '', 'html'),
//             });
//         }
//         else if (nextProps.value == null) {
//             this.setState({
//                 value: RichTextEditor.createValueFromText('', 'html'),
//             });
//         }
//     }
//     updateThisData () {
//         super.updateThisData();
//         if (this.props.required && !this.props.readonly && this.value == '<p><br></p>') {
//             this.error = translate('furetUI.fields.common.required', 
//                                    {fallback: 'This field is required'});
//         }
//     }
//     getInput () {
//         return (
//             <RichTextEditor
//                 value={this.state.value}
//                 readOnly={this.props.readonly}
//                 onChange={(value) => {
//                     this.setState({value});
//                     this.props.onChange(this.props.name, value.toText('html'))
//                 }}
//             />
//         );
//     }
// }
// 
// plugin.set(['field', 'List'], {'Text': TextList});
// plugin.set(['field', 'Thumbnail'], {'Text': TextThumbnail});
// plugin.set(['field', 'Form'], {'Text': TextForm});
// plugin.set(['field', 'List'], {'uText': TextList});
// plugin.set(['field', 'Thumbnail'], {'uText': TextThumbnail});
// plugin.set(['field', 'Form'], {'uText': TextForm});
// 
// 
// export default {
//     TextList,
//     TextThumbnail,
//     TextForm,
// 
// }
