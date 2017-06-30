/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import Vue from 'vue';
import {FormMixin, ThumbnailMixin, ListMixin} from '../common';
import {RelationShip, RelationShipX2MList, RelationShipX2MThumbnail} from './common';
import {dispatchAll} from '../../store';
import {json_post} from '../../server-call';

export const FieldListOne2Many = Vue.component('furet-ui-list-field-one2many', {
    mixins: [ListMixin, RelationShip, RelationShipX2MList],
})

export const FieldThumbnailOne2Many = Vue.component('furet-ui-thumbnail-field-one2many', {
    mixins: [ThumbnailMixin, RelationShip, RelationShipX2MThumbnail],
})
