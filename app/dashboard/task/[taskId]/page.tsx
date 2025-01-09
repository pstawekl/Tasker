'use client';

import { auth } from '@/app/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Reminders } from '@/lib/models/reminders';
import { Task } from '@/lib/models/tasks';
import { faArrowLeft, faBell, faCheck, faClose, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Spinner } from 'reactstrap';

type TaskError = {
    message: string;
    isError: boolean;
}

export default function TaskPage() {
    const [user, setUser] = useState<User>(null);
    const { taskId } = useParams();
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const router = useRouter();
    const [task, setTask] = useState<Task | null>(null);
    const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
    const [editValue, setEditValue] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [reminders, setReminders] = useState<Reminders>([]);
    const [isAddReminderDialogOpen, setIsAddReminderDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [taskError, setTaskError] = useState<TaskError>({ isError: false, message: '' });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (task)
                setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(`/api/postgres/get-task`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${await user.getIdToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ taskId: taskId }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setTask(data.task);
                } else {
                    setTaskError({ isError: true, message: 'Błąd podczas pobierania zadania.' });
                }
            } catch (error) {
                setTaskError({ isError: true, message: 'Błąd podczas pobierania zadania.' });
            } finally {
                setLoading(false);
            }
        };

        if (!taskId || isNaN(Number(taskId))) {
            setTaskError({ isError: true, message: 'Brak task Id' });
            setLoading(false);
            setTimeout(() => router.push('/'), 5000);
            return;
        }

        const fetchReminders = async () => {
            try {
                const response = await fetch(`/api/postgres/get-reminders`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${await user.getIdToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ task_id: taskId }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setReminders(data.reminders as Reminders);
                } else {
                    setTaskError({ isError: true, message: 'Błąd podczas pobierania przypomnień.' });
                }
            } catch (error) {
                setTaskError({ isError: true, message: 'Błąd podczas pobierania przypomnień.' });
            }
        };

        if (user) {
            fetchTask();
            fetchReminders();
        }
    }, [taskId, user]);

    useEffect(() => {
        if (selectedDate) {
            const date = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');
            setValue('reminder_date', date);
        }
    }, [selectedDate])


    const addReminder = async () => {
        const date = watch('reminder_date') as string;
        const time = watch('reminder_time') as string;
        const reminderTime: Date = new Date(`${date} ${time}:00`);

        try {
            const response = await fetch('/api/postgres/reminders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task_id: taskId,
                    reminder_time: reminderTime,
                }),
            });

            if (response.ok) {
                const newReminder = await response.json();
                setReminders([...reminders, newReminder]);
            } else {
                console.error('Failed to add reminder');
            }
        } catch (error) {
            console.error('Error adding reminder:', error);
        }
    };

    const updateReminder = async (id: number, reminderTime: Date) => {
        try {
            const response = await fetch('/api/postgres/reminders', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    reminder_time: reminderTime,
                }),
            });

            if (response.ok) {
                const updatedReminder = await response.json();
                setReminders(reminders.map(reminder => reminder.id === id ? updatedReminder : reminder));
            } else {
                console.error('Failed to update reminder');
            }
        } catch (error) {
            console.error('Error updating reminder:', error);
        }
    };

    const deleteReminder = async (id: number) => {
        try {
            const response = await fetch('/api/postgres/reminders', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                setReminders(reminders.filter(reminder => reminder.id !== id));
            } else {
                console.error('Failed to delete reminder');
            }
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    const handleDoubleClick = (field: string, value: string) => {
        setIsEditing({ ...isEditing, [field]: true });
        setEditValue({ ...editValue, [field]: value });
    };

    const handleInputChange = (field: string, value: string) => {
        setEditValue({ ...editValue, [field]: value });
    };

    const handleKeyDown = async (event: React.KeyboardEvent, field: string) => {
        if (event.key === 'Enter') {
            try {
                const token = await auth.currentUser.getIdToken();
                const response = await fetch('/api/postgres/edit-task', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: taskId,
                        title: editValue['title'],
                        description: editValue['description'],
                        due_date: editValue['due_date'],
                    }),
                });

                if (response.ok) {
                    const updatedTask = await response.json();
                    setTask(updatedTask);
                } else {
                    console.error('Failed to update task');
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
            setIsEditing({ ...isEditing, [field]: false });
        } else if (event.key === 'Escape') {
            setIsEditing({ ...isEditing, [field]: false });
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (!task && !loading) {
        setTaskError({ isError: true, message: 'Zadanie nie istnieje' });
    }

    if (!user && !loading) {
        setTaskError({ isError: true, message: 'Błąd autoryzacji' });
    }

    if (taskError.isError) {
        return <div className='bg-red-500 text-white p-5 rounded-lg'>
            <div className='text-2xl'></div>
            <div>{taskError.message}</div>
        </div>;
    } else return (
        <div className='p-5 w-full d-flex flex-row justify-stretch gap-5'>
            <Card className='w-full h-full'>
                <CardHeader className='w-full d-flex flex-row gap-3 items-center'>
                    <Button className='w-min' onClick={() => router.back()} variant='outline'><FontAwesomeIcon icon={faArrowLeft} /></Button>
                    <h1
                        className="text-2xl font-bold m-0"
                        onDoubleClick={() => handleDoubleClick('title', task.title)}
                    >
                        {isEditing['title'] ? (
                            <Input
                                value={editValue['title']}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, 'title')}
                            />
                        ) : (
                            task.title
                        )}
                    </h1>
                </CardHeader>
                <CardContent className="flex-row flex-wrap justify-between gap-5 p-4 w-auto">
                    <p className="d-flex flex-column gap-2">
                        <strong>Opis:</strong>
                        <span onDoubleClick={() => handleDoubleClick('description', task.description || '')}>
                            {isEditing['description'] ? (
                                <Input
                                    value={editValue['description']}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'description')}
                                />
                            ) : (
                                task.description || 'Brak opisu'
                            )}
                        </span>
                    </p>
                    <p className="d-flex flex-column gap-2">
                        <strong>Termin:</strong>
                        <span onDoubleClick={() => handleDoubleClick('due_date', task.due_date.toISOString() || '')}>
                            {isEditing['due_date'] ? (
                                <Input
                                    type="date"
                                    value={editValue['due_date']}
                                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'due_date')}
                                />
                            ) : (
                                task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Brak terminu'
                            )}
                        </span>
                    </p>
                    <p className="d-flex flex-column gap-2"><strong>Status:</strong>
                        {
                            task.is_completed
                                ?
                                <FontAwesomeIcon icon={faCheck} className="text-green-500 ml-0 mr-auto" />
                                :
                                <FontAwesomeIcon icon={faClose} className="text-red-500 ml-0 mr-auto" />
                        }
                    </p>
                </CardContent>
                <CardFooter>
                    <Dialog open={isAddReminderDialogOpen} onOpenChange={setIsAddReminderDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setIsAddReminderDialogOpen(true)} variant={'outline'} title={'Dodaj przypomnienie'}>
                                <FontAwesomeIcon icon={faBell} />
                                Dodaj
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='w-[100vw] h-[100vh] d-flex flex-column justify-start md:w-auto md:h-auto md:min-w-[30%]'>
                            <DialogHeader className='d-flex flex-row items-center'>
                                <DialogTitle className='m-0'>Dodaj nowe przypomnienie</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => { e.preventDefault(); addReminder(); }} className="space-y-4">
                                <div className='d-flex flex-column justify-center items-center'>
                                    <Label className='mr-auto ml-0' htmlFor="date">Data przypomnienia:</Label>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => setSelectedDate(date)}
                                    />
                                    <Input
                                        className='w-min'
                                        id="reminder_time"
                                        type="time"
                                        {...register('reminder_time', { required: true })}
                                    />
                                </div>
                                <Button variant={'outline'} type="submit" className="w-full">Zapisz</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
            {
                reminders && reminders.length > 0 && (
                    <Card className='w-full h-full'>
                        <CardHeader>
                            <h2 className="text-xl font-bold mb-2">Przypomnienia</h2>
                        </CardHeader>
                        <CardContent>
                            <ul className="d-flex flex-column">
                                {reminders && reminders.map(reminder => (
                                    <li key={reminder.id} className="d-flex flex-row justify-between p-3 items-center hover:rounded hover:bg-gray-100">
                                        <span className='text-lg'>{new Date(reminder.reminder_time).toLocaleString()}</span>
                                        <div>
                                            <Button variant='outline' onClick={() => updateReminder(reminder.id, new Date())}>
                                                <FontAwesomeIcon icon={faPen} />
                                            </Button>
                                            <Button variant='outline' onClick={() => deleteReminder(reminder.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )
            }
        </div>
    );
}
