/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import plugin from '../../plugin';
import {json_post} from '../../server-call';
import {dispatchAll} from '../../store';

plugin.set(['views', 'type', 'client'], {Logout: {function: ({router}) => {
    router.push('/');
    json_post('/client/logout', {}, {
        onSuccess: (result) => {
            dispatchAll(result);
        },
    });
}}});
