import { signUpAction } from "./actions"
import "../../assets/style/login.css"

export default function SignUpPage() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Create an account</h1>
          <p>Start building your project today</p>
        </div>
        
        <form action={signUpAction} className="login-form">

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              name="email" 
              type="email" 
              placeholder="name@company.com" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              name="password" 
              type="password" 
              placeholder="Create a password" 
              required 
              minLength={8}
            />
          </div>
          
          <button type="submit" className="btn-login">
            Get Started
          </button>
        </form>
        
        <div className="login-footer">
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  )
}