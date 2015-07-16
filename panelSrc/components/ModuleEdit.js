import React from 'react';
import Codemirror from 'react-codemirror';

import {renderWithNewFields} from '../EvalUtils';

const EDITABLES = ['data', 'resource', 'options', 'extraData'];

var cache = {};

class ModuleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        var module = props.module;
        EDITABLES.forEach((field) => {
            if (module) {
                cache[module.cid] = cache[module.cid] || {};
                this.state[field] =
                    cache[module.cid][field] || this._fieldValue(props, field);
            } else {
                this.state[field] = 'no module selected';
            }
        });
    }

    componentWillReceiveProps(props) {
        var module = props.module;
        EDITABLES.forEach((field) => {
            if (module) {
                cache[module.cid] = cache[module.cid] || {};
                this.setState({[field]:
                    cache[module.cid][field] || this._fieldValue(props, field)});
            } else {
                this.setState({[field]: 'no module selected'});
            }
        });
    }

    onChange(field) {
        return (nextValue) => {
            var module = this.props.module;
            cache[module.cid][field] = nextValue;

            var parse_msg;
            try {
                JSON.parse(nextValue);
                parse_msg = '';
            } catch (e) {
                parse_msg = e.message;
            }

            var dirty = !(nextValue === this._fieldValue(this.props, field));

            this.setState({
                [field]: nextValue,
                [`${field}_parse_msg`]: parse_msg,
                [`${field}_is_dirty`]: dirty
            });
        }
    }

    _fieldValue(props, field) {
        if (props.module) {
            return JSON.stringify(props.module[field], null, 2);
        }
    }

    save() {
        var fields = {};
        EDITABLES.forEach((field) => {
            fields[field] = JSON.parse(this.state[field]);
            this.setState({
                [`${field}_is_dirty`]: false
            });
        });

        renderWithNewFields(this.props.module.cid, fields);
    }

    render() {
        var moduleName = 'No Module Selected';
        if (this.props.module) {
            moduleName = this.props.module.name;
        }
        var options = {
            lineNumbers: true,
            matchBrackets: true,
            mode: {
                name: 'javascript',
                json: true
            }
        };

        var fieldEditors = EDITABLES.map((field) => {
            var parseMessage = this.state[`${field}_parse_msg`] ? (
                <span className="parse-msg">
                    {this.state[`${field}_parse_msg`]}
                </span>
            ) : null;
            return (
                <div className="field-group">
                    <label>
                        {field}
                        {this.state[`${field}_is_dirty`] ? '*' : ''}
                    </label>
                    <Codemirror
                        value={this.state[field]}
                        onChange={this.onChange(field)}
                        options={options}
                    />
                    {parseMessage}
                </div>
            );
        });

        var disabled = EDITABLES.some(
            (field) => this.state[`${field}_parse_msg`]);

        return (
            <div>
                <header className="title">{moduleName}</header>
                <div className="content">
                    {fieldEditors}
                </div>
                <button
                    className="save"
                    disabled={disabled}
                    onClick={this.save.bind(this)}>
                    Save
                </button>
            </div>
        );
    }
}

ModuleEdit.propTypes = {
    module: React.PropTypes.object
};

export default ModuleEdit;
