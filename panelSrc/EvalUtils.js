function constructModuleTree(callback) {
    chrome.devtools.inspectedWindow.eval(`
        (function(P) {
            if (!P) { return null; }

        var moduleMap = {};

        function getModules(module) {
            // Store cid for lookup
            module.$el.attr('cid', module.cid);

            var children = module.children.map(getModules);
            // TODO {zack} Find a way to do this better
            var whitelist = ['cid', 'data', 'options', 'resource', 'extraData', 'extraState'];
            var mod = Object.keys(module).reduce(function(obj, key) {
                if (whitelist.indexOf(key) !== -1) {
                    obj[key] = module[key];
                }
                return obj;
            }, { name: module.className, children: children });
            mod =  JSON.parse(JSON.stringify(mod, function(property, value) {
                if (value instanceof jQuery) {
                    return '<jQuery object>';
                }
                return value;
            }));
            moduleMap[mod.cid] = mod;
            return mod;
        }

        var module = getModules(P.app);

        return {
            module: module,
            moduleMap: moduleMap,
            user: P.currentUser
        }
    })(P)`, callback);
}

function renderWithNewFields(cid, fields) {
    chrome.devtools.inspectedWindow.eval(`
        function renderByCid(cid, newFields, module) {
            if (!module) {
                return null;
            }
            if (module.cid === cid) {
                Object.keys(newFields).forEach(function(field) {
                    console.log('extending field: ', field);
                    _.extend(module[field], newFields[field]);
                });
                module.render();
                return;
            }
            if (module.children) {
                module.children.forEach(function(child) {
                    renderByCid(cid, newFields, child);
                });
            }
        }
        renderByCid('${cid}', ${JSON.stringify(fields)}, P.app);`,
        (result, exception) => console.error(exception)
    );
}

export {
    constructModuleTree,
    renderWithNewFields
};
