"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { Sparkles } from "lucide-react";

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        // If authenticated, go to dashboard, otherwise go to welcome page
        if (isAuthenticated()) {
            router.push("/dashboard");
        } else {
            router.push("/welcome");
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="text-center space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-lg font-medium text-gray-700">Loading Shopify Insights...</p>
            </div>
        </div>
    );
}
