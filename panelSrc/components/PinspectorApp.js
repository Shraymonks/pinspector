import React from 'react';

import Model from './Model';
import ModelDependentComponent from './ModelDependentComponent';
import ModuleTree from './ModuleTree';
import ModuleEdit from './ModuleEdit';
import SplitPane from './SplitPane';
import SearchBar from './SearchBar';

// CSS
import 'normalize.css';
import '../styles/main.css';

class PinspectorApp extends ModelDependentComponent {
    constructor(props) {
        super(props, 'selectedModule');
    }

    selectUser() {
        Model.selectedModule = {
            name: 'User',
            data: this.props.user,
            resource: null,
            options: null,
            extraData: null
        }
    }

    setSelectedModule(module) {
        Model.selectedModule = module;
    }

    render() {
        return (
            <SplitPane
                leftPane={
                    <div className="modules">
                        <div className="parent user" onClick={this.selectUser.bind(this)}>
                            User
                        </div>
                        <ol className="module-tree">
                            <ModuleTree module={this.props.rootModule}
                                selectedModule={this.state.selectedModule}
                                onSelect={this.setSelectedModule.bind(this)} />
                        </ol>
                        <SearchBar root={document.querySelectorAll(".parent")}/>
                    </div>
                }
                rightPane={
                    <div className="module-edit">
                        <ModuleEdit module={this.state.selectedModule} />
                    </div>
                }
            />
        );
    }
}
PinspectorApp.propTypes = {
    rootModule: React.PropTypes.object.isRequired
};

function render(options) {
    React.render(
        <PinspectorApp rootModule={options.module} user={options.user}/>,
        document.getElementById('content')
    );
}

function initialize() {
    chrome.devtools.inspectedWindow.eval(`
        (function(P) {
            if (!P) { return null; }

            function getModules(module) {
                // Store cid for lookup
                module.$el.attr('cid', module.cid);

                var children = module.children.map(getModules);
                // TODO {zack} Find a way to do this better
                var whitelist = ['cid', 'data', 'options', 'resource', 'extraData', 'extraState'];
                var mod = Object.keys(module).reduce(function(obj, key) {
                    if (whitelist.indexOf(key) !== -1) {
                        obj[key] = module[key];
                    }
                    return obj;
                }, { name: module.className, children: children });
                return JSON.parse(JSON.stringify(mod, function(property, value) {
                    if (value instanceof jQuery) {
                        return '<jQuery object>';
                    }
                    return value;
                }));
            }

            return {
                module: getModules(P.app),
                user: P.currentUser
            }
      })(P)`, render);
}

/*
 * Reinitialize each time there is a route change or resource (node)
 * added to the DOM. This should account for full page reloads as well
 * as SPA route changes. Debounce the resource added otherwise it will
 * be fired like 100+ times...
 */
var debounced = null;
chrome.devtools.inspectedWindow.onResourceAdded.addListener(function() {
    clearTimeout(debounced);
    debounced = setTimeout(initialize, 50);
});
initialize();

export default PinspectorApp;
