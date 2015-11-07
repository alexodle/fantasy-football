import React from 'react';
import {ChildrenPropType} from '../Constants';

const FFPanel = React.createClass({

  propTypes: {
    children: ChildrenPropType,
    title: React.PropTypes.node
  },

  render() {
    const {title} = this.props;
    return (
      <div className='panel panel-default'>
        {!title ? null : (
          <div className='panel-heading'>
            <h3 className='panel-title'>{title}</h3>
          </div>
        )}
        <div className='panel-body'>
          {this.props.children}
        </div>
      </div>
    );
  }

});

export default FFPanel;
