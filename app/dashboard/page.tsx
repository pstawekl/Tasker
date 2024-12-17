'use client'
import UncompletedTasksChart from "@/components/charts/uncompleted-tasks-chart";
import UncompletedTasksChartByDay from "@/components/charts/uncompleted-tasks-chart-by-day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Title } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useEffect } from "react";
import { Container } from "reactstrap";

export default function Dashboard() {
    const { user, isLoading } = useUser();

    useEffect(() => {
        document.title = 'Dashboard';
    }, [])

    if (user && !isLoading) {
        return (
            <div className="flex flex-column items-start justify-center gap-3 p-5 flex-none md:grid md:grid-cols-3 md:gap-5">
                <Card className="w-full flex-grow-1 hover:bg-gray-50">
                    <CardHeader className="h-auto">
                        <CardTitle className="overflow-hidden pb-1 text-ellipsis">Witaj, {user.name}!</CardTitle>
                    </CardHeader>
                    <CardContent className="d-flex flex-column justify-center items-center">
                        <img src={user.picture} alt={user.name} width={100} height={100} className="rounded-full" />
                        <Label className="mt-4 text-center">Ostatnia aktualizacja profilu: {new Date(user.updated_at).toLocaleDateString()}</Label>
                        <Label className="mt-2 text-center">Zweryfikowany użytkownik: {user.email_verified ? 'Tak' : 'Nie'}</Label>
                    </CardContent>
                </Card>
                <Card className="w-full flex-grow-1 hover:bg-gray-50">
                    <CardHeader>
                        <CardTitle>Liczba niewykonanych zadań wg dnia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UncompletedTasksChartByDay />
                    </CardContent>
                </Card>
                <Card className="w-full flex-grow-1 hover:bg-gray-50">
                    <CardHeader>
                        <CardTitle>Masz łącznie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UncompletedTasksChart />
                    </CardContent>
                </Card>
            </div>
        )
    } else {
        return null;
    }
}