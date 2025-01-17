import { useEffect, useState } from "react";
import { Card } from "reactstrap";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function ThemeToggle() {
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