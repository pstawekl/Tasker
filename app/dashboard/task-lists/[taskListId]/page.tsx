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
import { LayoutManager } from "../../../../utils/layout-manager";

enum TaskSortingType {
    byDueDateOlder = "Od najdłuższej daty wykonania",
    byDueDateLatest = "Od najkrótszej daty wykonania",
    byTitleAsc = "Po tytule zadania rosnąco",
    byTitleDesc = "Po tytule zadania malejąco",
    byCreateLatest = "Od najnowszych",
    byCreateOldest = "Od najstarszych"
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
    const [taskSortingType, setTaskSortingType] = useState<TaskSortingType>(TaskSortingType.byCreateLatest);
    const { register, watch, reset, setValue } = useForm();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [taskList, setTaskList] = useState<TaskList | null>(null);
    const [isTaskListError, setIsTaskListError] = useState<TaskListPageError>({ isError: false, message: '' });
    const [isLoadingOnMount, setIsLoadingOnMount] = useState(true);
    const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const savedSortingType = localStorage.getItem('taskSortingType');
        console.log(savedSortingType)
        if (savedSortingType) {
            setTaskSortingType(savedSortingType as TaskSortingType);
        }
    }, []);

    useEffect(() => {
        if (user && taskList) {
            setIsLoadingOnMount(true);
            fetchTasks();
            setIsLoadingOnMount(false);
        }
    }, [user, taskList, taskSortingType]);

    useEffect(() => {
        if (!isTasksLoading && !isTaskListError.isError && tasks) {
            localStorage.setItem('taskSortingType', taskSortingType);
        }
    }, [taskSortingType]);

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
            case TaskSortingType.byCreateLatest:
                return sortedTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case TaskSortingType.byCreateOldest:
                return sortedTasks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            default:
                return sortedTasks;
        }
    };

    async function onSubmit(event) {
        event.preventDefault();
        setIsLoadingOnMount(true);
        setIsAddTaskDialogOpen(false);
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
                fetchTasks();
                reset();
            } else {
                setIsTaskListError({ isError: true, message: 'Failed to add task' });
            }
        } catch (error) {
            setIsTaskListError({ isError: true, message: error });
        }
        setIsLoadingOnMount(false);
    }

    if (isLoading) {
        return <div className="w-full h-full relative">
            <LoadingSpinner />
        </div>;
    }

    const isAddNewTaskButttonDisabled: boolean = isTaskListError.isError && isTasksLoading && tasks && tasks.length == 0;

    const isLoadingSpinnerShow: boolean = isLoadingOnMount || !tasks || isTasksLoading;

    return (
        <div className="relative p-4 d-flex flex-column gap-3 max-h-[95vh] w-full h-full overflow-hidden">
            <div className="flex flex-row lg:!flex-col gap-2 justify-between lg:justify-start">
                <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-min" title="Dodaj zadanie" disabled={isAddNewTaskButttonDisabled}>
                            <Plus />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[100vw] h-[100vh] d-flex flex-column md:w-auto md:h-auto md:min-w-[30%]">
                        <DialogHeader className="d-flex flex-row items-center">
                            <DialogTitle className="m-0">Dodaj nowe zadanie</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={async (event) => {
                                await onSubmit(event);
                                setIsAddTaskDialogOpen(false);
                            }}
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
                    !isTaskListError.isError && <div className="mb-3">
                        {
                            !LayoutManager.getIsMobile() && <Label htmlFor="sorting" className="form-label ">Sortuj według:</Label>
                        }
                        <Select
                            value={taskSortingType}
                            onValueChange={(value) => !isTasksLoading && setTaskSortingType(value as TaskSortingType)}
                            disabled={isTasksLoading || isTaskListError.isError || tasks.length == 0}
                        >
                            <SelectTrigger className="w-full lg:w-1/6">
                                <SelectValue placeholder={taskSortingType} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TaskSortingType.byCreateLatest}>{TaskSortingType.byCreateLatest}</SelectItem>
                                <SelectItem value={TaskSortingType.byCreateOldest}>{TaskSortingType.byCreateOldest}</SelectItem>
                                <SelectItem value={TaskSortingType.byDueDateOlder}>{TaskSortingType.byDueDateOlder}</SelectItem>
                                <SelectItem value={TaskSortingType.byDueDateLatest}>{TaskSortingType.byDueDateLatest}</SelectItem>
                                <SelectItem value={TaskSortingType.byTitleAsc}>{TaskSortingType.byTitleAsc}</SelectItem>
                                <SelectItem value={TaskSortingType.byTitleDesc}>{TaskSortingType.byTitleDesc}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                }
            </div>
            {

            }
            {
                isTasksLoading && !isTaskListError ?
                    <div className="w-100 h-100 flex justify-center items-center"><TaskListSkeleton /></div> :
                    <div className="overflow-y-auto overflow-x-hidden h-full gap-3 flex flex-col">
                        {
                            tasks && sortTasks(tasks).map((task) => (
                                !task.is_completed && <TaskComponent onClick={() => setIsTasksLoading(true)} key={task.id} task={task} refreshGrid={refreshGrid} />
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
                isLoadingSpinnerShow && <LoadingSpinner />
            }
        </div>
    );
};
