import React from 'react';

class SearchBar extends React.Component {
  onKeyUp() {
    if (this.props.root.length <= 0) {
        return;
    }

    var query = new RegExp("(" + document.getElementById('search-input').value + ")", "gim");

    for (var i = 0; i < this.props.root.length; i++) {
        var el = this.props.root[i];
        var text = el.value;
        var e = el.innerHTML;
        var en = e.replace(/(<span>|<\/span>)/igm, "");
        this.props.root[i].innerHTML = en;
        var ne = en.replace(query, "<span>$1</span>");
        this.props.root[i].innerHTML = ne;
    };
  }

  render() {
      return (
          <div id="toolbar">
              <span id="search-control">
                  <input id="search-input" placeholder="Find" onKeyUp={this.onKeyUp.bind(this)} />
              </span>
          </div>
      );
  }
}
SearchBar.propTypes = {
    root: React.PropTypes.object
};


export default SearchBar;
