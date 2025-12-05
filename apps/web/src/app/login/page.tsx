"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {login, register} from "@/lib/auth";
import {
    Store,
    Mail,
    Lock,
    User,
    Sparkles,
    TrendingUp,
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle2,
    Shield,
    BarChart3,
    ArrowLeft
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name);
            }
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full">
                    {/* Gradient Orbs */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{animationDelay: '4s'}}></div>
                </div>
            </div>

            <div className="relative min-h-screen flex">
                {/* Left Panel - Branding & Features */}
                <div className="hidden lg:flex lg:w-[42%] xl:w-[40%] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }}></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
                    
                    <div className="relative z-10">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-12 animate-slide-in">
                            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-2xl border border-white/30">
                                <Store size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Shopify Insights</h1>
                                <p className="text-white/80 text-xs">Enterprise Analytics</p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-6 animate-slide-in" style={{animationDelay: '0.1s'}}>
                            <div className="space-y-3">
                                <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
                                    Analytics That
                                    <br />
                                    Drive Growth
                                </h2>
                                <p className="text-base xl:text-lg text-white/90 leading-relaxed">
                                    Transform your Shopify data into actionable insights with real-time analytics.
                                </p>
                            </div>

                            {/* Feature List */}
                            <div className="space-y-3">
                                {[
                                    {
                                        icon: <TrendingUp size={18} />,
                                        title: "Real-Time Analytics",
                                        description: "Live data synchronization"
                                    },
                                    {
                                        icon: <BarChart3 size={18} />,
                                        title: "Advanced Reports",
                                        description: "Customizable dashboards"
                                    },
                                    {
                                        icon: <Shield size={18} />,
                                        title: "Enterprise Security",
                                        description: "Bank-level encryption"
                                    }
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all animate-slide-in"
                                        style={{animationDelay: `${0.2 + index * 0.1}s`}}
                                    >
                                        <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white text-sm mb-0.5">{feature.title}</h3>
                                            <p className="text-xs text-white/80">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="relative z-10 grid grid-cols-3 gap-4 animate-slide-in" style={{animationDelay: '0.5s'}}>
                        {[
                            { value: "1000+", label: "Merchants" },
                            { value: "$50M+", label: "Revenue" },
                            { value: "99.9%", label: "Uptime" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl xl:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-white/80">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - Auth Form */}
                <div className="w-full lg:w-[58%] xl:w-[60%] flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
                    <div className="w-full max-w-[480px]">
                        {/* Back to Home Button */}
                        <button
                            onClick={() => router.push("/welcome")}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </button>

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                                <Store size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold gradient-text">Shopify Insights</h1>
                                <p className="text-xs text-gray-600">Enterprise Analytics</p>
                            </div>
                        </div>

                        {/* Auth Card */}
                        <div className="glass rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-slide-in">
                            {/* Tab Switcher */}
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                                <button
                                    onClick={() => {
                                        setIsLogin(true);
                                        setError("");
                                    }}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                                        isLogin
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        setIsLogin(false);
                                        setError("");
                                    }}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                                        !isLogin
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {/* Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1.5">
                                    {isLogin ? "Welcome Back!" : "Create Account"}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {isLogin
                                        ? "Enter your credentials to access your dashboard"
                                        : "Get started with your free account today"}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-in">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">!</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-red-800">Authentication Error</p>
                                            <p className="text-xs text-red-700 mt-0.5">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Field (Register Only) */}
                                {!isLogin && (
                                    <div className="space-y-1.5 animate-slide-in">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm transition-all hover:border-gray-300"
                                                placeholder="John Doe"
                                                required={!isLogin}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm transition-all hover:border-gray-300"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-11 pr-11 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm transition-all hover:border-gray-300"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {!isLogin && (
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Shield size={11} />
                                            <span>Minimum 6 characters</span>
                                        </p>
                                    )}
                                </div>

                                {/* Remember Me / Forgot Password */}
                                {isLogin && (
                                    <div className="flex items-center justify-between text-sm">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span className="text-gray-700">Remember me</span>
                                        </label>
                                        <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group relative overflow-hidden text-sm"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span className="relative z-10">Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">{isLogin ? "Sign In" : "Create Account"}</span>
                                            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-3 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 text-sm"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span>Google</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 text-sm"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    <span>GitHub</span>
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="mt-5 pt-5 border-t border-gray-200 text-center">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    By continuing, you agree to our{" "}
                                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Terms</a>
                                    {" "}and{" "}
                                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Privacy Policy</a>
                                </p>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-5 flex items-center justify-center gap-6 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <Shield size={14} className="text-green-600" />
                                <span>SSL Secure</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-blue-600" />
                                <span>GDPR Compliant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
