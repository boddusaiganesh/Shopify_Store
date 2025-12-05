"use client";

import { useRouter } from "next/navigation";
import {
    Store,
    TrendingUp,
    Users,
    DollarSign,
    Zap,
    Shield,
    BarChart3,
    Globe,
    Clock,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Activity,
    Package,
    ShoppingBag,
    Star,
    PlayCircle
} from "lucide-react";

export default function WelcomePage() {
    const router = useRouter();

    const features = [
        {
            icon: <TrendingUp size={24} />,
            title: "Real-Time Analytics",
            description: "Track your store performance with live data updates and instant insights.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Users size={24} />,
            title: "Customer Intelligence",
            description: "Understand customer behavior, preferences, and spending patterns.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <BarChart3 size={24} />,
            title: "Advanced Reports",
            description: "Generate detailed reports with customizable date ranges and filters.",
            color: "from-emerald-500 to-green-500"
        },
        {
            icon: <Zap size={24} />,
            title: "Instant Sync",
            description: "Automatic data synchronization every 6 hours with manual sync option.",
            color: "from-amber-500 to-orange-500"
        },
        {
            icon: <Shield size={24} />,
            title: "Enterprise Security",
            description: "Bank-level encryption and secure JWT authentication for your data.",
            color: "from-red-500 to-rose-500"
        },
        {
            icon: <Globe size={24} />,
            title: "Multi-Store Support",
            description: "Manage multiple Shopify stores from a single unified dashboard.",
            color: "from-indigo-500 to-purple-500"
        }
    ];

    const stats = [
        { number: "1000+", label: "Active Merchants", icon: <Store size={20} /> },
        { number: "$50M+", label: "Revenue Tracked", icon: <DollarSign size={20} /> },
        { number: "99.9%", label: "Uptime", icon: <Clock size={20} /> },
        { number: "24/7", label: "Support", icon: <Sparkles size={20} /> }
    ];

    const benefits = [
        "Real-time data synchronization",
        "Unlimited store connections",
        "Advanced analytics dashboard",
        "Customer segmentation",
        "Revenue tracking & forecasting",
        "Custom date range reports",
        "Export data to CSV/Excel",
        "Priority customer support"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Navigation */}
            <nav className="glass border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Activity size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold gradient-text">Shopify Insights</h1>
                                <p className="text-xs text-gray-500">Enterprise Analytics</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push("/login")}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all font-medium"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm text-indigo-700 font-medium animate-slide-in">
                            <Sparkles size={16} className="text-indigo-600" />
                            <span>Enterprise-Grade Analytics Platform</span>
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-4 animate-slide-in" style={{animationDelay: '0.1s'}}>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                                Unlock the Power of
                                <br />
                                <span className="gradient-text">Your Shopify Data</span>
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
                                Transform your Shopify store into a data-driven powerhouse with real-time analytics, customer insights, and actionable reports.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in" style={{animationDelay: '0.2s'}}>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all font-semibold text-lg flex items-center gap-2 group"
                            >
                                <span>Start Free Trial</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all font-semibold text-lg flex items-center gap-2"
                            >
                                <PlayCircle size={20} />
                                <span>Watch Demo</span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-16 animate-slide-in" style={{animationDelay: '0.3s'}}>
                            {stats.map((stat, index) => (
                                <div key={index} className="glass rounded-2xl p-6 text-center card-hover">
                                    <div className="flex justify-center mb-2 text-indigo-600">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-full text-sm text-purple-700 font-medium mb-6">
                            <Star size={16} className="text-purple-600" />
                            <span>Powerful Features</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Built for modern e-commerce businesses who demand enterprise-grade analytics
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass rounded-2xl p-8 card-hover animate-slide-in"
                                style={{animationDelay: `${index * 0.1}s`}}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                <CheckCircle2 size={16} />
                                <span>What's Included</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                                Built for Growth,
                                <br />
                                Designed for Scale
                            </h2>
                            <p className="text-xl text-white/90">
                                Get access to enterprise features that help you make data-driven decisions and grow your business faster.
                            </p>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all font-semibold text-lg flex items-center gap-2 group"
                            >
                                <span>Get Started Now</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="glass bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 animate-slide-in"
                                        style={{animationDelay: `${index * 0.05}s`}}
                                    >
                                        <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-white/90">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full text-sm text-green-700 font-medium mb-6">
                            <Zap size={16} className="text-green-600" />
                            <span>Simple Process</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Get Started in Minutes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Connect your Shopify store and start analyzing your data instantly
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                title: "Create Account",
                                description: "Sign up with your email in seconds. No credit card required.",
                                icon: <Users size={32} />
                            },
                            {
                                step: "2",
                                title: "Connect Store",
                                description: "Add your Shopify store credentials and sync your data.",
                                icon: <Store size={32} />
                            },
                            {
                                step: "3",
                                title: "View Insights",
                                description: "Access powerful analytics and start making data-driven decisions.",
                                icon: <BarChart3 size={32} />
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="glass rounded-2xl p-8 text-center card-hover h-full">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl">
                                        {item.icon}
                                    </div>
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                        <ArrowRight size={24} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="glass rounded-3xl p-12 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                                Ready to Transform Your Business?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Join thousands of merchants who are already using Shopify Insights to grow their business.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => router.push("/login")}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all font-semibold text-lg flex items-center gap-2 group"
                            >
                                <span>Start Your Free Trial</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">
                            No credit card required • 14-day free trial • Cancel anytime
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Activity size={16} className="text-white" />
                                </div>
                                <span className="font-bold text-white">Shopify Insights</span>
                            </div>
                            <p className="text-sm">
                                Enterprise analytics platform for modern Shopify merchants.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm">© 2025 Shopify Insights. Built for Xeno Assignment.</p>
                        <div className="flex items-center gap-6 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
