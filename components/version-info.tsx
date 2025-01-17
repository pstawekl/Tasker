import { useEffect, useState } from "react";
import { Card } from "./ui/card";

export default function VersionInfo() {
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