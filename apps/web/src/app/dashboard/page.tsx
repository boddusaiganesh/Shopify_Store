"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Users,
    ShoppingBag,
    DollarSign,
    LogOut,
    RefreshCw,
    Plus,
    TrendingUp,
    Calendar,
    Package,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Store,
    Sparkles
} from "lucide-react";
import {isAuthenticated, removeToken} from "@/lib/auth";
import * as api from "@/lib/api";

interface Tenant {
    id: string;
    storeName: string;
    storeUrl: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [selectedTenant, setSelectedTenant] = useState<string>("");
    const [summary, setSummary] = useState<any>(null);
    const [topCustomers, setTopCustomers] = useState<any[]>([]);
    const [ordersTrend, setOrdersTrend] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [showAddTenant, setShowAddTenant] = useState(false);

    // Date range state (default to last 60 days for better visibility)
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 60);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // Include today's orders
        return tomorrow.toISOString().split('T')[0];
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }

        loadTenants();
    }, [router]);

    useEffect(() => {
        if (selectedTenant) {
            loadDashboardData();
        }
    }, [selectedTenant, startDate, endDate]);

    const loadTenants = async () => {
        try {
            const data = await api.getTenants();
            setTenants(data);
            if (data.length > 0 && !selectedTenant) {
                setSelectedTenant(data[0].id);
            }
        } catch (error: any) {
            console.error("Failed to load tenants", error);
            if (error.message.includes('token') || error.message.includes('authentication')) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const loadDashboardData = async () => {
        if (!selectedTenant) return;

        try {
            const [summaryData, customersData, trendData] = await Promise.all([
                api.getSummary(selectedTenant),
                api.getTopCustomers(selectedTenant),
                api.getOrdersTrend(selectedTenant, startDate, endDate),
            ]);

            setSummary(summaryData);
            setTopCustomers(customersData);
            setOrdersTrend(trendData);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };

    const handleSync = async () => {
        if (!selectedTenant) return;

        setSyncing(true);
        try {
            await api.syncTenant(selectedTenant);
            setTimeout(() => loadDashboardData(), 3000);
        } catch (error: any) {
            alert("Sync failed: " + error.message);
        } finally {
            setSyncing(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="text-center space-y-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">Loading your dashboard...</p>
                    <p className="text-sm text-gray-500">Preparing insights for you</p>
                </div>
            </div>
        );
    }

    if (tenants.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-12 animate-slide-in">
                        <div>
                            <h1 className="text-4xl font-bold gradient-text mb-2">Shopify Insights</h1>
                            <p className="text-gray-600">Enterprise Analytics Platform</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-white/50"
                        >
                            <LogOut size={18}/>
                            Logout
                        </button>
                    </div>

                    {/* Empty State */}
                    <div className="glass rounded-2xl p-12 text-center space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                            <Store size={40} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome to Shopify Insights</h2>
                            <p className="text-gray-600 text-lg">
                                Connect your first Shopify store to unlock powerful analytics
                            </p>
                        </div>
                        <AddTenantForm onSuccess={loadTenants}/>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate growth percentages (mock data for demo)
    const growthMetrics = {
        customers: 12.5,
        orders: 8.3,
        revenue: 15.7
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Top Navigation Bar */}
            <nav className="glass border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & Store Selector */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Activity size={20} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold gradient-text">Shopify Insights</h1>
                                    <p className="text-xs text-gray-500">Enterprise Analytics</p>
                                </div>
                            </div>
                            
                            <div className="h-8 w-px bg-gray-300"></div>
                            
                            <select
                                value={selectedTenant}
                                onChange={(e) => setSelectedTenant(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-medium shadow-sm hover:shadow-md transition-all"
                            >
                                {tenants.map((tenant) => (
                                    <option key={tenant.id} value={tenant.id}>
                                        {tenant.storeName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSync}
                                disabled={syncing}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all font-medium"
                            >
                                <RefreshCw size={18} className={syncing ? "animate-spin" : ""}/>
                                {syncing ? "Syncing..." : "Sync Data"}
                            </button>
                            <button
                                onClick={() => setShowAddTenant(!showAddTenant)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all font-medium"
                            >
                                <Plus size={18}/>
                                Add Store
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all"
                            >
                                <LogOut size={18}/>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Tenant Form */}
                {showAddTenant && (
                    <div className="mb-8 animate-slide-in">
                        <AddTenantForm onSuccess={() => {
                            loadTenants();
                            setShowAddTenant(false);
                        }}/>
                    </div>
                )}

                {/* Date Range Filter */}
                <div className="glass rounded-2xl p-6 mb-8 animate-slide-in">
                    <div className="flex items-center gap-6">
                        <Calendar size={20} className="text-indigo-600" />
                        <label className="text-sm font-semibold text-gray-700">Date Range:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm hover:shadow-md transition-all"
                        />
                        <span className="text-gray-500 font-medium">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm hover:shadow-md transition-all"
                        />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Customers */}
                    <div className="glass rounded-2xl p-6 card-hover stat-card animate-slide-in" style={{animationDelay: '0.1s'}}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                                <Users size={24} className="text-white"/>
                            </div>
                            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <ArrowUpRight size={16}/>
                                +{growthMetrics.customers}%
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                            <p className="text-4xl font-bold text-gray-900">{summary?.totalCustomers || 0}</p>
                            <p className="text-xs text-gray-500 mt-2">Active customer base</p>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="glass rounded-2xl p-6 card-hover stat-card animate-slide-in" style={{animationDelay: '0.2s'}}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg">
                                <ShoppingBag size={24} className="text-white"/>
                            </div>
                            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <ArrowUpRight size={16}/>
                                +{growthMetrics.orders}%
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                            <p className="text-4xl font-bold text-gray-900">{summary?.totalOrders || 0}</p>
                            <p className="text-xs text-gray-500 mt-2">Completed transactions</p>
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="glass rounded-2xl p-6 card-hover stat-card animate-slide-in" style={{animationDelay: '0.3s'}}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                                <DollarSign size={24} className="text-white"/>
                            </div>
                            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <ArrowUpRight size={16}/>
                                +{growthMetrics.revenue}%
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                            <p className="text-4xl font-bold text-gray-900">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(summary?.totalRevenue || 0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Lifetime value</p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Orders Trend */}
                    <div className="glass rounded-2xl p-6 card-hover animate-slide-in" style={{animationDelay: '0.4s'}}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <TrendingUp size={24} className="text-indigo-600" />
                                    Orders Trend
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Order volume over time</p>
                            </div>
                        </div>
                        <div className="h-80">
                            {ordersTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ordersTrend}>
                                        <defs>
                                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="date" stroke="#6b7280" style={{fontSize: '12px'}} />
                                        <YAxis stroke="#6b7280" style={{fontSize: '12px'}} />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            fill="url(#colorOrders)"
                                            name="Orders"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                    <ShoppingBag size={48} className="text-gray-300 mb-3"/>
                                    <p className="text-gray-600 font-medium mb-1">No Orders in Selected Date Range</p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Try expanding the date range or create orders in Shopify.
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Current range: {startDate} to {endDate}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Customers */}
                    <div className="glass rounded-2xl p-6 card-hover animate-slide-in" style={{animationDelay: '0.5s'}}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Users size={24} className="text-purple-600" />
                                    Top Customers
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Highest spending customers</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {topCustomers.filter(c => c.ordersCount > 0).length > 0 ? (
                                <table className="min-w-full">
                                    <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Orders
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Total Spent
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {topCustomers
                                        .filter(c => c.ordersCount > 0)
                                        .map((customer, index) => {
                                            // Handle missing customer name data
                                            let displayName = 'Unknown Customer';
                                            if (customer.firstName && customer.lastName) {
                                                displayName = `${customer.firstName} ${customer.lastName}`;
                                            } else if (customer.firstName) {
                                                displayName = customer.firstName;
                                            } else if (customer.lastName) {
                                                displayName = customer.lastName;
                                            } else if (customer.email) {
                                                displayName = customer.email;
                                            } else {
                                                displayName = `Customer #${index + 1}`;
                                            }
                                            
                                            return (
                                                <tr key={customer.id} className="hover:bg-indigo-50/50 transition-colors">
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                                                index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                                                                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                                                index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                                                                'bg-gradient-to-br from-indigo-500 to-purple-500'
                                                            }`}>
                                                                {displayName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-semibold text-gray-900">{displayName}</div>
                                                                {customer.email && customer.email !== displayName && (
                                                                    <div className="text-xs text-gray-500">{customer.email}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                            {customer.ordersCount || 0} orders
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                                        {new Intl.NumberFormat("en-US", {
                                                            style: "currency",
                                                            currency: "USD",
                                                        }).format(customer.totalSpent || 0)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Users size={48} className="text-gray-300 mb-3"/>
                                    <p className="text-gray-600 font-medium mb-1">No Customer Purchases Yet</p>
                                    <p className="text-sm text-gray-500">
                                        Create orders with assigned customers in Shopify to see top spenders here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 py-8">
                    <p>Shopify Insights Platform • Built with ❤️ for Xeno</p>
                </div>
            </div>
        </div>
    );
}

function AddTenantForm({onSuccess}: { onSuccess: () => void }) {
    const [storeName, setStoreName] = useState("");
    const [storeUrl, setStoreUrl] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.createTenant({
                storeName,
                storeUrl,
                accessToken,
            });
            setStoreName("");
            setStoreUrl("");
            setAccessToken("");
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to add store");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <Store size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Add Shopify Store</h3>
                    <p className="text-sm text-gray-500">Connect your store to start analyzing data</p>
                </div>
            </div>
            
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
                    <span className="font-semibold">Error:</span> {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Name
                    </label>
                    <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm hover:shadow-md transition-all"
                        placeholder="My Awesome Store"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store URL
                    </label>
                    <input
                        type="url"
                        value={storeUrl}
                        onChange={(e) => setStoreUrl(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm hover:shadow-md transition-all"
                        placeholder="https://your-store.myshopify.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Admin API Access Token
                    </label>
                    <input
                        type="password"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 shadow-sm hover:shadow-md transition-all"
                        placeholder="shpat_xxxxxxxxxxxxx"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                    {loading ? "Adding Store..." : "Add Store"}
                </button>
            </form>
        </div>
    );
}
