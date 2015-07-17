import React from 'react/addons';
import {default as cx} from 'classnames';

import CollapseButton from './CollapseButton';
import Model from './Model';
import ModelDependentComponent from './ModelDependentComponent';
import ModuleDescriptor from './ModuleDescriptor';

import 'babel/polyfill';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

const COLLAPSED = ['Pin', 'Board'];

class ModuleTree extends ModelDependentComponent {
    constructor(props) {
        super(props, 'selectedModule');
        this.state.collapsed = props.module && COLLAPSED.includes(props.module.name);
    }

    componentDidUpdate() {
        const {module} = this.props;
        const {selectedModule} = this.state;

        if ((!module || !selectedModule) || (module.cid !== selectedModule.cid)) return;

        const element = React.findDOMNode(this.refs.module);
        const rect = element.getBoundingClientRect();

        if (!(rect.top >= 0 && rect.bottom <= window.innerHeight)) {
            element.scrollIntoView();
        }
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
        const cid = this.props.module.cid;
        const fn = `setSelectedElement('${cid}', ${focused})`;
        chrome.devtools.inspectedWindow.eval(fn, {
            useContentScriptContext: true
        });
    }

    onClick() {
        Model.selectedModule = this.props.module;
        this.setState({ collapsed: false });
        this.props.handleAction();
    }

    renderCollapseButton() {
        if (this.props.module.children.length > 0) {
            return (
                <CollapseButton
                    collapsed={this.state.collapsed}
                    click={this.clickCollapse.bind(this)}
                />
            );
        }
    }

    renderChildren() {
        const childClasses = cx({
            children: true,
            expanded: !this.state.collapsed
        });

        return (
            <ol className={childClasses}>
                <CSSTransitionGroup transitionName="module-tree">
                    {this.props.module.children.map((child, i) => (
                        <ModuleTree
                            {...this.props}
                            module={child}
                            key={`${module.name}-${i}-${child.name}`}
                        />
                    ))}
                </CSSTransitionGroup>
            </ol>
        );
    }

    renderModule() {
        const {module} = this.props;
        const {selectedModule} = this.state;

        const parentClasses = cx({
            parent: true,
            selected: module.cid === (selectedModule && selectedModule.cid)
        });

        return (
            <div className={parentClasses}
                 onClick={this.onClick.bind(this)}
                 onMouseEnter={this.onMouseEnter.bind(this)}
                 onMouseLeave={this.onMouseLeave.bind(this)}
                 ref="module">
                {module.name}
                <ModuleDescriptor module={module} />
            </div>
        );
    }

    render() {
        if (!this.props.module) {
            return null;
        }

        return (
            <li>
                {this.renderCollapseButton()}
                {this.renderModule()}
                {this.renderChildren()}
            </li>
        );
    }
}
ModuleTree.propTypes = {
    handleAction: React.PropTypes.func,
    module: React.PropTypes.object,
    onSelect: React.PropTypes.func,
    selectedModule: React.PropTypes.object
};

export default ModuleTree;
