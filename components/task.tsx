'use client'
import { auth } from "@/app/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/models/tasks";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSwipeable } from 'react-swipeable';
import { Container } from "reactstrap";
import { LayoutManager } from "../utils/layout-manager";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

interface TaskComponentProps {
    task: Task;
    refreshGrid: () => void;
}

export default function TaskComponent(props: TaskComponentProps) {
    const [user, setUser] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [isOverdue, setIsOverdue] = useState(false);
    const [task, setTask] = useState<Task | null>(props.task);
    const [isDuringCheckboxChange, setIsDuringCheckboxChange] = useState(false);
    const [offset, setOffset] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [bgColor, setBgColor] = useState('rgb(255, 255, 255)');
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

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
        setIsDuringCheckboxChange(true);
        const newIsCompleted = !isCompleted;
        setIsCompleted(newIsCompleted);
        try {
            const token = await user.getIdToken();
            const response = await fetch(`/api/postgres/manage-task-status`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
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
                const { error } = await response.json();
                console.error(response.status, 'Failed to finish task: ', error);
            }
        } catch (error) {
            console.error('Error finishing task:', error);
        }
        setIsDuringCheckboxChange(false);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/postgres/delete-task`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`,
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

    const isMobile = LayoutManager.getIsMobile();
    const maxSwipe = typeof window !== 'undefined' ? -window.innerWidth * 0.75 : -300;
    const colorThreshold = maxSwipe / 3;

    const handlers = useSwipeable({
        onSwiping: (e) => {
            if (!isMobile || isDeleting) return;
            if (e.deltaX < 0) {
                const newOffset = Math.max(maxSwipe, e.deltaX);
                setOffset(newOffset);
                const progress = Math.abs(newOffset / maxSwipe);
                setOpacity(1 - (progress * 0.7));

                if (newOffset < colorThreshold) {
                    const colorProgress = Math.abs((newOffset - colorThreshold) / (maxSwipe - colorThreshold));
                    const red = Math.floor(255);
                    const green = Math.floor(255 * (1 - colorProgress));
                    const blue = Math.floor(255 * (1 - colorProgress));
                    setBgColor(`rgb(${red}, ${green}, ${blue})`);
                } else {
                    setBgColor('rgb(255, 255, 255)');
                }
            }
        },
        onSwiped: async () => {
            if (!isMobile || isDeleting) return;
            if (offset > maxSwipe / 1.25) {
                setOffset(0);
                setOpacity(1);
                setBgColor('rgb(255, 255, 255)');
            } else {
                setIsDeleting(true);
                try {
                    await handleDelete();
                } catch (error) {
                    setOffset(0);
                    setOpacity(1);
                    setBgColor('rgb(255, 255, 255)');
                }
                setIsDeleting(false);
            }
        }
    });

    if (isDuringCheckboxChange || !task) return <div key={task.id} className="flex space-x-2">
        <Skeleton className="h-[150px] flex-1" />
    </div>

    return (
        <div className="w-full h-full relative">
            <div
                {...handlers}
                style={{
                    transform: isDeleting ? 'translateX(-120%)' : `translateX(${offset}px)`,
                    opacity: opacity,
                    transition: offset === 0 && !isDeleting ? 'all 0.2s ease-out' : 'all 0.3s ease-out'
                }}
            >
                <Card
                    onClick={(e) => {
                        if ((e.target as HTMLInputElement).type !== "button")
                            router.push(`/dashboard/task/${task.id}`);
                    }}
                    className={`cursor-pointer bg-white-500 hover:bg-gray-50 shadow-md`}
                    style={{ backgroundColor: isMobile ? bgColor : undefined }}
                >
                    {task && (
                        <>
                            <CardHeader className={"flex flex-row gap-2 items-center justify-start md:justify-between"}>
                                <Container className="gap-3 flex items-center justify-between lg:justify-start">
                                    <Checkbox
                                        className={"rounded-full w-[40px] h-[40px] lg:w-[30px] lg:h-[30px] border-black-500"}
                                        checked={isCompleted}
                                        onCheckedChange={handleCheckboxChange}
                                    />
                                    <Label className="text-xl lg:text-md m-0 text-right lg:text-left">{task.title}</Label>
                                </Container>
                                {
                                    !isMobile &&
                                    <Container className="flex gap-3 items-center justify-end">
                                        <Label className={"text-md text-gray-400 m-0" + `${isOverdue ? " text-red-600" : ""}`}>{displayText}</Label>
                                        <Button
                                            className={`${(isCompleted || isOverdue) && !isMobile ? "text-gray-800 hover:text-gray-800" : ""} ${isMobile ? "text-gray-0 pointer-events-none px-3" : ""}`}
                                            type="button"
                                            variant="ghost"
                                            onClick={isMobile ? undefined : handleDelete}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </Container>
                                }
                            </CardHeader>
                            <CardContent className="flex justify-center items-center lg:justify-start">
                                <Label>{task.description}</Label>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
