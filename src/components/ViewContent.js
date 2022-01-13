/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import NextButton from './Exercises/NextButton';

class ViewContent extends Component {
  render() {
    if (this.props.page.info !== null) {
      return (
        <div className="content-exercise">
          <div className="content-main-body">
            <div className="content-title">{this.props.page.info.title}</div>
            <div className="content-description">{this.props.page.info.description} </div>
            <NextButton goToNext={this.props.goToNext} />
          </div>

        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }
}

export default ViewContent;
