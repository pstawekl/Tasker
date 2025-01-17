'use client'
import ThemeToggle from '@/components/theme-toggle';
import VersionInfo from '@/components/version-info';

export default function Settings() {
    return (
        <div className='flex flex-col gap-4 p-4 w-full h-full'>
            <ThemeToggle />
            <VersionInfo />
        </div>
    );
}