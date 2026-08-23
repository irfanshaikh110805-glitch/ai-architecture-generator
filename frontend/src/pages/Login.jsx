import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Welcome back! ⚡');
        navigate('/generate');
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    const resetPassword = useAuthStore.getState().resetPassword;
    const result = await resetPassword(formData.email);
    
    if (result.success) {
      toast.success('Password reset email sent! Check your inbox.');
    } else {
      toast.error(result.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] bg-neo-pattern flex items-center justify-center p-4 selection:bg-[#00FF00] selection:text-black">
      <div className="w-full max-w-md relative z-10">
        
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-3 py-1.5 mb-6 hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all uppercase"
        >
          <ArrowLeft size={14} className="stroke-[3]" />
          BACK TO HOME
        </Link>

        {/* Logo/Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-black text-2xl text-black hover:text-black transition-colors">
            <div className="w-9 h-9 border-2 border-black bg-[#FF00FF] p-0.5 shadow-[2px_2px_0px_0px_#000000]">
              <img src="/logo.jpg" alt="ArchitechAI" className="w-full h-full object-cover" />
            </div>
            ARCHITECH<span className="bg-[#00FF00] px-1 text-black border border-black text-xs">AI</span>
          </Link>
          <p className="font-mono text-xs font-bold text-gray-700 mt-2 uppercase tracking-wide">
            [ SECURE SYSTEM ACCESS ]
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-mono text-xs font-bold text-black uppercase mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <Mail className="h-4 w-4 stroke-[2.5]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2.5 font-mono text-xs sm:text-sm font-bold text-black bg-[#FDF6E3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#000000] placeholder-gray-400"
                  placeholder="developer@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-mono text-xs font-bold text-black uppercase mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <Lock className="h-4 w-4 stroke-[2.5]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-10 py-2.5 font-mono text-xs sm:text-sm font-bold text-black bg-[#FDF6E3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#000000] placeholder-gray-400"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-[#FF00FF]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    <Eye className="h-4 w-4 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between font-mono text-xs font-bold">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black border-2 border-black rounded-none focus:ring-0 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 text-black cursor-pointer uppercase">
                  REMEMBER
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-black hover:text-[#FF00FF] underline uppercase"
              >
                FORGOT PASSWORD?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-display font-black text-sm uppercase bg-[#00FF00] text-black border-3 border-black shadow-[4px_4px_0px_0px_#000000] py-3.5 px-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin"></div>
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 stroke-[3]" />
                  SIGN IN TO ARCHITECH
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-4 border-t-2 border-black text-center font-mono text-xs font-bold">
            DON'T HAVE AN ACCOUNT?{' '}
            <Link to="/signup" className="text-black bg-[#FFE600] px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000000] hover:bg-[#00FFFF] transition-colors uppercase">
              SIGN UP FREE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
