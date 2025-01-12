'use client'
import { auth } from "@/app/firebaseConfig";
import LoadingSpinner from "@/components/loadingSpinner";
import TaskListSkeleton from "@/components/skeletons/task-list-skeleton";
import TaskComponent from "@/components/task";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TaskList } from "@/lib/models/taskList";
import { Task, Tasks } from "@/lib/models/tasks";
import { onAuthStateChanged } from "firebase/auth";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

enum TaskSortingType {
    byDueDateOlder = "Od najstarszej daty",
    byDueDateLatest = "Od najpóźniejszej daty",
    byTitleAsc = "Po tytule zadania rosnąco",
    byTitleDesc = "Po tytule zadania malejąco",
}


type TaskListPageError = {
    isError: boolean;
    message: string;
}

export default function TaskListPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const { taskListId } = useParams();
    const [tasks, setTasks] = useState<Tasks | null>(null);
    const [isTasksLoading, setIsTasksLoading] = useState<boolean>(true);
    const [taskSortingType, setTaskSortingType] = useState<TaskSortingType>(TaskSortingType.byDueDateOlder);
    const { register, watch, reset, setValue } = useForm();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [taskList, setTaskList] = useState<TaskList | null>(null);
    const [isTaskListError, setIsTaskListError] = useState<TaskListPageError>({ isError: false, message: '' });
    const [isLoadingOnMount, setIsLoadingOnMount] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchTasks = async () => {
        if (user) {
            try {
                setIsTasksLoading(true);
                const token = await user.getIdToken();
                const response = await fetch(`/api/postgres/get-tasks`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ taskListId: taskListId }),
                });
                if (response.ok) {
                    const { tasks } = await response.json();
                    setTasks(tasks);
                    setIsTasksLoading(false);
                } else {
                    setIsTaskListError({ isError: true, message: 'Failed to fetch tasks' });
                }
            } catch (error) {
                setIsTaskListError({ isError: true, message: error });
            }
        }
    }

    useEffect(() => {
        setIsLoadingOnMount(true);
        const fetchTaskList = async () => {
            try {
                const token = await user.getIdToken();
                const response = await fetch(`/api/postgres/get-task-list`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ list_id: taskListId }),
                });
                if (response.ok) {
                    const { taskList } = await response.json();
                    setTaskList(taskList);
                } else {
                    setIsTaskListError({ isError: true, message: 'Failed to fetch task list' });
                }
            } catch (error) {
                setIsTaskListError({ isError: true, message: 'Error fetching task list' });
            }

        }

        if (user) {
            fetchTaskList();
        }
        setIsLoadingOnMount(false);
    }, [user])

    useEffect(() => {
        if (taskList) {
            setIsLoadingOnMount(true);
            document.title = taskList.name;
            fetchTasks();
            setIsLoadingOnMount(false);
        }
    }, [taskList])

    useEffect(() => {
        if (selectedDate) {
            const date = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');

            setValue('due_date', date);
        }
    }, [selectedDate]);

    function refreshGrid() {
        setIsLoadingOnMount(true)
        setIsTasksLoading(true);
        fetchTasks();
        setIsLoadingOnMount(false);
    }

    useEffect(() => {
        setIsLoadingOnMount(true);
        fetchTasks();
        setIsLoadingOnMount(false);
    }, [taskSortingType]);

    const sortTasks = (tasks: Tasks) => {
        const sortedTasks = [...tasks]; // Create a copy to avoid mutating the original array
        switch (taskSortingType) {
            case TaskSortingType.byDueDateOlder:
                return sortedTasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
            case TaskSortingType.byDueDateLatest:
                return sortedTasks.sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime());
            case TaskSortingType.byTitleAsc:
                return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
            case TaskSortingType.byTitleDesc:
                return sortedTasks.sort((a, b) => b.title.localeCompare(a.title));
            default:
                return sortedTasks;
        }
    };

    async function onSubmit(data) {
        setIsLoadingOnMount(true);
        try {
            const date = watch('due_date') as string;
            const time = watch('due_time') as string;
            const dueDate = new Date(`${date} ${time}:00`);
            const response = await fetch('/api/postgres/add-task', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: {
                        title: watch('title'),
                        description: watch('description'),
                        due_date: dueDate,
                        list_id: Number(taskListId),
                    } as Task
                }),
            });
            if (response.ok) {
                refreshGrid();
                reset();
            } else {
                setIsTaskListError({ isError: true, message: 'Failed to add task' });
            }
        } catch (error) {
            setIsTaskListError({ isError: true, message: error });
        }
    }

    if (isLoading) {
        return <div className="w-full h-full relative">
            <LoadingSpinner />
        </div>;
    }

    return (
        <div className="relative p-4 d-flex flex-column gap-3 max-h-[95vh] w-full h-full overflow-hidden">
            <Dialog>
                <DialogTrigger asChild>
                    {
                        !isTaskListError.isError && !isTasksLoading && tasks &&
                        <Button variant="outline" className="w-min" title="Dodaj zadanie">
                            <Plus />
                        </Button>
                    }
                </DialogTrigger>
                <DialogContent className="w-[100vw] h-[100vh] d-flex flex-column md:w-auto md:h-auto md:min-w-[30%]">
                    <DialogHeader className="d-flex flex-row items-center">
                        <DialogTitle className="m-0">Dodaj nowe zadanie</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label htmlFor="title" className="form-label">Tytuł zadania:</label>
                            <Input type="text" id="title" name="title" {...register('title')} required />
                        </div>
                        <div>
                            <label htmlFor="description" className="form-label">Opis:</label>
                            <Textarea id="description" name="description" {...register('description')} required />
                        </div>
                        <div className="d-flex flex-column justify-center items-center">
                            <label htmlFor="due_date" className="mr-auto ml-0 form-label">Termin wykonania:</label>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => setSelectedDate(date)}
                            >
                            </Calendar>
                            <Input className="w-min" type="time" id="due_time" name="due_time" {...register('due_time')} lang={'pl-PL'} required />
                        </div>
                        <Button variant="outline" className='w-full' type="submit">Dodaj zadanie</Button>
                    </form>
                </DialogContent>
            </Dialog>
            {
                !isTaskListError.isError && tasks && <div className="mb-3">
                    <Label htmlFor="sorting" className="form-label ">Sortuj według:</Label>
                    <Select
                        value={taskSortingType}
                        onValueChange={(value) => setTaskSortingType(value as TaskSortingType)}
                    >
                        <SelectTrigger className="w-full lg:w-1/6">
                            <SelectValue placeholder={TaskSortingType.byDueDateOlder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TaskSortingType.byDueDateOlder}>{TaskSortingType.byDueDateOlder}</SelectItem>
                            <SelectItem value={TaskSortingType.byDueDateLatest}>{TaskSortingType.byDueDateLatest}</SelectItem>
                            <SelectItem value={TaskSortingType.byTitleAsc}>{TaskSortingType.byTitleAsc}</SelectItem>
                            <SelectItem value={TaskSortingType.byTitleDesc}>{TaskSortingType.byTitleDesc}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            }
            {

            }
            {
                isTasksLoading && !isTaskListError ?
                    <div className="w-100 h-100 flex justify-center items-center"><TaskListSkeleton /></div> :
                    <div className="overflow-y-auto overflow-x-hidden h-auto gap-3 d-flex flex-column">
                        {
                            tasks && sortTasks(tasks).map((task) => (
                                !task.is_completed && <TaskComponent key={task.id} task={task} refreshGrid={refreshGrid} />
                            ))
                        }
                        {
                            tasks && sortTasks(tasks).map((task) => (   
                                task.is_completed && <TaskComponent key={task.id} task={task} refreshGrid={refreshGrid} />
                            ))
                        }
                    </div>
            }
            {
                isTaskListError.isError &&
                <div className="bg-red-500 text-white p-3 rounded-md">
                    <div className="text-2xl text-normal">Nie udało się pobrać listy zadań</div>
                    <div className="text-lg">{isTaskListError.message}</div>
                </div>
            }
            {
                isLoadingOnMount && <LoadingSpinner />
            }
        </div>
    );
};
