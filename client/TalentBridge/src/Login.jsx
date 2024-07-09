import React from 'react';

function Login() {
  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div>
      <button onClick={handleGoogleAuth}>Login with Google</button>
    </div>
  );
}

export default Login;