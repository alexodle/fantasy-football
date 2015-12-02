import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';

export default function requiresAuth(Component) {

  const AuthenticatedComponent = React.createClass({

    propTypes: {
      dispatch: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool.isRequired,
      location: PropTypes.object.isRequired
    },

    componentWillMount() {
      this._ensureAuth();
    },

    componentWillReceiveProps(nextProps) {
      this._ensureAuth(nextProps);
    },

    render() {
      const {isAuthenticated} = this.props;
      return !isAuthenticated ? null : <Component />;
    },

    _ensureAuth(props = null) {
      props = props || this.props;

      const {isAuthenticated, location, dispatch} = props;
      if (!isAuthenticated) {
        const redirectAfterLogin = location.pathname;
        dispatch(pushState(null, `/login?next=${redirectAfterLogin}`));
      }
    }

  });

  const mapStateToProps = (state) => ({
    isAuthenticated: !!state.meta.auth.lastUpdated && !state.meta.auth.didInvalidate,
    location: state.router.location
  });

  return connect(mapStateToProps)(AuthenticatedComponent);

}
