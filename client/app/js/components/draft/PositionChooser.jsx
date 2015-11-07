import _ from 'lodash';
import React, {PropTypes} from 'react';

const PositionChooser = React.createClass({

  propTypes: {
    onChange: PropTypes.func.isRequired,
    positions: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired
  },

  render() {
    const {positions, value} = this.props;
    return (
      <div>
        <ul>
          {_.map(positions, (p) => {
            return (
              <li key={p}>
                <a
                    href=''
                    onClick={_.partial(this._onChange, p)}
                    enabled={value !== p}
                >{p}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },

  _onChange(p, ev) {
    ev.preventDefault();
    this.props.onChange(p);
  }

});

export default PositionChooser;
