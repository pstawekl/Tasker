import { useUser } from "@auth0/nextjs-auth0/client";
import NavBar from "./NavBar";
import DashboardLayout from './app-sidebar';
import Footer from "./Footer";
import Hero from "@/components/Hero";

export default function LayoutManager({ children }) {
    const { user, isLoading } = useUser();

    if (!user || isLoading) {
        return (
            <main id="app" className="d-flex flex-column h-100" data-testid="layout">
                <NavBar />
                <div className="mr-0 ml-0 justify-content-center w-100 d-flex flex-column align-items-center align-self-center"><Hero /></div>
                <Footer />
            </main>
        )
    } else {
        return (
            <DashboardLayout>
                {children}
            </DashboardLayout>
        )
    }
}