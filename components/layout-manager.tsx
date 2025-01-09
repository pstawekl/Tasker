'use client'
import { auth } from "@/app/firebaseConfig";
import Hero from "@/components/Hero";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

export default function LayoutManager({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (!isMounted) return <div></div>;

    if ((!user || isLoading) && typeof window !== "undefined" && !window?.location?.pathname.includes('/login') && !window?.location?.pathname.includes('/register')) {
        return (
            <div id="app" className="d-flex flex-column h-screen" data-testid="layout">
                <NavBar />
                <div className="mr-0 ml-0 justify-content-center w-100 h-100 d-flex flex-column align-items-center align-self-center"><Hero /></div>
                <Footer />
            </div>
        )
    } else {
        return (
            <div>{children}</div>
        )
    }
}