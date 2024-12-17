'use client'
import TaskComponent from "@/components/task";
import { Task, Tasks } from "@/lib/models/tasks";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "reactstrap";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TaskListSkeleton from "@/components/skeletons/task-list-skeleton";
import { TaskList } from "@/lib/models/taskList";

enum TaskSortingType {
    byDueDateOlder = "Od najstarszej daty",
    byDueDateLatest = "Od najpóźniejszej daty",
    byTitleAsc = "Po tytule zadania rosnąco",
    byTitleDesc = "Po tytule zadania malejąco",
}

export default function TaskListPage() {
    const { user, isLoading } = useUser();
    const { taskListId } = useParams();
    const [tasks, setTasks] = useState<Tasks | null>(null);
    const [isTasksLoading, setIsTasksLoading] = useState<boolean>(true);
    const [taskSortingType, setTaskSortingType] = useState<TaskSortingType>(TaskSortingType.byDueDateOlder);
    const { register, watch, reset, setValue } = useForm();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [taskList, setTaskList] = useState<TaskList | null>(null);

    const fetchTasks = async () => {
        try {
            setIsTasksLoading(true);
            const response = await fetch(`/api/postgres/get-tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskListId: taskListId }),
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data.tasks);
                setIsTasksLoading(false);
            } else {
                console.error('Failed to fetch tasks');
            }
        } catch (error) {
            console.log('Error fetching tasks:', error);
        }
    }

    useEffect(() => {
        const fetchTaskList = async () => {
            try {
                const response = await fetch(`/api/postgres/get-task-list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ list_id: taskListId }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setTaskList(data.taskList);
                } else {
                    console.error('Failed to fetch task list');
                }
            } catch (error) {
                console.log('Error fetching task list:', error);
            }
        }

        fetchTaskList();
    }, [])

    useEffect(() => {
        if (taskList) {
            document.title = taskList.name;
        }
    }, [taskList])

    useEffect(() => {
        if (selectedDate) {
            const date = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');

            setValue('due_date', date);
        }
    }, [selectedDate]);

    function refreshGrid() {
        setIsTasksLoading(true);
        fetchTasks();
    }

    useEffect(() => {
        fetchTasks();
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
                return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return sortedTasks;
        }
    };

    async function onSubmit(data) {
        try {
            const date = watch('due_date') as string;
            const time = watch('due_time') as string;
            const dueDate = new Date(`${date} ${time}:00`);
            const response = await fetch('/api/postgres/add-task', {
                method: 'POST',
                headers: {
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
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    return (
        <div className="p-4 d-flex flex-column gap-3 max-h-[95vh] w-full h-full overflow-hidden">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-min" title="Dodaj zadanie">
                        <Plus />
                    </Button>
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
            <div className="mb-3">
                <Label htmlFor="sorting" className="form-label ">Sortuj według:</Label>
                <Select
                    value={taskSortingType}
                    onValueChange={(value) => setTaskSortingType(value as TaskSortingType)}
                >
                    <SelectTrigger>
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
            {
                isTasksLoading ?
                    <TaskListSkeleton /> :
                    <div className="overflow-y-scroll overflow-x-hidden h-auto gap-3 d-flex flex-column">
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
        </div>
    );
};
