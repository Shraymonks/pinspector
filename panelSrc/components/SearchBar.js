import React from 'react';

class SearchBar extends React.Component {
    debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
            };
            var call = !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (call) func.apply(context, args);
        };
    }

    onKeyUp(evt) {
        if (this.props.root.length <= 0) {
            return;
        }

        var query = new RegExp("(" + evt.target.value + ")", "gim");

        for (var i = 0; i < this.props.root.length; i++) {
            var el = this.props.root[i];
            var e = el.innerHTML;
            var en = e.replace(/(<span>|<\/span>)/igm, "");
            var ne = en.replace(query, `<span class="search-hl">$1</span>`);
            this.props.root[i].innerHTML = ne;
        };
    }

    render() {
        return (
            <div id="toolbar">
                <span id="search-control">
                    <input
                        id="search-input"
                        placeholder="Find"
                        onKeyUp={this.debounce(this.onKeyUp.bind(this), 100)}
                    />
                    <label id="search-matches" for="search-input">1 of 89</label>
                    <div className="search-nav-controls">
                        <div className="search-nav search-nav-prev"></div>
                        <div className="search-nav search-nav-next"></div>
                    </div>
                </span>
            </div>
        );
    }
}
SearchBar.propTypes = {
    root: React.PropTypes.object
};

export default SearchBar;
