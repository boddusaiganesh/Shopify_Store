"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function HomePage() {
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
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
}
