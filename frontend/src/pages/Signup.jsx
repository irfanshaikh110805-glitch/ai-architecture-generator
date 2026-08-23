import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

const Signup = () => {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error('Password does not meet requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        username: formData.username,
        full_name: formData.username,
      });
      
      if (result.success) {
        toast.success('Account created successfully! ⚡ Please check your email to verify.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
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
            [ INITIALIZE FREE DEVELOPER ACCOUNT ]
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block font-mono text-xs font-bold text-black uppercase mb-1">
                USERNAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <User className="h-4 w-4 stroke-[2.5]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 font-mono text-xs sm:text-sm font-bold text-black bg-[#FDF6E3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#000000] placeholder-gray-400"
                  placeholder="builder_zero"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-mono text-xs font-bold text-black uppercase mb-1">
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
                  className="block w-full pl-9 pr-3 py-2 font-mono text-xs sm:text-sm font-bold text-black bg-[#FDF6E3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#000000] placeholder-gray-400"
                  placeholder="developer@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-mono text-xs font-bold text-black uppercase mb-1">
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-10 py-2 font-mono text-xs sm:text-sm font-bold text-black bg-[#FDF6E3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#000000] placeholder-gray-400"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-[#FF00FF]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 stroke-[2.5]" /> : <Eye className="h-4 w-4 stroke-[2.5]" />}
                </button>
              </div>
            </div>

            {/* Password Requirements Checklist */}
            {formData.password && (
              <div className="bg-[#F4ECC8] border-2 border-black p-2.5 font-mono text-[11px] space-y-1">
                <div className="font-bold uppercase text-black mb-1">[ REQUIREMENTS ]</div>
                {[
                  { valid: passwordValidation.minLength, text: 'Min 8 characters' },
                  { valid: passwordValidation.hasUpperCase, text: 'Uppercase letter' },
                  { valid: passwordValidation.hasLowerCase, text: 'Lowercase letter' },
                  { valid: passwordValidation.hasNumber, text: 'Number digit' },
                  { valid: passwordValidation.hasSpecialChar, text: 'Special character' },
                ].map((req, i) => (
                  <div key={i} className={`flex items-center gap-1.5 ${req.valid ? 'text-black font-bold' : 'text-gray-600'}`}>
                    <span className={`w-3.5 h-3.5 border border-black flex items-center justify-center text-[9px] ${req.valid ? 'bg-[#00FF00]' : 'bg-white'}`}>
                      {req.valid ? '✓' : '×'}
                    </span>
                    {req.text}
                  </div>
                ))}
              </div>
            )}

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block font-mono text-xs font-bold text-black uppercase mb-1">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <Lock className="h-4 w-4 stroke-[2.5]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-10 py-2 font-mono text-xs sm:text-sm font-bold text-black bg-[#FDF6E3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#000000] placeholder-gray-400"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-[#FF00FF]"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 stroke-[2.5]" /> : <Eye className="h-4 w-4 stroke-[2.5]" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-display font-black text-sm uppercase bg-[#FF00FF] text-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] py-3.5 px-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 stroke-[3]" />
                  CREATE FREE ACCOUNT
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-4 border-t-2 border-black text-center font-mono text-xs font-bold">
            ALREADY REGISTERED?{' '}
            <Link to="/login" className="text-black bg-[#FFE600] px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000000] hover:bg-[#00FFFF] transition-colors uppercase">
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
