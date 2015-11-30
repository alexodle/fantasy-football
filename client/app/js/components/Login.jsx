import FFPanel from './FFPanel';
import React, {PropTypes} from 'react';
import {loadAuth} from '../actions/LoadActions';
import {connect} from 'react-redux';

const Login = React.createClass({

  displayName: 'Login',

  propTypes: {
    dispatch: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      email: '',
      password: ''
    };
  },

  render() {
    const {email, password} = this.state;
    return (
      <FFPanel title='Log in'>
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
            />
          </div>
          <button type='submit' className='btn btn-default' onClick={this._onLogin}>Log in</button>
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

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Login);
