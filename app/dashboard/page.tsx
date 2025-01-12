'use client'
import { auth } from "@/app/firebaseConfig";
import UncompletedTasksChart from "@/components/charts/uncompleted-tasks-chart";
import UncompletedTasksChartByDay from "@/components/charts/uncompleted-tasks-chart-by-day";
import LoadingSpinner from "@/components/loadingSpinner";
import TaskListsMobile from "@/components/task-lists-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TaskLists } from "@/lib/models/taskList";
import DefaultUserAvatar from '@/public/default-user-avatar.jpg';
import { User } from "firebase/auth";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "reactstrap";
import { LayoutManager } from "../../utils/layout-manager";

export default function Dashboard() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [taskLists, setTaskLists] = useState<TaskLists>([]);
  const [dbUser, setDbUser] = useState(null);
  const [isDuringTaskListLoading, setIsDuringTaskListLoading] = useState(false);
  const [isDuringAddList, setIsDuringAddList] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [])

  useEffect(() => {
    document.title = 'Dashboard';
  }, [])

  useEffect(() => {
    const fetchDbUser = async () => {
      try {
        const response = await fetch('/api/postgres/user', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firebase_id: user.uid }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log('dbUser', data.users[0]);
          setDbUser(data.users[0]);
        } else {
          console.error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    console.log('user', user);

    if (user && !loading) {
      fetchDbUser();
    }
  }, [user])

  useEffect(() => {
    if (dbUser) {
      fetchTaskLists();
    }
  }, [dbUser])

  const fetchTaskLists = async () => {
    try {
      console.log('in fetchTaskLists');

      const response = await fetch(`/api/postgres/task-list`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: dbUser.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setTaskLists(data.taskLists);
      } else {
        console.error('Failed to fetch task list');
      }
      setIsDuringTaskListLoading(false);
    } catch (error) {
      setIsDuringTaskListLoading(false);
      console.error('Error fetching task list:', error);
    }
  };

  async function addNewList() {
    setIsDuringAddList(true);
    setIsDuringTaskListLoading(true);
    if (newListName.length > 2) {
      console.log('Adding new list...');
      setIsDuringAddList(true);
      const response = await fetch('/api/postgres/add-new-task-list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: dbUser.id, name: newListName }),
      });

      if (response.ok) {
        fetchTaskLists();
        setNewListName('');
        setIsDuringAddList(false);
      } else {
        console.error('Failed to add new task list');
      }
    }
  }

  if (user && !loading) {
    if (!LayoutManager.getIsMobile()) {
      return (
        <div className="flex flex-column items-start justify-center gap-3 p-5 flex-none md:grid md:grid-cols-3 md:gap-5">
          <Card className="w-full flex-grow-1 hover:bg-gray-50">
            <CardHeader className="h-auto">
              <CardTitle className="overflow-hidden pb-1 text-ellipsis">Witaj, {user && user.displayName ? user.displayName : user.email}!</CardTitle>
            </CardHeader>
            <CardContent className="d-flex flex-column justify-center items-center">
              <Image src={user.photoURL ?? DefaultUserAvatar} alt={user && user.displayName ? user.displayName : user.email} width={100} height={100} className="rounded-full" />
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
      return (
        <div className="w-full h-full py-2">
          <div className="relative h-full flex flex-column overflow-x-hidden overflow-y-auto">
            {
              taskLists.length > 0 && taskLists.map((taskList) => {
                return (
                  <TaskListsMobile
                    key={taskList.id}
                    id={taskList.id}
                    name={taskList.name}
                    fetchItems={fetchTaskLists}
                  />
                )
              })
            }
            {
              isDuringTaskListLoading && <LoadingSpinner />
            }
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2">
            <Input
              type="text"
              placeholder="Nazwa nowej listy..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="flex-1"
            />
            <Button
              className="px-3"
              variant='black'
              onClick={() => {
                if (newListName.length > 2) {
                  addNewList();
                  setNewListName('');
                  fetchTaskLists();
                  setIsDuringTaskListLoading(true);
                }
              }}
              disabled={newListName.length <= 2}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }
  } else {
    return null;
  }
}