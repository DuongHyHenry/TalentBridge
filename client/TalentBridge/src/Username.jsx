import React, { useState } from 'react';

function Username() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Perform any client-side validation here
            
            const response = await fetch('http://localhost:5000/registerUsername', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            // Handle response
            if (response.ok) {
                // Optionally reset form state after successful submission
                setUsername('');
                setError('');

                // Redirect to next step after successful registration
                // Consider using React Router for navigation within the SPA
                window.location.href = 'http://localhost:5173/';
            } else {
                // Handle error response from server
                const data = await response.json();
                setError(data.error || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Failed to submit form:', error);
            setError('Error submitting form');
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Pick a username"
                value={username}
                onChange={handleUsernameChange}
            />
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default Username;
