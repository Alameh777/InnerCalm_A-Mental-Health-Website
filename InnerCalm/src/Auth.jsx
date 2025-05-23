import landvid from './assets/fieldgirl.mp4';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// your one static admin creds:
const ADMIN_EMAIL = 'innercalmmmmmm@gmail.com';
const ADMIN_PASS  = 'alameh7777';

export default function Auth() {
  const location = useLocation();
  const [authMode, setAuthMode] = useState(location.state?.mode || 'signin');

  useEffect(() => {
    if (location.state?.mode) {
      setAuthMode(location.state.mode);
    }
  }, [location.state?.mode]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src={landvid} type="video/mp4" />
      </video>
      <a href="/" className="absolute top-4 left-4 z-20 p-2 bg-white/80 rounded-full shadow hover:bg-white">
        {/* back arrow */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             className="text-emerald-600 hover:text-emerald-800">
          <path d="M19 12H5"></path>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </a>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden w-full max-w-3xl flex flex-col md:flex-row z-10">
        <div className="hidden md:block md:w-1/2 bg-cover bg-center"
             style={{ backgroundImage: "url('/image/innerclogo.png')" }} />
        <div className="w-full md:w-1/2 p-6 md:p-10">
          {authMode === 'signin' && <SignInForm onSwitchMode={setAuthMode} />}
          {authMode === 'signup' && <SignUpForm onSwitchMode={setAuthMode} />}
          {authMode === 'forgot' && <ForgotPasswordForm onSwitchMode={setAuthMode} />}
        </div>
      </div>
    </div>
  );
}

function SignInForm({ onSwitchMode }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const tok = localStorage.getItem('token');
    if (tok) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
      nav('/mood-tracking');
    }
  }, [nav]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(false);

    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASS) {
      return nav('/Admin');
    }

    axios.post('http://127.0.0.1:8000/api/login', form)
      .then(res => {
        if (res.data.status === true) {
          const tok = res.data.token;
          localStorage.setItem('token', tok);
          axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
          nav('/mood-tracking');
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-emerald-800 mb-5 text-center">Sign In</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Email or password not found
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            name="email"
            type="email"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white/70"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white/70"
            placeholder="••••••••"
          />
        </div>
        <div className="text-right">
          <button type="button" onClick={() => onSwitchMode('forgot')} className="text-xs text-emerald-600 hover:underline">
            Forgot Password?
          </button>
        </div>
        <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">
          Sign In
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-gray-600">
        Don't have an account?{' '}
        <button onClick={() => onSwitchMode('signup')} className="text-emerald-600 hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
}

function SignUpForm({ onSwitchMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
  });
  const [errors, setErrors] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      nav('/mood-tracking');
    }
  }, [nav]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(null);

    axios
      .post('http://127.0.0.1:8000/api/register', formData)
      .then((res) => {
        if (res.data.token) {
          const token = res.data.token;
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          nav('/mood-tracking');
        } else {
          setErrors({ general: 'Unexpected response from server.' });
        }
      })
      .catch((err) => {
        if (err.response?.status === 422 && err.response.data.errors) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: err.response?.data?.message || 'Server error.' });
        }
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-emerald-800 mb-5 text-center">
        Create Account
      </h2>

      {errors?.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white/70"
            placeholder="John Doe"
          />
          {errors?.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white/70"
            placeholder="you@example.com"
          />
          {errors?.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            required
            onChange={handleChange}
            minLength={8}
            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white/70"
            placeholder="Minimum 8 characters"
          />
          {errors?.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            name="age"
            type="number"
            value={formData.age}
            required
            onChange={handleChange}
            min={1}
            max={120}
            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white/70 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Your age"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white/70"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-600">
        Already have an account?{' '}
        <button onClick={() => onSwitchMode('signin')} className="text-emerald-600 hover:underline">
          Sign In
        </button>
      </p>
    </div>
  );
}

function ForgotPasswordForm({ onSwitchMode }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    axios.post('http://127.0.0.1:8000/api/forgot-password', { email })
      .then(res => {
        setStatus({
          type: 'success',
          message: 'Password reset instructions have been sent to your email.'
        });
      })
      .catch(err => {
        setStatus({
          type: 'error',
          message: err.response?.data?.message || 'An error occurred. Please try again.'
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-emerald-800 mb-5 text-center">Reset Password</h2>
      
      {status.message && (
        <div className={`mb-4 p-3 rounded ${
          status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white/70"
            placeholder="you@example.com"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full bg-emerald-600 text-white py-2 rounded-lg ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-700'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-600">
        Remember your password?{' '}
        <button 
          onClick={() => onSwitchMode('signin')} 
          className="text-emerald-600 hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
