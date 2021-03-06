var panels = chrome.devtools.panels;

/*
 * Keep this function flat because we call .toString() on it below. Cannot
 * reference any other functions
 */
function getPanelContents() {
    if (window.P && $0) {
        var app = window.P.app;
        var module, element;

        // Find first module
        while (!module) {
            element = element ? element.parentNode : $0;
            if (element === document.body) {
                module = {};
            } else {
                module = app._getDescendantByElement(element);
            }
        }
        // window.pinmod = module;

        // Shallow copy contents
        var contents = {};
        Object.keys(module).forEach(function(key) {
            contents[key] = module[key];
        });
        // Add a readable name from prototype className
        contents.$$Module = module.className;
        return contents;
    } else {
        return {};
    }
}

chrome.devtools.inspectedWindow.eval('location.hostname', function(hostname) {
    if (hostname.includes('.pinterdev.com') || hostname.includes('.pinterest.com')) {
        panels.elements.createSidebarPane("Module", function (sidebar) {
            panels.elements.onSelectionChanged.addListener(function updateElementProperties() {
                sidebar.setExpression("(" + getPanelContents.toString() + ")()");
            });
        });

        panels.create("Pinspector", "img/angular.png", "panelDist/index.html", function(panel) {
            panel.onShown.addListener(function(panelWindow) {
                panelWindow.dispatchEvent(new Event('shown'));
            });
        });
    }
});
