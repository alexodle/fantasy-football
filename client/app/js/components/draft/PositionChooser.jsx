import _ from 'lodash';
import React, {PropTypes} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap/lib';

///
/// NO NEED FOR A SELECTOR DEFINITION HERE. THIS IS JUST USED BY PlayerChooser,
/// WHICH IS NOT A SMART COMPONENT.
///

export default React.createClass({

  displayName: 'PositionChooser',

  propTypes: {
    ineligibleDraftPositions: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    positions: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired
  },

  render() {
    const {ineligibleDraftPositions, positions, value} = this.props;
    return (
      <div>
        <ButtonGroup>
          {_.map(positions, (p) => {
            return (
              <Button
                  key={p}
                  className={value === p ? 'active' : ''}
                  disabled={_.contains(ineligibleDraftPositions, p)}
                  onClick={_.partial(this._onChange, p)}
              >{p}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>
    );
  },

  _onChange(p, ev) {
    ev.preventDefault();
    this.props.onChange(p);
  }

});
