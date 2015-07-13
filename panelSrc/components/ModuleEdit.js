import CollapseButton from './CollapseButton';
import React from 'react';

class ModuleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    
    save() {
        var val = this.sanitize(this.fields);
        if (val) {
            var fn = 'render(\'' + module.cid + '\',\'' + val + '\')';
            chrome.devtools.inspectedWindow.eval(fn, {
                useContentScriptContext: true
            });
        }
    }

    sanitize(fields) {
        try {
            Object.keys(fields).forEach(function(key) {
                JSON.parse(fields[key]);
            });
            return JSON.stringify(fields);
        } catch(e) {
            // Invalid JSON object
            return null;
        }
    }

    prettyPrint(obj) {
        return JSON.stringify(obj);
    }

    onChange(e) {
        var key = e.target.getAttribute('data-key')
        this.fields[key] = e.target.value;
        this.forceUpdate();
    }

    componentWillUpdate(props, state) {
        var module = this.props.module
        if (!module || module.cid !== props.module.cid) {
            this.fields = {};

            var editables = ['data', 'resource', 'options', 'extraData'];
            editables.forEach((key) => {
                this.fields[key] = this.prettyPrint(props.module[key]);
            });
        }
    }

    render() {
        var module = this.props.module;
        if (!module) {
            return null;
        }

        var fields = Object.keys(this.fields).map((key) => {
            var value = this.fields[key];
            return (
                <div>
                    <label>{key}</label>
                    <textarea value={value} onChange={this.onChange} data-key={key}></textarea>
                </div>
            )
        });

        return (
            <div>
                <header className="title">{module.name}</header>
                <div className="content">{fields}</div>
                <button className="save">Save</button>
            </div>
        );
    }
}

ModuleEdit.propTypes = {
    module: React.PropTypes.object
};

export default ModuleEdit;
