import Header, {headerSelector} from './components/Header';
import React, {PropTypes} from 'react';
import {ChildrenPropType, LoadStateShape} from './Constants';
import {connect} from 'react-redux';
import {createFFComponentSelector} from './selectors/selectorUtils';
import {loadUserAndLeagues} from './actions/LoadActions';
import {logout, loadAuthFromLocalStorage} from './actions/AuthActions';

const App = React.createClass({

  displayName: 'App',

  propTypes: {
    children: ChildrenPropType,
    dispatch: PropTypes.func.isRequired,
    headerProps: PropTypes.any,
    loadState: LoadStateShape
  },

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadAuthFromLocalStorage());
    dispatch(loadUserAndLeagues());
  },

  render() {
    const {children, headerProps} = this.props;
    return (
      <div className='container'>
        <Header {...headerProps} onLogout={this._onLogout} />
        <div className='row'>
          <div className='col-md-12'>
            {children}
          </div>
        </div>
      </div>
    );
  },

  _onLogout() {
    this.props.dispatch(logout());
  }

});


const selector = createFFComponentSelector({
  headerProps: headerSelector
});

export default connect(selector)(App);
