import React from 'react';

import ModuleTree from './ModuleTree';
import SplitPane from './SplitPane';

// CSS
import 'normalize.css';
import '../styles/main.css';

class PinspectorApp extends React.Component {
    render() {
        return (
            <SplitPane
                leftPane={
                    <div className="modules">
                        <ol className="module-tree">
                            <ModuleTree module={this.props.module}/>
                        </ol>
                    </div>
                }
            />
        );
    }
}

function render(module) {
    React.render(<PinspectorApp module={module}/>, document.getElementById('content'));
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
