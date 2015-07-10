import React from 'react';
import ModuleTree from './ModuleTree';

// CSS
import 'normalize.css';
import '../styles/main.css';

var PinspectorApp = React.createClass({
    render: function() {
        return (
            <div className="modules">
                <ol className="module-tree">
                    <ModuleTree module={this.props.module}/>
                </ol>
            </div>
        );
    }
});

function render(module) {
    React.render(<PinspectorApp module={module}/>, document.getElementById('content'));
}

chrome.devtools.inspectedWindow.eval(`
  (function getModules(module) {
      if (!module) {
          return null;
      }

      var children = module.children ?
          module.children.map(function(child) {
              return getModules(child);
          }) : [];

      // Store cid for lookup
      module.$el.attr('cid', module.cid);
      return {
          name: module.className,
          cid: module.cid,
          children: children
      };
  })(P.app)`, render);

export default PinspectorApp;
