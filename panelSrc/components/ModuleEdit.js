import React from 'react';
import Codemirror from 'react-codemirror';

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
        return (nextValue) => this.setState({[field]: nextValue});
    }

    save() {
        // all fields must be valid JSON
        var parseable = EDITABLES.every((field) => {
            try {
                JSON.parse(this.state[field]);
            } catch(e) {
                return false;
            }
            return true;
        });

        var fields = {};
        EDITABLES.forEach((field) => {
            fields[field] = this.state[field];
        });

        var fn = `render('${module.cid}', ${fields})`;
        chrome.devtools.inspectedWindow.eval(fn, {
            useContentScriptContext: true
        });
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

        var fieldEditors = EDITABLES.map((field) => (
            <div>
                <label>{field}</label>
                <Codemirror
                    value={this.state[field]}
                    onChange={this.onChange(field)}
                    options={options}
                />
            </div>
        ));

        return (
            <div>
                <header className="title">{moduleName}</header>
                <div className="content">
                    {fieldEditors}
                </div>
                <button className="save">Save</button>
            </div>
        );
    }
}

ModuleEdit.propTypes = {
    module: React.PropTypes.object
};

export default ModuleEdit;
