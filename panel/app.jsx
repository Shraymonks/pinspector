
chrome.devtools.inspectedWindow.eval(`
(function getModules(module) {
    if (!module) {
        return null;
    }

    var children = module.children ?
        module.children.map(function(child) {
            return getModules(child);
        }) : [];

    return {
        name: module.className,
        children: children
    };
})(P.app)
`, (response) => {
    console.log(response);
    render(response);
});

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
        })
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

function render(app) {
    React.render(<ModuleTree module={app} />, document.getElementById('react-node'));
}
