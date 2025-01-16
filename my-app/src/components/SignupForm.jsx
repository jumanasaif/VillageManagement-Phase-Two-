import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';  

const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      message
    }
  }
`;

const SignupForm = () => {
  const [formData, setFormData] = useState({ fullName: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();  


  const [signup] = useMutation(SIGNUP_MUTATION);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.username || !formData.password) {
      alert('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data } = await signup({
        variables: {
          input: {
            fullName: formData.fullName,
            username: formData.username,
            password: formData.password,
          },
        },
      });

      setSuccess(data.signup.message);
      
      
      navigate('/login');
    } catch (error) {
      setError('Error creating user! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <form className="bg-gray-700 p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-white text-center text-2xl mb-4">Sign Up</h2>

        {/* Display error and success messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <label className="text-gray-300 block mb-2" htmlFor="fullName">Full Name</label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Enter your full name"
            className="w-full px-3 py-2 rounded bg-white focus:outline-none"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-300 block mb-2" htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            className="w-full px-3 py-2 rounded bg-white focus:outline-none"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-300 block mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 rounded bg-white focus:outline-none"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {/* login link */}
        <p className="text-center text-gray-300 mt-4">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-600"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
