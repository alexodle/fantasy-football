import Header, {headerSelector} from './components/Header';
import React, {PropTypes} from 'react';
import {ChildrenPropType, LoadStateShape} from './Constants';
import {connect} from 'react-redux';
import {createFFComponentSelector} from './selectors/selectorUtils';
import {loadMyLeagues, loadUser} from './actions/LoadActions';
import {logout, loadFromLocalStorage} from './actions/AuthActions';

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

    // Ensure we load this BEFORE we render this component. It will finish
    // synchronously, and if it succeeds, we want to ensure we don't redirect to
    // the login screen.
    dispatch(loadFromLocalStorage());
  },

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadFromLocalStorage());
    dispatch(loadMyLeagues());
    dispatch(loadUser());
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
