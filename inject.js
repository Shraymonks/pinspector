/**
 * Display an overlay on top of the 'selected' element. This function
 * is called from ModuleTree.js in the panel.
 *
 * @param {string} cid The module cid that corresponds to the element
 * @param {boolean} select Show or hide the overlay
 */
function setSelectedElement(cid, select) {
    if (select) {
        var element = getElementByCid(cid);
        if (element) {
            var style = getComputedStyle(element);
            var box = element.getBoundingClientRect();
            overlay.style.left = box.left + 'px';
            overlay.style.top = box.top + 'px';
            overlay.style.width = box.right - box.left + 'px';
            overlay.style.height = box.bottom - box.top + 'px';
            overlay.style.borderRadius = style['border-radius'];
            overlay.style.visibility = 'visible';
        }
    } else {
        overlay.style.visibility = 'hidden';
    }
}

/**
 * Get the element that corresponds to a given cid. Allow map refreshes
 * for the case of dynamic content creation.
 *
 * @param {string} cid The module cid that corresponds to the element
 * @return {Node} the corresponding DOM node
 */
var cidMap = {};
function getElementByCid(cid) {
    if (!cidMap[cid]) {
        refreshCidMap();
    }
    return cidMap[cid];
}

/**
 * Walk the entire DOM tree and map each module element to its cid
 */
function refreshCidMap() {
    var elements = document.getElementsByTagName('*');
    for (var i = 0, n = elements.length; i < n; i++) {
        var el = elements[i];
        if (el.hasAttribute('cid')) {
            cidMap[el.getAttribute('cid')] = el;
        }
    }
}

function getCid(element) {
    if (!element) return;

    if (element.hasAttribute('cid')) {
        return element.getAttribute('cid');
    }
    return getCid(element.parentNode);
}

/**
 * Create the overlay element and throw it naked on the body
 */
var overlay;
function createOverlay() {
    overlay = document.createElement('div');
    overlay.style['backgroundColor'] = 'rgba(81, 173, 250, 0.48)';
    overlay.style['position'] = 'absolute';
    overlay.style['zIndex'] = 1000000;
    document.body.appendChild(overlay);
}
createOverlay();

function addAppChangeListener() {
    var target = document.body;
    var config = {
        childList: true,
        subtree: true
    };

    var observer = new MutationObserver(function(mutations) {
        chrome.runtime.sendMessage('update');
    });

    observer.observe(target, config);
}
addAppChangeListener();
