"use strict";

var moment = require('moment');
var sjcl = require('ripple-lib/build/sjcl');
var Address = require('./address.jsx');

var React = require('react');

var PaymentDetailContent = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    paymentDetailClassName: React.PropTypes.string
  },

  render: function() {
    return (
      <div className={this.props.paymentDetailClassName}>
        <div className="row border-bottom">
          Updated {moment(this.props.model.get('updatedAt')).format('MMM D, YYYY HH:mm z')}
        </div>
        <br />
        <div className="row">
          Transaction Id: {this.props.model.get('id')}
        </div>
        <br />
        <div className="row">
        </div>
        <div className="row">
          <div className="col-sm-5 border-bottom">
            <div className="row">
              <div className="col-sm-12">
                <Address
                  direction="from"
                  address={this.props.model.get('fromAddress').address}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                Tag:
              </div>
              <div className="col-sm-9">
                {this.props.model.get('fromAddress').tag || 'none'}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                Balance Changes:
              </div>
            </div>
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">
                {this.props.model.get('from_amount')} {this.props.model.get('from_currency')}
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-sm-offset-1 border-bottom">
            <div className="row">
              <div className="col-sm-12">
                <Address
                  direction="to"
                  address={this.props.model.get('toAddress').address}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                Tag:
              </div>
              <div className="col-sm-9">
                {this.props.model.get('toAddress').tag || 'none'}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                Balance Changes:
              </div>
            </div>
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">
                +{this.props.model.get('to_amount')} {this.props.model.get('to_currency')}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          Invoice Id: {this.props.model.get('invoice_id') || 'none'}
        </div>
        <br />
        <div className="row">
          Transaction Hash: {this.props.model.get('transaction_hash') || 'none'}
        </div>
        <br />
        <div className="row">
          Memo: {
            this.props.model.get('memo') ?
              sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(this.props.model.get('memo'))) : 'none'
          }
        </div>
      </div>
    );
  }
});

module.exports = PaymentDetailContent;
