import React from 'react';

import Model from './Model';
import ModelDependentComponent from './ModelDependentComponent';
import ModuleTree from './ModuleTree';
import SplitPane from './SplitPane';

// CSS
import 'normalize.css';
import '../styles/main.css';

class PinspectorApp extends ModelDependentComponent {
    constructor(props) {
        super(props, 'selectedModule');
    }

    setSelectedModule(module) {
        Model.selectedModule = module;
    }

    render() {
        return (
            <SplitPane
                leftPane={
                    <div className="modules">
                        <ol className="module-tree">
                            <ModuleTree module={this.props.rootModule}
                                selectedModule={this.state.selectedModule}
                                onSelect={this.setSelectedModule.bind(this)} />
                        </ol>
                    </div>
                }
            />
        );
    }
}
PinspectorApp.propTypes = {
    rootModule: React.PropTypes.object.isRequired
};

function render(module) {
    React.render(
        <PinspectorApp rootModule={module}/>,
        document.getElementById('content')
    );
}

chrome.devtools.inspectedWindow.eval(`
    (function getModules(module) {
        if (!module) {
            return null;
        }

        // Store cid for lookup
        module.$el.attr('cid', module.cid);

        var children = module.children.map(getModules);
        // TODO {zack} Find a way to do this better
        var whitelist = ['cid', 'data', 'options', 'resource', 'extraData', 'extraState'];
        return Object.keys(module).reduce(function(obj, key) {
            if (whitelist.indexOf(key) !== -1) {
                obj[key] = module[key];
            }
            return obj;
        }, { name: module.className, children: children });
  })(P.app)`, render);

export default PinspectorApp;
