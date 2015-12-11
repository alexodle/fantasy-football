import FFPanel from '../FFPanel';
import Loading from '../Loading';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {login} from '../../actions/AuthActions';
import {selectAuthMeta} from '../../selectors/metaSelectors';
import {selectLogoutReason} from '../../selectors/clientSelectors';
import {selectNextPath} from '../../selectors/routeSelectors';

const Login = React.createClass({

  displayName: 'Login',

  propTypes: {
    authMeta: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      didFailFetching: PropTypes.bool.isRequired,
      statusCode: PropTypes.number
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    logoutReason: PropTypes.string,
    nextPath: PropTypes.string
  },

  getInitialState() {
    return {
      email: '',
      password: ''
    };
  },

  componentDidMount() {
    this.refs.usernameInput.focus();
  },

  componentDidUpdate(prevProps) {
    const {authMeta} = this.props;
    const prevAuthMeta = prevProps.authMeta;
    if (prevAuthMeta.isFetching && !authMeta.isFetching) {
      this.refs.usernameInput.select();
    }
  },

  render() {
    const {authMeta, logoutReason} = this.props;
    const {email, password} = this.state;

    let body = null;

    if (authMeta.isFetching) {
      body = <Loading />;

    } else {
      const disabled = !email.length || !password.length;
      const error = authMeta.didFailFetching;

      const isAuthError = authMeta.statusCode === 403;

      const formErrorClass = isAuthError ? ' has-error' : '';

      let errorText = null;
      if (error) {
        errorText = isAuthError ?
          'Bad username/password.' :
          'Failed to connect! Try again.';
      } else if (logoutReason) {
        errorText = logoutReason;
      }

      body = (
        <div>
          {!errorText ? null : (
            <div className='alert alert-danger' role='alert'>
              {errorText}
            </div>
          )}
          <form>
            <div className={'form-group' + formErrorClass}>
              <label htmlFor='email'>Email address</label>
              <input
                  ref='usernameInput'
                  value={email}
                  type='email'
                  className='form-control'
                  id='email'
                  placeholder='Email'
                  onChange={this._onEmailChange}
              />
            </div>
            <div className={'form-group' + formErrorClass}>
              <label htmlFor='password'>Password</label>
              <input
                  value={password}
                  type='password'
                  className='form-control'
                  id='password'
                  placeholder='Password'
                  onChange={this._onPasswordChange}
              />
            </div>
            <button
                type='submit'
                className='btn btn-default'
                onClick={this._onLogin}
                disabled={disabled}
            >Log in</button>
          </form>
        </div>
      );
    }

    return (
      <div className='row'>
        <div className='col-md-6'>
          <FFPanel title='Log in'>
            {body}
          </FFPanel>
        </div>
        <div className='col-md-6'>
          <FFPanel title='Sign up'>
            <p>TODO</p>
          </FFPanel>
        </div>
      </div>
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
    const {dispatch, nextPath} = this.props;
    dispatch(login(email, password, nextPath));

    this.setState({ password: '' });
  }

});

function mapStateToProps(state) {
  return {
    authMeta: selectAuthMeta(state),
    logoutReason: selectLogoutReason(state),
    nextPath: selectNextPath(state)
  };
}

export default connect(mapStateToProps)(Login);
