import React from 'react';

function Login() {
  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };
  const handleFacebookAuth = () => {
    window.location.href = 'http://localhost:5000/auth/facebook';
  };

  return (
    <div>
      <button onClick={handleGoogleAuth}>Login with Google</button>
      <button onClick={handleFacebookAuth}>Login with Facebook</button>
    </div>
  );
}

export default Login;