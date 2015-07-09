import React from 'react';

class ModuleTree extends React.Component {
    render() {
        var module = this.props.module;
        if (!module) {
            return null;
        }

        var children = module.children.map(function(child) {
            return (
                <ModuleTree module={child} />
            );
        });
        return (
            <div className="module">
                {module.name}
                {children}
            </div>
        );
    }
}
ModuleTree.propTypes = {
    module: React.PropTypes.object
};

export default ModuleTree;
