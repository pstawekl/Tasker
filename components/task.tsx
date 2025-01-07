'use client'
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/models/tasks";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface TaskComponentProps {
    task: Task;
    refreshGrid: () => void;
}

export default function TaskComponent(props: TaskComponentProps) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [isOverdue, setIsOverdue] = useState(false);
    const [task, setTask] = useState<Task | null>(props.task);
    const router = useRouter();

    useEffect(() => {
        setIsCompleted(Boolean(task.is_completed));

        if (task && !task.is_completed) {
            const now = new Date();
            const dueDate = new Date(task.due_date);
            setIsOverdue(dueDate < now);
            setDisplayText(format(dueDate, 'dd-MM-yyyy'));

            if (dueDate > now) {
                const diffTime = dueDate.getTime() - now.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                if (diffDays < 1) {
                    setDisplayText(`pozostało ${diffHours} godzin`);
                } else if (diffDays < 2) {
                    setDisplayText(`pozostał 1 dzień i ${diffHours} godzin`);
                } else if (diffDays < 30) {
                    setDisplayText(`pozostało ${diffDays} dni`);
                }
            }
        }
    }, [task]);

    const handleCheckboxChange = async () => {
        const newIsCompleted = !isCompleted;
        setIsCompleted(newIsCompleted);
        try {
            const response = await fetch(`/api/postgres/manage-task-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId: task.id, isCompleted: !isCompleted }),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.task.is_completed !== isCompleted) {
                    setTask(data.task);
                    props.refreshGrid();
                }
            } else {
                console.error('Failed to finish task');
            }
        } catch (error) {
            console.error('Error finishing task:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/postgres/delete-task`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: task.id }),
            });
            if (response.ok) {
                props.refreshGrid();
            } else {
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
    return (
        <Card
            onClick={(e) => {
                console.log((e.target as HTMLInputElement).type);
                if ((e.target as HTMLInputElement).type !== "button")
                    router.push(`/dashboard/task/${task.id}`);
            }}
            className={`cursor-pointer bg-white-500 hover:bg-gray-50 ${isOverdue ? "bg-red-500 hover:bg-red-300" : ""} ${isCompleted ? "bg-green-400 hover:bg-green-300 text-white" : ""}`}
        >
            {
                task &&
                <>
                    <CardHeader className={"d-flex flex-row gap-2 items-center justify-start md:justify-between"}>
                        <Container className="gap-3 d-flex items-center">
                            <Checkbox
                                className="rounded-xl border-black-500"
                                checked={isCompleted}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <Label className="text-md m-0">{task.title}</Label>
                        </Container>
                        <Container className="d-flex gap-3 items-center justify-end">
                            <Label className="text-md text-gray-400 m-0">{displayText}</Label>
                            <Button className={`${isCompleted || isOverdue ? "text-black hover:text-black" : ""}`} type="button" variant="outline" onClick={handleDelete}><Trash /></Button>
                        </Container>
                    </CardHeader>
                    <CardContent>
                        <Label>{task.description}</Label>
                    </CardContent>
                </>
            }
        </Card>
    );
}
