"use client"

import { useActionState } from "react"
import { loginAction } from "./actions"
import "../../assets/style/login.css"

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sign in</h1>
          <p>Connect to your account</p>
        </div>
        
        <form action={formAction} className="login-form">
          {errorMessage && (
            <div className="error-banner">
              {errorMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="name@company.com" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          
          <button 
            type="submit" 
            className="btn-login" 
            disabled={isPending}
          >
            {isPending ? "Connection..." : "Sign in"}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account ? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  )
}