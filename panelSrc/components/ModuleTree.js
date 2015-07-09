import CollapseButton from './CollapseButton';
import React from 'react';

class ModuleTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        };
    }

    clickCollapse() {
        this.setState({collapsed: !this.state.collapsed});
    }

    render() {
        var module = this.props.module;
        if (!module) {
            return null;
        }

        var hasChildren = module.children.length > 0;
        if (hasChildren) {
            var children = module.children.map(function(child) {
                return (
                    <ModuleTree module={child} />
                );
            });

            var childrenClassName = 'children';
            if (!this.state.collapsed) {
                childrenClassName += ' expanded';
            }

            return (
                <li className="parent">
                    <CollapseButton
                        collapsed={this.state.collapsed}
                        click={this.clickCollapse.bind(this)} />
                    {module.name}
                    <ol className={childrenClassName}>
                        {children}
                    </ol>
                </li>
            );
        } else {
            return (
                <li>
                    {module.name}
                </li>
            );
        }
    }
}
ModuleTree.propTypes = {
    module: React.PropTypes.object
};

export default ModuleTree;
