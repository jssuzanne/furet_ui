/**
This file is a part of the FuretUI project

   Copyright (C) 2017 Jean-Sebastien SUZANNE <jssuzanne@anybox.fr>

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file,You can
obtain one at http://mozilla.org/MPL/2.0/.
**/
import React from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import {dispatchAll} from './reducers';
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton';
import plugin from './plugin';
import {green500} from 'material-ui/styles/colors';
import {getViewIcon, getView} from './views';
import {json_post} from './server-call';


class ActionCpt extends React.Component {
    renderSelector() {
        return (
            <ul className="list-inline"
                style={{
                    margin: 10,
                    padding: 0,
                    border: '2px solid gray',
                    WebkitBorderRadius: '10px',
                    MozBorderRadius: '10px',
                    borderRadius: '10px',
                }}
            >
                {_.map(this.props.views, view => (
                    <li 
                        key={view.viewId}
                        style={{backgroundColor: view.viewId == this.props.viewId ? green500 : 'white'}}
                    >
                        {getViewIcon(view.type, () => {
                            json_post('/view/' + view.viewId, {}, {
                                onSuccess: (results) => {
                                    this.props.dispatchAll(results)
                                }
                            });
                            this.props.dispatch({
                                type: 'UPDATE_ACTION_SELECT_VIEW',
                                actionId: this.props.actionId,
                                viewId: view.viewId,
                            })
                        })}
                    </li>
                ))}
            </ul>
        );
    }
    renderView () {
        const selector = this.renderSelector();
        const view = _.find(this.props.views || [], view => (view.viewId == this.props.viewId));
        if (view) return getView(view.type, view.viewId, 
                                 {
                                    selector, 
                                    model: this.props.model, 
                                    params: this.props.params,
                                    actionId: this.props.actionId,
                                });
        return null;
    }
    render () {
        const style = {};
        if (this.props.disabled) {
            style.display = 'none';
        }
        return (
            <div style={style}>
                {this.renderView()}
            </div>
        );
    }
}

const mapStateToPropsAction = (state, props) => {
    return state.actions[props.actionId] || {};
}

const mapDispatchToPropsAction = (dispatch) => {
    return {
        dispatchAll: (data) => (dispatchAll(dispatch, data)),
        dispatch: dispatch,
    }
}

export const Action = connect(mapStateToPropsAction, mapDispatchToPropsAction)(ActionCpt);

/**
 * ActionManager is a component which display RIGHT / LEFT menus and breadscrum
 *
 * props:
 *  @actionId (string, required): the first actions of the breadscrum
 *  @left_menu: iconmenu or icon drawer
 *  @right_menu: iconmenu or icon drawer
 *
 * import {ActionManager} from './action';
 * <ActionManager actionId={actionId} />
 *
**/
class ActionManagerCpt extends React.Component {
    /**
     * Render one Action
     *
     * params:
     *  @actionId: string of the action id of the action to create
     *  @order: integer of the position in the breadscrum, a same action can be have more than one position in the breadscrum
     *  @disabled: if true the action in the breadcrum won't be actif
     *
     * return one Action componant
    **/
    renderAction(actionId, order, disabled) {
        const action = this.props.action_data[actionId];
        return (
            <Action 
                key={'action-' + actionId + '-' + order}
                actionId={actionId} 
                views={action ? action.views : []}
                viewId={action ? action.viewId : ''}
                model={action ? action.model : ''}
                disabled={disabled}
            />
        );
    }
    /**
     * Display the actions in the breadcrumb
     *
     * All the action are rendered, but only one is visible
     *
    **/
    getEntryPointApp () {
        const res = [];
        if ((this.props.actions || []).length != 0) {
        } else {
            res.push(this.renderAction(this.props.actionId, 0, false));
        }
        return res;
    }
    /**
     * Display the breadcrum
     *
     * List the actions, the last is disabled because it is always the displayed action
     *
    **/
    getBreadcrumb () {
        const action = this.props.action_data[this.props.actionId];
        return (
            <FlatButton 
                label={action ? action.label : this.props.actionId}
                disabled={true}
            />
        )
    }
    render () {
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup firstChild={true}>
                        {this.props.left_menu}
                        {this.getBreadcrumb()}
                    </ToolbarGroup>
                    <ToolbarGroup>
                        {this.props.right_menu}
                    </ToolbarGroup>
                </Toolbar>
                {this.getEntryPointApp()}
            </div>
        );
    }
}

ActionManagerCpt.propTypes = {
    actionId: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => {
    return state.action_manager;
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchAll: (data) => (dispatchAll(dispatch, data)),
        dispatch: dispatch,
    }
}

export const ActionManager = connect(mapStateToProps, mapDispatchToProps)(ActionManagerCpt);
export default {
    ActionManager,
    Action,
};
