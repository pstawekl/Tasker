'use client'
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
export default function Settings() {
    return (
        <div className='flex flex-col gap-4 p-4 w-full h-full'>
            <ThemeToggle />
            <VersionInfo />
        </div>
    );
}


export function VersionInfo() {
    const [versionInfo, setVersionInfo] = useState(null);

    useEffect(() => {
        fetch('/appVersion.json')
            .then((response) => response.json())
            .then((data) => setVersionInfo(data));
    }, []);

    if (!versionInfo) return <p>Ładowanie informacji o wersji...</p>;

    return (
        <Card className="flex flex-col p-4 gap-2 dark:bg-black dark:border-white">
            <h1 className='text-xl font-bold dark:text-gray-100'>Informacje o aplikacji</h1>
            <p className="text-lg font-semibold dark:text-gray-100">
                Wersja: {versionInfo.version}
            </p>
            <p className="text-md dark:text-gray-100">
                {process.env.NEXT_PUBLIC_APP_NAME}
            </p>
        </Card>
    );
}

export function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('appMode') === 'dark';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            localStorage.setItem('appMode', 'dark');
            document.documentElement.classList.add('dark');
        }
    }, [darkMode])

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    return (
        <Card className="flex p-4 flex-row justify-center items-center gap-4 dark:bg-black dark:border-white">
            <Switch
                id='darkModeToggle'
                checked={darkMode}
                onClick={() => setDarkMode(!darkMode)}
            />
            <Label htmlFor='darkModeToggle' className='dark:text-gray-100'>
                Tryb ciemny
            </Label>
        </Card>
    );
}