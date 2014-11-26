"use strict";

var _ = require('lodash');
var React = require('react');
var DocumentTitle = require('react-document-title');
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var Button = require('react-bootstrap').Button;
var PaymentActions = require('../actions.js');
var CurrentPath = require('react-router').CurrentPath;
var ActiveState = require('react-router').ActiveState;
var Link = require('react-router').Link;
var url = require('url');
var numeral = require('numeral');

var PaymentItem = require('./payment.jsx');

var Collection = require('../collections/payments.js');
var collection = new Collection();

var PaymentCreateFormModel = require('../models/payment-create.js');
var paymentCreateFormModel = new PaymentCreateFormModel();

var PaymentCreateForm = require('./payment-create.jsx');

var Payments = React.createClass({
  mixins: [CurrentPath, ActiveState],

  getStateFromStore: function(props) {
    props = props || this.props;

    return {
      payments: collection
    };
  },

  getInitialState: function() {
    return this.getStateFromStore();
  },

  componentDidMount: function() {
    collection.on('sync change', this.handleCollectionSync);
    PaymentActions.updateUrl(this.getCurrentPath());
  },

  componentWillUnmount: function() {
    collection.off('sync');
    collection.off('change');
  },

  handleCollectionSync: function(collection) {

    // model syncs bubble up through collection and are passed into this handler as well
    if (_.isUndefined(collection.length)) {
      this.forceUpdate();

      return false;
    }

    this.setState({
      payments: collection
    });
  },

  handleItemClick: function(id) {
  },

  handleDoneButtonClick: function(id) {
    PaymentActions.flagAsDone(id);
  },

  handleRetryButtonClick: function(id) {
    PaymentActions.retryFailedPayment(id);
  },

  directionMap: {
    incoming: "from-ripple",
    outgoing: "to-ripple"
  },

  createTitle: function(direction) {
    direction = direction || 'incoming';

    var titleMap = {
      incoming: 'Received Payments',
      outgoing: 'Sent Payments'
    };

    return titleMap[direction];
  },

  render: function() {
    var _this = this,
        direction = this.props.params.direction,
        state = this.props.params.state,
        tertiaryNav;

    // less than ideal, will refactor when we have pagination, if not sooner.
    // We could keep different collections for each type, but it depends on use case.
    var paymentItems = this.state.payments.chain()
      .filter(function(model) {
        return model.get('direction') === _this.directionMap[direction];
      })
      .filter(function(model) {
        return state === 'all'? true : model.get('state') === state;
      })
      .map(function(model) {

        return (
          <PaymentItem
            key={model.get('id')}
            model={model}
            itemClickHandler={this.handleItemClick}
            doneButtonClickHandler={this.handleDoneButtonClick}
            retryButtonClickHandler={this.handleRetryButtonClick}
          />
        );
    }, this);

    //todo make separate component with iterator. Oy.
    if (direction === 'incoming') {
      tertiaryNav = (
        <div className="nav-tertiary">
          <Link to='payments' params={{direction: 'incoming', state: 'all'}}>All</Link>
          <Link to='payments' params={{direction: 'incoming', state: 'incoming'}}>Queued</Link>
          <Link to='payments' params={{direction: 'incoming', state: 'succeeded'}}>Succeeded</Link>
        </div>);
    } else {
      tertiaryNav = (
        <div className="nav-tertiary">
          <Link to='payments' params={{direction: 'outgoing', state: 'all'}}>All</Link>
          <Link to='payments' params={{direction: 'outgoing', state: 'outgoing'}}>Queued</Link>
          <Link to='payments' params={{direction: 'outgoing', state: 'pending'}}>Pending</Link>
          <Link to='payments' params={{direction: 'outgoing', state: 'succeeded'}}>Succeeded</Link>
          <Link to='payments' params={{direction: 'outgoing', state: 'failed'}}>Failed</Link>
        </div>);
    }

    return (
      <DocumentTitle title={this.createTitle(direction)}>
        <div>
          <div className="row">
            <div className="col-sm-12 col-xs-12">
              <h1>Payments:
                <span className="header-links">
                  <Link to='payments' params={{direction: 'outgoing', state: 'all'}}>
                    Sent
                  </Link>
                  <Link to='payments' params={{direction: 'incoming', state: 'all'}}>
                    Received
                  </Link>
                  <ModalTrigger modal={<PaymentCreateForm model={paymentCreateFormModel} />}>
                    <a>Send Payment</a>
                  </ModalTrigger>
                </span>
              </h1>
            </div>
          </div>
          <div className='row'>
            <div className="col-xs-12">
              {tertiaryNav}
            </div>
          </div>
          <div className="row">
            <ul className="list-group">
            {paymentItems}
            </ul>
          </div>
        </div>
      </DocumentTitle>
    );
  }
});

module.exports = Payments;
