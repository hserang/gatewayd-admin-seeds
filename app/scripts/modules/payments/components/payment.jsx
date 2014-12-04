"use strict";

var moment = require('moment');
var React = require('react');
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var ModalPaymentDetails = require('./payment-detail.jsx');
var PaymentDetailsContent = require('./payment-detail-content.jsx');

var Payment = React.createClass({
  toggleDetails: function() {
    var iconMap = {
      down: 'pull-right glyphicon glyphicon-chevron-down',
      up: 'pull-right glyphicon glyphicon-chevron-up'
    };

    if (this.state.chevronIcon === iconMap.down) {
      this.setState({
        chevronIcon: iconMap.up,
      });
    } else {
      this.setState({
        chevronIcon: iconMap.down
      });
    }

    this.setState({
      showDetails: !this.state.showDetails
    });
  },

  handleLinkClick: function(e) {
    e.stopPropagation();
  },

  handleItemClick: function(id) {
    this.toggleDetails();
  },

  handleProcessButtonClick: function(e) {
    e.stopPropagation();
  },

  handleRetryButtonClick: function(id, e) {
    e.stopPropagation();

    this.props.retryButtonClickHandler(id);
  },

  showSpinningIcon: function() {
    this.setState({
      refreshIconClasses: 'glyphicon glyphicon-refresh glyphicon-spin'
    });
  },

  hideSpinningIcon: function() {
    this.setState({
      refreshIconClasses: ''
    });
  },

  getInitialState: function() {
    return {
      refreshIconClasses: '',
      chevronIcon: 'pull-right glyphicon glyphicon-chevron-down',
      showDetails: false
    };
  },

  componentDidMount: function() {
    this.props.model.on('retryStart', this.showSpinningIcon);
    this.props.model.on('retryStop', this.hideSpinningIcon);
  },

  componentWillUnmount: function() {
    this.props.model.off('retryStart');
    this.props.model.off('retryStop');
  },

  render: function() {
    var _this = this;
    var doneButton, retryLink, refreshIcon, address;
    var paymentItemClasses = 'modal-container';
    var rippleGraphLink = 'http://www.ripplecharts.com/#/graph/' + this.props.model.get('transaction_hash');

    if (this.props.model.get('new')) {
      paymentItemClasses += ' highlight';
    }

    if (this.props.model.get('direction') === 'from-ripple') {
      address = ['From', this.props.model.get('fromAddress').address];
    } else {
      address = ['To', this.props.model.get('toAddress').address];
    }


    //make a done button component and put this logic there!!
    if (this.props.model.get('state') === 'incoming') {
      doneButton = (
        <ModalTrigger modal={<ModalPaymentDetails model={this.props.model} />}>
          <button
            onClick={this.handleProcessButtonClick}
            className="btn pull-right"
          >
            Process
          </button>
        </ModalTrigger>
      );
    } else {
      doneButton = null;
    }

    if (this.props.model.get('state') === 'failed') {
      retryLink=(
        <a onClick={this.handleRetryButtonClick.bind(this,this.props.model.get('id'))}>
          Retry?
        </a>
      );
    } else {
      retryLink = null;
    }

    return (
      <div className={paymentItemClasses} ref="container">
        <li className="list-group-item">
          <div className="row">
            <div className="col-sm-4">
              To Currency: {this.props.model.get('to_currency')} {this.props.model.get('to_amount')}
            </div>
            <div className="col-sm-1">
            </div>
            <div className="col-sm-4">
              From Currency: {this.props.model.get('from_currency')} {this.props.model.get('from_amount')}
            </div>
            <div className="col-sm-3">
              Status: {this.props.model.get('state')} {retryLink} <span className={this.state.refreshIconClasses} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              Destination Tag: {this.props.model.get('toAddress').tag}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-8">
              {address[0]} Address: {address[1]}
            </div>
            <div className="col-sm-4">
              {doneButton}
            </div>
          </div>
          <div className="row border-bottom">
            <div className="col-sm-12">
              <a href={rippleGraphLink} onClick={this.handleLinkClick}>Ripple Graph Link</a>
            </div>
          </div>
          <div className="clearfix">
            <span className="pull-left">
              {moment(this.props.model.get('createdAt')).format('MMM D, YYYY HH:mm z')}
            </span>
            <span
              className={this.state.chevronIcon}
              onClick={this.handleItemClick.bind(this, this.props.model.get('id'))}
            />
          </div>
        </li>
        <div>
          {this.state.showDetails ? <PaymentDetailsContent model={this.props.model} className={"details"}/> : false}
        </div>
      </div>
    );
  }
});

module.exports = Payment;
