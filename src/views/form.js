import Base from './base';
import plugin from '../plugin';
import EditorInsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import {processNodeDefinitions} from './base';
import ActionNoteAdd from 'material-ui/svg-icons/action/note-add';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import ContentSave from 'material-ui/svg-icons/content/save';
import IconButton from 'material-ui/IconButton';
import {blue500, red500} from 'material-ui/styles/colors';
import DropdownMenu from './dropdown';
import translate from 'counterpart';

plugin.set(['views', 'icon'], {Form: (props) => {
    return <EditorInsertDriveFile />;
}});

export class Form extends Base {
    constructor(props) {
        super(props);
        this.state = {change: {}, readonly: true, id: null};
    }
    call_server (id) {
        this.json_post(
            '/form/get', 
            {
                model: this.props.model,
                id: (id != undefined) ? id : this.state.id,
            },
            {
                onSuccess: (results) => {
                    this.props.dispatchAll(results);
                },
            },
        );
    }
    addNewEntry () {
        this.setState({readonly: false, id: null});
        this.call_server(null);
    }
    returnPreviousView() {
        const viewId = (this.props.params && this.props.params.returnView) || this.props.onSelect;
        if (viewId) {
            this.props.dispatch({
                type: 'UPDATE_ACTION_SELECT_VIEW',
                actionId: this.props.actionId,
                viewId,
            })
        }
    }
    removeEntry () {
        console.log('todo', 'removeEntry');
    }
    saveEntry () {
        console.log('todo', 'saveEntry');
        this.setState({readonly: true});
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.params) {
            const state = {}
            if (nextProps.params.readonly != undefined) state.readonly = nextProps.params.readonly;
            if (nextProps.params.id != undefined) state.id = nextProps.params.id;
            this.setState(state);
        }
    }
    onChange(field, value) {
        const change = Object.assign({}, this.state.change);
        change[field] = value;
        this.setState({change})
    }
    renderTemplate (template) {
        if (!template) return null;
        const self = this;
        const processingInstructions = [
            {
                shouldProcessNode: function(node) {
                    return node.name === 'field';
                },
                processNode: function(node, children) {
                    const data = self.props.data[self.state.id] || {},
                          change = self.state.change;
                    return self.getField(
                        'Form', 
                        node.attribs.widget, 
                        Object.assign(node.attribs, {readonly: self.state.readonly, onChange: self.onChange.bind(self)}),
                        change[node.attribs.name] != undefined ? change[node.attribs.name] : data[node.attribs.name]
                    );
                }
            }, 
            {
                // Anything else
                shouldProcessNode: function(node) {
                    return true;
                },
                processNode: processNodeDefinitions.processDefaultNode
            }
        ];
        return super.renderTemplate(template, processingInstructions);
    }
    renderButton () {
        return (
            <div className="row">
                { !this.state.readonly &&
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"
                         style={{paddingLeft: 0, paddingRight: 0}}
                    >
                        <IconButton
                            onClick={this.saveEntry.bind(this)}
                            tooltip={translate('furetUI.views.common.save', {fallback: 'Save'})}
                            iconStyle={{
                                width: 36,
                                height: 36,
                            }}
                            style={{
                                width: 48,
                                height: 48,
                            }}
                        >
                            <ContentSave color={blue500} />
                        </IconButton>
                    </div>
                }
                { this.props.creatable && this.state.readonly &&
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"
                         style={{paddingLeft: 0, paddingRight: 0}}
                    >
                        <IconButton
                            onClick={this.addNewEntry.bind(this)}
                            tooltip={translate('furetUI.views.common.create', {fallback: 'Create'})}
                            iconStyle={{
                                width: 36,
                                height: 36,
                            }}
                            style={{
                                width: 48,
                                height: 48,
                            }}
                        >
                            <ActionNoteAdd color={blue500} />
                        </IconButton>
                    </div>
                }
                { this.props.editable && this.state.readonly &&
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"
                         style={{paddingLeft: 0, paddingRight: 0}}
                    >
                        <IconButton
                            onClick={() => this.setState({readonly: false})}
                            tooltip={translate('furetUI.views.common.edit', {fallback: 'Edit'})}
                            iconStyle={{
                                width: 36,
                                height: 36,
                            }}
                            style={{
                                width: 48,
                                height: 48,
                            }}
                        >
                            <EditorModeEdit color={blue500} />
                        </IconButton>
                    </div>
                }
                { !this.state.readonly &&
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"
                         style={{paddingLeft: 0, paddingRight: 0}}
                    >
                        <IconButton
                            onClick={() => this.setState({readonly: true, change: {}})}
                            tooltip={translate('furetUI.views.common.cancel', {fallback: 'Cancel'})}
                            iconStyle={{
                                width: 36,
                                height: 36,
                            }}
                            style={{
                                width: 48,
                                height: 48,
                            }}
                        >
                            <NavigationCancel color={red500} />
                        </IconButton>
                    </div>
                }
                { this.props.deletable && this.state.readonly &&
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"
                         style={{paddingLeft: 0, paddingRight: 0}}
                    >
                        <IconButton
                            onClick={this.removeEntry.bind(this)}
                            tooltip={translate('furetUI.views.common.delete', {fallback: 'Delete'})}
                            iconStyle={{
                                width: 36,
                                height: 36,
                            }}
                            style={{
                                width: 48,
                                height: 48,
                            }}
                        >
                            <ActionDeleteForever color={red500} />
                        </IconButton>
                    </div>
                }
                { this.state.readonly &&
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"
                         style={{paddingLeft: 0, paddingRight: 0}}
                    >
                        <IconButton
                            onClick={this.returnPreviousView.bind(this)}
                            tooltip={translate('furetUI.views.common.close', {fallback: 'Close'})}
                            iconStyle={{
                                width: 36,
                                height: 36,
                            }}
                            style={{
                                width: 48,
                                height: 48,
                            }}
                        >
                            <NavigationArrowBack />
                        </IconButton>
                    </div>
                }
                { (this.props.buttons || []).length != 0 && 
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <DropdownMenu 
                            label={translate('furetUI.views.common.actions', {fallback: 'Actions'})}
                            menus={this.props.buttons} 
                        />
                    </div>
                }
            </div>
        )
    }
    render () {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        {this.renderButton()}
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        {this.props.selector}
                    </div>
                </div>
                <div className="row">
                    {this.renderTemplate(this.props.template)}
                </div>
            </div>
        )
    }
}

plugin.set(['views', 'type'], {Form})

export default Form