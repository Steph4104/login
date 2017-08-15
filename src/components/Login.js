import React, { Component } from 'react'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'
import { gql, graphql, compose } from 'react-apollo'
import logo from '../img/govt-of-canada-logo.png';

class Login extends Component {

  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: ''
  }

  render() {

    return (
      <div>
<img src={logo} alt='Government canada logo'/>
        <h1 className='mv3'>{this.state.login ? 'GCTools Sign In' : 'Sign Up'}</h1>
        <div className='flex flex-column'>
          {!this.state.login &&
<div>
	<label htmlFor='username'>Username</label>
          <input
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
            type='text'
		name='username'
            placeholder='Your name'
          />
</div>}
	<label htmlFor='email'>Username or Email</label>
          <input
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
            type='text'
		name='email'
            placeholder='Your email address'
          />
<label htmlFor="password">Password</label>
          <input
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
            type='password'
name='password'
            placeholder='Choose a safe password'
          />
        </div>
        <div className='flex mt3'>
          <div
            className='pointer  button'
            onClick={() => this._confirm()}
          >
            {this.state.login ? 'Sign In' : 'create account' }
          </div>
</div>

<div className='remember'><input type="checkbox" name="remember" value="remember" /><label htmlFor='remember'>Remember me</label>
</div>
<div className='problems'><a href='#'>Problems with sign in?</a></div>
<div className="noaccount"><p> Don`t have an account?</p>  
          <span
            className='register'
            onClick={() => this.setState({ login: !this.state.login })}
          >
            {this.state.login ? 'Register' : 'already have an account?'}
          </span>
</div>
        
      </div>
    )
  }

 _confirm = async () => {
  const { name, email, password } = this.state
  if (this.state.login) {
    const result = await this.props.signinUserMutation({
      variables: {
        email,
        password
      }
    })
    const id = result.data.signinUser.user.id
    const token = result.data.signinUser.token
    this._saveUserData(id, token)
  } else {
    const result = await this.props.createUserMutation({
      variables: {
        name,
        email,
        password
      }
    })
    const id = result.data.signinUser.user.id
    const token = result.data.signinUser.token
    this._saveUserData(id, token)
  }
  this.props.history.push(`/`)
}


  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }

}

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($name: String!, $email: String!, $password: String!) {
    createUser(
      name: $name,
      authProvider: {
        email: {
          email: $email,
          password: $password
        }
      }
    ) {
      id
    }

    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`

const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($email: String!, $password: String!) {
    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`

export default compose(
  graphql(CREATE_USER_MUTATION, { name: 'createUserMutation' }),
  graphql(SIGNIN_USER_MUTATION, { name: 'signinUserMutation' })
)(Login)

