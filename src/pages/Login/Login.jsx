import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }

    // Override body styles for login page
    const originalBodyStyle = {
      backgroundColor: document.body.style.backgroundColor,
      color: document.body.style.color,
      margin: document.body.style.margin,
    };

    document.body.style.backgroundColor = 'transparent';
    document.body.style.color = 'inherit';
    document.body.style.margin = '0';

    // Cleanup: restore original styles when component unmounts
    return () => {
      document.body.style.backgroundColor = originalBodyStyle.backgroundColor;
      document.body.style.color = originalBodyStyle.color;
      document.body.style.margin = originalBodyStyle.margin;
    };
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Normalize email to lowercase for comparison
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPassword = password.trim();

    // Check credentials and assign role (case-insensitive email comparison)
    if (normalizedEmail === 'nikhil@gmail.com' && normalizedPassword === '1234') {
      // Admin user
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email.trim()); // Store original email format
      localStorage.setItem('userRole', 'admin');
      navigate('/dashboard');
    } else if (normalizedEmail === 'test@gmail.com' && normalizedPassword === '1234') {
      // Regular user
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email.trim()); // Store original email format
      localStorage.setItem('userRole', 'user');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>DFX</h1>
          <h2>Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

