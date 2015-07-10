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

    onMouseEnter() {
        this.toggleSelected(true);
    }

    onMouseLeave() {
        this.toggleSelected(false);
    }

    toggleSelected(focused) {
        var cid = this.props.module.cid;
        var fn = 'setSelectedElement(\'' + cid + '\',' + focused + ')';
        chrome.devtools.inspectedWindow.eval(fn, {
            useContentScriptContext: true
        });
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
                    <span onMouseEnter={this.onMouseEnter.bind(this)}
                          onMouseLeave={this.onMouseLeave.bind(this)} >
                        {module.name}
                    </span>
                    <ol className={childrenClassName}>
                        {children}
                    </ol>
                </li>
            );
        } else {
            return (
                <li>
                    <span onMouseEnter={this.onMouseEnter.bind(this)}
                          onMouseLeave={this.onMouseLeave.bind(this)} >
                        {module.name}
                    </span>
                </li>
            );
        }
    }
}
ModuleTree.propTypes = {
    module: React.PropTypes.object
};

export default ModuleTree;
