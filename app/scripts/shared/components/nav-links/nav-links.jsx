var React = require('react');
var Link = require('react-router').Link;

var NavLinks = React.createClass({
  propTypes: {
    links: React.PropTypes.array
  },

      //<ul className="nav navbar-nav navbar-right">
  getDefaultProps: function() {
    return {className: "nav navbar-nav"};
  },

  getLinks: function(links) {
    var items = links.map(function(link, i) {
      return(
        <li>
          <Link key={i++} to={link.href}>
            {link.text}
          </Link>
        </li>
      );
    });

    return items;
  },

  render: function() {
    var links = this.getLinks(this.props.links);

    return (
      <ul className={this.props.className}>
        {links}
      </ul>
    );
  }
});

module.exports = NavLinks;
