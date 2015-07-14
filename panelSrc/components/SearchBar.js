import React from 'react';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { matchcount: 0 };
    }

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

        var matches = 0;
        for (var i = 0; i < this.props.root.length; i++) {
            let el = this.props.root[i];
            let e = el.innerHTML;

            let match = e.match(query);
            matches += match ? match.length : 0;

            let en = e.replace(/(<em>|<\/em>)/igm, "");
            let ne = en.replace(query, `<em>$1</em>`);
            this.props.root[i].innerHTML = ne;
        };

        this.setState({ matchcount: matches });
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
                    <label id="search-matches" for="search-input">
                        1 of {this.state.matchcount}
                    </label>
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
