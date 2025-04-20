import React, { Component } from 'react'
import Cookies from 'js-cookie'
import { Redirect, Link } from 'react-router-dom'
import UserContext from '../../context/UserContext'
import './index.css'

class LoginForm extends Component {
  static contextType = UserContext

  state = {
    username: '',
    password: '',
    isAdmin: false,
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = e => this.setState({ username: e.target.value })
  onChangePassword = e => this.setState({ password: e.target.value })
  onChangeIsAdmin = e => this.setState({ isAdmin: e.target.checked })

  onSubmitSuccess = (token, userId) => {
    const { history } = this.props
    const { isAdmin } = this.state

    // Persist the token and user details in cookies and localStorage
    Cookies.set('jwt_token', token, { expires: 30 })
    localStorage.setItem('userId', userId) // Store userId in localStorage
    this.context.setIsAdmin(isAdmin)

    // Redirect to the home page after successful login
    history.replace('/')
  }

  onSubmitFailure = msg => this.setState({ showSubmitError: true, errorMsg: msg })

  submitForm = async e => {
    e.preventDefault()
    const { username, password, isAdmin } = this.state

    const resp = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, isAdmin }),
    })
    const data = await resp.json()

    if (resp.ok && data.token && data.user?.id) {
      // Pass token and user id to the success handler
      this.onSubmitSuccess(data.token, data.user.id)
    } else {
      this.onSubmitFailure(data.error || 'Login failed')
    }
  }

  render() {
    const { username, password, isAdmin, showSubmitError, errorMsg } = this.state

    // Redirect if user is already logged in
    if (Cookies.get('jwt_token')) return <Redirect to="/products" />

    return (
      <div className="login-form-container">
        {/* Optional Logo and Images can be placed here */}
        <form className="form-container" onSubmit={this.submitForm}>
          {/* Username Field */}
          <div className="input-container">
            <label htmlFor="username">USERNAME</label>
            <input
              id="username"
              value={username}
              onChange={this.onChangeUsername}
              placeholder="Username"
            />
          </div>

          {/* Password Field */}
          <div className="input-container">
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={this.onChangePassword}
              placeholder="Password"
            />
          </div>

          {/* Admin Checkbox */}
          <div className="checkbox-container">
            <input
              id="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={this.onChangeIsAdmin}
            />
            <label htmlFor="isAdmin">Login as Admin</label>
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button">Login</button>

          {/* Error Message */}
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}

          {/* Register Link */}
          <p className="register-text">
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default LoginForm
