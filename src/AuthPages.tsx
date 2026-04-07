import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from './lib/authMock';
import { auth, signInWithGoogle } from './firebase';
import { motion } from 'motion/react';
import { Google, Mail, Lock as LockIcon, Person, Visibility, VisibilityOff, ArrowBack } from './components/Icons';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setServerError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });
      navigate('/profile');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setServerError('Email already registered. Try signing in instead.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setServerError('Email/Password authentication is not enabled. Try Google Sign In.');
      } else if (err.code === 'auth/weak-password') {
        setServerError('Password is too weak. Use a stronger password.');
      } else {
        setServerError(err.message || 'Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setServerError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/profile');
    } catch (err: any) {
      setServerError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-surface via-surface to-surface-container-low relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary font-label text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all"
        >
          <ArrowBack className="text-lg" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-surface/80 backdrop-blur-3xl p-10 rounded-3xl shadow-[0_40px_80px_-20px_rgba(26,28,26,0.08)] border border-outline-variant/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-headline text-on-surface mb-2">Join ATELIER</h1>
            <p className="text-sm text-on-surface-variant font-light">Create your beauty profile</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl"
            >
              <p className="text-sm text-error font-label font-semibold">{serverError}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-3">
                Full Name
              </label>
              <div className="relative">
                <Person className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg pointer-events-none" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your name"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl font-label text-sm bg-surface-container-lowest border-2 transition-all outline-none ${
                    errors.fullName
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/20 focus:border-primary'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-error mt-2 font-label">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl font-label text-sm bg-surface-container-lowest border-2 transition-all outline-none ${
                    errors.email
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/20 focus:border-primary'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error mt-2 font-label">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-3">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl font-label text-sm bg-surface-container-lowest border-2 transition-all outline-none ${
                    errors.password
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/20 focus:border-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? (
                    <VisibilityOff className="text-lg" />
                  ) : (
                    <Visibility className="text-lg" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error mt-2 font-label">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl font-label text-sm bg-surface-container-lowest border-2 transition-all outline-none ${
                    errors.confirmPassword
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/20 focus:border-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff className="text-lg" />
                  ) : (
                    <Visibility className="text-lg" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-error mt-2 font-label">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-between gap-4 my-8">
            <div className="h-px flex-1 bg-outline-variant/20" />
            <span className="text-xs text-on-surface-variant font-label tracking-widest">OR</span>
            <div className="h-px flex-1 bg-outline-variant/20" />
          </div>

          {/* Google Sign Up */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-4 rounded-xl border-2 border-outline-variant/20 text-on-surface font-label text-xs tracking-widest uppercase hover:bg-surface-container-lowest disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            <Google className="text-lg fill-current" />
            Sign Up with Google
          </motion.button>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-xs text-on-surface-variant font-light">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary font-bold hover:underline underline-offset-4">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setServerError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/profile');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setServerError('No account found with this email. Sign up instead.');
      } else if (err.code === 'auth/wrong-password') {
        setServerError('Invalid password. Please try again.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setServerError('Email/Password authentication is not enabled. Try Google Sign In.');
      } else if (err.code === 'auth/too-many-requests') {
        setServerError('Too many failed attempts. Please try again later.');
      } else {
        setServerError(err.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setServerError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/profile');
    } catch (err: any) {
      setServerError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-surface via-surface to-surface-container-low relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary font-label text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all"
        >
          <ArrowBack className="text-lg" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-surface/80 backdrop-blur-3xl p-10 rounded-3xl shadow-[0_40px_80px_-20px_rgba(26,28,26,0.08)] border border-outline-variant/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-headline text-on-surface mb-2">Welcome Back</h1>
            <p className="text-sm text-on-surface-variant font-light">Sign in to your ATELIER account</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl"
            >
              <p className="text-sm text-error font-label font-semibold">{serverError}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            {/* Email */}
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl font-label text-sm bg-surface-container-lowest border-2 transition-all outline-none ${
                    errors.email
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/20 focus:border-primary'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error mt-2 font-label">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-3">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-4 rounded-xl font-label text-sm bg-surface-container-lowest border-2 transition-all outline-none ${
                    errors.password
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/20 focus:border-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? (
                    <VisibilityOff className="text-lg" />
                  ) : (
                    <Visibility className="text-lg" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error mt-2 font-label">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-between gap-4 my-8">
            <div className="h-px flex-1 bg-outline-variant/20" />
            <span className="text-xs text-on-surface-variant font-label tracking-widest">OR</span>
            <div className="h-px flex-1 bg-outline-variant/20" />
          </div>

          {/* Google Sign In */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 rounded-xl border-2 border-outline-variant/20 text-on-surface font-label text-xs tracking-widest uppercase hover:bg-surface-container-lowest disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            <Google className="text-lg fill-current" />
            Sign In with Google
          </motion.button>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-xs text-on-surface-variant font-light">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4">
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const SignOutPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleSignOut = async () => {
      try {
        await auth.signOut();
        navigate('/');
      } catch (error) {
        console.error('Error signing out', error);
      }
    };
    handleSignOut();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-headline text-on-surface">Signing Out...</h2>
        <p className="text-sm text-on-surface-variant mt-2 font-light">Please wait while we log you out of your account.</p>
      </motion.div>
    </div>
  );
};
