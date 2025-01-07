'use client'
import { auth } from "@/app/firebaseConfig";
import UncompletedTasksChart from "@/components/charts/uncompleted-tasks-chart";
import UncompletedTasksChartByDay from "@/components/charts/uncompleted-tasks-chart-by-day";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth && auth.currentUser) {
      setUser(auth.currentUser);
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    document.title = 'Dashboard';
  }, [])

  if (user && !loading) {
    return (
      <div className="flex flex-column items-start justify-center gap-3 p-5 flex-none md:grid md:grid-cols-3 md:gap-5">
        <Card className="w-full flex-grow-1 hover:bg-gray-50">
          <CardHeader className="h-auto">
            <CardTitle className="overflow-hidden pb-1 text-ellipsis">Witaj, {user && user.displayName ? user.displayName : user.email}!</CardTitle>
          </CardHeader>
          <CardContent className="d-flex flex-column justify-center items-center">
            <img src={user.photoURL} alt={user && user.displayName ? user.displayName : user.email} width={100} height={100} className="rounded-full" />
            <Label className="mt-4 text-center">Ostatnia aktualizacja profilu: {new Date(user.metadata.lastSignInTime).toLocaleDateString()}</Label>
            <Label className="mt-2 text-center">Zweryfikowany użytkownik: {user.emailVerified ? 'Tak' : 'Nie'}</Label>
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