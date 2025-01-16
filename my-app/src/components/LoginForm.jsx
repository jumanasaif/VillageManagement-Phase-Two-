import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
      user {
        id
        username
        role
      }
    }
  }
`;

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    if (!username || !password) {
      setErrorMessage('Both fields are required.');
      return;
    }

    try {
      const { data } = await login({
        variables: { input: { username, password } },
      });

      
      if (data.login.success) {
        console.log('Login successful:', data.login.user);

        
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('userId', data.login.user.id); 

        if (data.login.user.role === 'admin') {
          navigate('/sidebar/overview'); 
        } else {
          navigate('/sidebar/overview'); 
        }
      } else {
        setErrorMessage(data.login.message || 'Invalid username or password');
      }
    } catch (error) {
      
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <form
        className="bg-gray-700 p-6 rounded shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-white text-center text-2xl mb-4">Log In</h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <div className="mb-4">
          <label className="text-gray-300 block mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            className="w-full px-3 py-2 rounded bg-white focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-300 block mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 rounded bg-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Log In
        </button>

        <p className="text-center text-gray-300 mt-4">
          Don't have an account?{' '}
          <a href="/" className="text-blue-500 hover:text-blue-600">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
