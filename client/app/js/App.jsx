import Header, {headerSelector} from './components/Header';
import React, {PropTypes} from 'react';
import {ChildrenPropType, LoadStateShape} from './Constants';
import {connect} from 'react-redux';
import {createFFComponentSelector} from './selectors/selectorUtils';
import {loadMyLeagues, loadUser} from './actions/LoadActions';

// noop3
const App = React.createClass({

  displayName: 'App',

  propTypes: {
    children: ChildrenPropType,
    dispatch: PropTypes.func.isRequired,
    headerProps: PropTypes.any,
    loadState: LoadStateShape
  },

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadMyLeagues());
    dispatch(loadUser());
  },

  render() {
    const {children, headerProps} = this.props;
    return (
      <div className='container'>
        <Header {...headerProps} />
        <div className='row'>
          <div className='col-md-12'>
            {children}
          </div>
        </div>
      </div>
    );
  }

});


const selector = createFFComponentSelector({
  headerProps: headerSelector
});

export default connect(selector)(App);
