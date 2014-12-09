"use strict";

var moment = require('moment');
var React = require('react');
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var PaymentDetailModal = require('./payment-detail-modal.jsx');
var Address = require('./address.jsx');
var PaymentDetailContent = require('./payment-detail-content.jsx');

var Payment = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    retryButtonClickHandler: React.PropTypes.func
  },

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

  handleDetailIconClick: function(id) {
    this.toggleDetails();
  },

  handleRetryButtonClick: function(id, e) {
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
    this.props.model.off('retryStart retryStop');
  },

  render: function() {
    var _this = this;
    var doneButton, retryLink, refreshIcon, fromAddress, toAddress;
    var paymentItemClasses = 'modal-container';
    var rippleGraphLink = 'http://www.ripplecharts.com/#/graph/' + this.props.model.get('transaction_hash');

    // highlight new transactions
    if (this.props.model.get('new')) {
      paymentItemClasses += ' highlight';
    }

    // display 'From Address' for received payments or 'To Address' for sent payments
    if (this.props.model.get('direction') === 'from-ripple') {
      fromAddress = (<Address
        direction="from"
        address={this.props.model.get('fromAddress').address} />);
        toAddress = <p>&nbsp;</p>;
    } else {
      toAddress = (<Address
        direction="to"
        address={this.props.model.get('toAddress').address} />);
      fromAddress = <p>&nbsp;</p>;
    }

    if (this.props.model.get('state') === 'incoming') {
      doneButton = (
        <ModalTrigger modal={<PaymentDetailModal model={this.props.model} />}>
          <button className="btn pull-right">
            Process
          </button>
        </ModalTrigger>
      );
    } else {
      doneButton = false;
    }

    // show retry link for failed payments
    if (this.props.model.get('state') === 'failed') {
      retryLink=(
        <a onClick={this.handleRetryButtonClick.bind(this,this.props.model.get('id'))}>
          Retry?
        </a>
      );
    } else {
      retryLink = false;
    }

    return (
      <li className={"payment-item list-group-item " + paymentItemClasses} ref="container">
        <div className="row">
          <div className="col-sm-4">
            <p>
              <span className="header">To Amount: </span>
              <span className="data">{this.props.model.get('to_amount')} </span>
              <span className="currency">{this.props.model.get('to_currency')}</span>
            </p>
            {toAddress}
            <p>
              <span className="header">Destination Tag:</span>
            </p>
            {this.props.model.get('toAddress').tag}
          </div>
          <div className="col-sm-4">
            <p>
              <span className="header">From Amount: </span>
              <span className="data">{this.props.model.get('from_amount')} </span>
              <span className="currency">{this.props.model.get('from_currency')}</span>
            </p>
            {fromAddress}
          </div>
          <div className="col-sm-4 text-right">
            <p>
              <span className="header">Status: </span>
              <span className="data">{this.props.model.get('state')} </span>
              <span className="header">{retryLink} </span>
              <span className={this.state.refreshIconClasses} />
            </p>
            {doneButton}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8">
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <a href={rippleGraphLink} target="_blank">Ripple Graph Link</a>
          </div>
        </div>
        <div className="clearfix">
          <span className="date pull-left">
            {moment(this.props.model.get('createdAt')).format('MMM D, YYYY HH:mm z')}
          </span>
          <span
            className={this.state.chevronIcon}
            onClick={this.handleDetailIconClick.bind(this, this.props.model.get('id'))}
          />
        </div>
        <div>
          {this.state.showDetails ?
            <PaymentDetailContent model={this.props.model} paymentDetailClassName={"details"}/>
            : false}
        </div>
      </li>
    );
  }
});

module.exports = Payment;
