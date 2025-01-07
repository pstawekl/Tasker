import DashboardLayout from '@/components/app-sidebar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: DashboardLayoutProps) {
    return <DashboardLayout>{children}</DashboardLayout>;
}