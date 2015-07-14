import CollapseButton from './CollapseButton';
import React from 'react/addons';

var CSSTransitionGroup = React.addons.CSSTransitionGroup;

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

    onClick() {
        this.props.onSelect(this.props.module);
    }

    render() {
        var module = this.props.module;
        if (!module) {
            return null;
        }

        var parentClassName = 'parent';
        var selected = module === this.props.selectedModule;
        if (selected) {
            parentClassName += ' selected';
        }

        var hasChildren = module.children.length > 0;
        var collapseButton = hasChildren ? (
            <CollapseButton
                collapsed={this.state.collapsed}
                click={this.clickCollapse.bind(this)} />
        ) : null;

        var childrenClassName = 'children';
        if (!this.state.collapsed) {
            childrenClassName += ' expanded';
        }

        var children = module.children.map(
            (child, i) => (
                <ModuleTree
                    {...this.props}
                    module={child}
                    key={`${module.name}-${i}-${child.name}`}
                />
        ));

        return (
            <li>
                {collapseButton}
                <div className={parentClassName}
                     onClick={this.onClick.bind(this)}
                     onMouseEnter={this.onMouseEnter.bind(this)}
                     onMouseLeave={this.onMouseLeave.bind(this)}>
                    {module.name}
                </div>
                <ol className={childrenClassName}>
                    <CSSTransitionGroup transitionName="module-tree">
                        {children}
                    </CSSTransitionGroup>
                </ol>
            </li>
        );
    }
}
ModuleTree.propTypes = {
    module: React.PropTypes.object,
    onSelect: React.PropTypes.func,
    selectedModule: React.PropTypes.object
};

export default ModuleTree;
