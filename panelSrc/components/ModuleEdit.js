import React from 'react';
import Codemirror from 'react-codemirror';

import {renderWithNewFields} from '../EvalUtils';

const EDITABLES = ['data', 'resource', 'options', 'extraData'];

class ModuleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        EDITABLES.forEach((field) => {
            this.state[field] = props.module ?
                JSON.stringify(props.module[field], null, 2) : 'no module selected';
        });
    }

    componentWillReceiveProps(props) {
        EDITABLES.forEach((field) => {
            this.setState({[field]: props.module ?
                JSON.stringify(props.module[field], null, 2) : 'no module selected'
            });
        });
    }

    onChange(field) {
        return (nextValue) => {
            var parse_msg;
            try {
                JSON.parse(nextValue);
                parse_msg = '';
            } catch (e) {
                parse_msg = e.message;
            }
            this.setState({
                [field]: nextValue,
                [`${field}_parse_msg`]: parse_msg
            });
        }
    }

    save() {
        var fields = {};
        EDITABLES.forEach((field) => {
            fields[field] = JSON.parse(this.state[field]);
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
                    <label>{field}</label>
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
