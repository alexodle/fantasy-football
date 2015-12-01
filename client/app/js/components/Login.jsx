import FFPanel from './FFPanel';
import React, {PropTypes} from 'react';
import {loadAuth} from '../actions/LoadActions';
import {connect} from 'react-redux';
import {selectAuthMeta} from '../selectors/metaSelectors';

const Login = React.createClass({

  displayName: 'Login',

  propTypes: {
    authMeta: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      didFailFetching: PropTypes.bool.isRequired,
      statusCode: PropTypes.number
    }).isRequired,
    dispatch: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      email: '',
      password: ''
    };
  },

  render() {
    const {authMeta} = this.props;
    const {email, password} = this.state;

    const disabled = authMeta.isFetching;
    const error = authMeta.didFailFetching;

    const isAuthError = authMeta.statusCode === 403;

    return (
      <FFPanel title='Log in'>
        {!error ? null : (
          <div className='alert alert-danger' role='alert'>
            {isAuthError ?
              'Bad username/password.' :
              'Failed to connect! Try again.'}
          </div>
        )}
        <form>
          <div className='form-group'>
            <label htmlFor='email'>Email address</label>
            <input
                value={email}
                type='email'
                className='form-control'
                id='email'
                placeholder='Email'
                onChange={this._onEmailChange}
                disabled={disabled}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
                value={password}
                type='password'
                className='form-control'
                id='password'
                placeholder='Password'
                onChange={this._onPasswordChange}
                disabled={disabled}
            />
          </div>
          <button
              type='submit'
              className='btn btn-default'
              onClick={this._onLogin}
              disabled={disabled}
          >Log in</button>
        </form>
      </FFPanel>
    );
  },

  _onEmailChange(ev) {
    this.setState({ email: ev.target.value });
  },

  _onPasswordChange(ev) {
    this.setState({ password: ev.target.value });
  },

  _onLogin(ev) {
    ev.preventDefault();

    const {email, password} = this.state;
    const {dispatch} = this.props;
    dispatch(loadAuth(email, password));
  }

});

function mapStateToProps(state) {
  return {
    authMeta: selectAuthMeta(state)
  };
}

export default connect(mapStateToProps)(Login);
