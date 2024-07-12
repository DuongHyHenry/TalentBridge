import React from 'react';

function Logout() {
  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/googleLogout';
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;