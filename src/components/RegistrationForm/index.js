import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './index.css'

class RegisterForm extends Component {
  state = {
    username: '',
    password: '',
    isAdmin: false,
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = e => this.setState({ username: e.target.value })
  onChangePassword = e => this.setState({ password: e.target.value })
  onChangeIsAdmin  = e => this.setState({ isAdmin: e.target.checked })

  onSubmitSuccess = () => {
    const { history } = this.props
    history.replace('/login')
  }

  onSubmitFailure = msg => this.setState({ showSubmitError: true, errorMsg: msg })

  submitForm = async e => {
    e.preventDefault()
    const { username, password, isAdmin } = this.state

    const response = await fetch('https://bulk-ordering-app-backend.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, isAdmin }),
      credentials: 'include',
    })

    const data = await response.json()
    if (response.ok) this.onSubmitSuccess()
    else this.onSubmitFailure(data.error || 'Registration failed')
  }

  render() {
    const { username, password, isAdmin, showSubmitError, errorMsg } = this.state

    return (
      <div className="login-form-container">
        <form className="form-container" onSubmit={this.submitForm}>
          {/* Username */}
          <div className="input-container">
            <label htmlFor="username">USERNAME</label>
            <input
              id="username"
              value={username}
              onChange={this.onChangeUsername}
              placeholder="Enter username"
            />
          </div>

          {/* Password */}
          <div className="input-container">
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={this.onChangePassword}
              placeholder="Enter password"
            />
          </div>

          {/* Admin checkbox */}
          <div className="checkbox-container">
            <input
              id="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={this.onChangeIsAdmin}
            />
            <label htmlFor="isAdmin">Register as Admin</label>
          </div>

          <button type="submit" className="login-button">Register</button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}

          <p className="register-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default RegisterForm
