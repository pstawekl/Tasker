'use client'
import { auth } from '@/app/firebaseConfig';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TaskLists } from "@/lib/models/taskList";
import { User as DbUser } from '@/lib/models/users';
import DefaultUserAvatar from '@/public/default-user-avatar.jpg';
import Logo from "@/public/logo.webp";
import { faGear, faPowerOff, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, User } from 'firebase/auth';
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Spinner } from 'reactstrap';

const SIDEBAR_COOKIE_NAME = "sidebar:state";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dbUser, setDbUser] = useState<DbUser | null>(null);
    const [taskList, setTaskList] = useState<TaskLists>([]);
    const [defaultOpen, setDefaultOpen] = useState<boolean>(false);
    const [isAddingNewList, setIsAddingNewList] = useState<boolean>(false);
    const [isSidebarLoaded, setIsSidebarLoaded] = useState(false);
    const [newListName, setNewListName] = useState<string>('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
                setLoading(false);
                console.log(authUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [])


    //#region functions
    //#region useEffects handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsAddingNewList(false);
                setNewListName('');
            }

            if (e.key === 'Enter') {
                if (isAddingNewList) {
                    addNewList();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isAddingNewList, newListName]);

    useEffect(() => {
        setDefaultOpen(Boolean(getCookie(SIDEBAR_COOKIE_NAME)));
    }, [])

    useEffect(() => {
        const fetchDbUser = async () => {
            try {
                const response = await fetch('/api/postgres/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ firebase_id: user.uid }),
                })
                if (response.ok) {
                    const data = await response.json();
                    setDbUser(data.users[0]);
                } else {
                    console.error('Failed to fetch user');
                }

            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        if (user && !loading) {
            fetchDbUser();
        }
    }, [user]);

    useEffect(() => {
        if (dbUser && user && taskList) {
            setIsSidebarLoaded(true);
        }
    }, [dbUser, user, taskList]);

    const fetchItems = async () => {
        try {
            const response = await fetch(`/api/postgres/task-list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: dbUser.id }),
            });
            if (response.ok) {
                const data = await response.json();
                setTaskList(data.taskLists);
            } else {
                console.error('Failed to fetch task list');
            }
        } catch (error) {
            console.error('Error fetching task list:', error);
        }
    };

    useEffect(() => {
        if (dbUser) {
            fetchItems();
        }
    }, [dbUser]);
    //#endregion

    //#region manage tasks functions
    async function addNewList() {
        if (newListName.length > 2) {
            const response = await fetch('/api/postgres/add-new-task-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: dbUser.id, name: newListName }),
            })

            if (response.ok) {
                setIsAddingNewList(false);
                fetchItems();
                setNewListName('');
            } else {
                console.error('Failed to add new task list');
            }
        }
    }

    async function removeList(id: number) {
        const response = await fetch('/api/postgres/remove-task-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })

        if (response.ok) {
            fetchItems();
        } else {
            console.error('Failed to remove task list');
        }
    }
    //#endregion

    //#region usable handlers
    function handleAddingNewList(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        setIsAddingNewList(true);
    }

    function handlePlusClick(e: React.MouseEvent<SVGElement, MouseEvent>) {
        e.preventDefault();
        if (isAddingNewList) {
            addNewList();
        } else {
            setIsAddingNewList(true);
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };
    //#endregion
    //#endregion

    // Nie renderuj niczego podczas pierwszego renderowania na serwerze
    if (!isMounted) {
        return <div></div>;
    }

    if (!user || loading) {
        return <div className="w-full h-full flex items-center justify-center"><Spinner /></div>;
    }

    return (
        <>
            <SidebarProvider defaultOpen={Boolean(defaultOpen)}>
                {
                    //#region sidebar left side
                }
                <Sidebar className="max-h-[100vh]" onLoad={() => setIsSidebarLoaded(true)}>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel className="whitespace-pre text-xl select-none"><Image src={Logo} alt="Logo" width={30} />{` ${process.env.NEXT_PUBLIC_APP_NAME}`}</SidebarGroupLabel>
                            <SidebarGroupContent className="mt-5">
                                <SidebarMenu className="h-auto">
                                    <SidebarMenuItem className="h-auto" key={0}>
                                        <SidebarMenuButton asChild>
                                            <a className="text-black hover:no-underline" href="/dashboard">
                                                <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <Collapsible defaultOpen className="group/collapsible">
                                        <SidebarGroup>
                                            <SidebarGroupLabel asChild>
                                                <CollapsibleTrigger>
                                                    Listy zadań
                                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                                </CollapsibleTrigger>
                                            </SidebarGroupLabel>
                                            <CollapsibleContent>
                                                <SidebarGroupContent>
                                                    <SidebarMenu>
                                                        {taskList.map((item) => (
                                                            <SidebarMenuItem className="d-flex flex-row" key={item.id}>
                                                                <SidebarMenuButton className="d-flex flex-row w-100" asChild>
                                                                    <a className="text-black hover:no-underline" href={`/dashboard/task-lists/${item.id}`}>
                                                                        <SidebarGroupLabel>{item.name}</SidebarGroupLabel>
                                                                    </a>
                                                                </SidebarMenuButton>
                                                                <FontAwesomeIcon className="text-gray-500 hover:text-gray:800 hover:bg-gray-200" onClick={() => removeList(item.id)} icon={faTrash} />
                                                            </SidebarMenuItem>
                                                        ))}
                                                    </SidebarMenu>
                                                </SidebarGroupContent>
                                            </CollapsibleContent>
                                        </SidebarGroup>
                                    </Collapsible>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <a className="text-black hover:no-underline d-flex justify-center" href="#">
                                                {
                                                    isAddingNewList ?
                                                        <Input
                                                            id="add-new-list"
                                                            type="text"
                                                            className="m-0 p-1 border-none focus:border-none focus:bg-transparent bg-transparent w-full h-min"
                                                            autoFocus
                                                            value={newListName}
                                                            onChange={(e) => setNewListName(e.target.value)}
                                                        />
                                                        :
                                                        <SidebarGroupLabel onClick={handleAddingNewList} className="m-0 p-0 w-100 text-center d-flex flex-row gap-2">
                                                            Dodaj listę
                                                            <Plus className="ml-auto" onClick={handlePlusClick} />
                                                        </SidebarGroupLabel>
                                                }
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <SidebarMenuButton className="d-flex flex-row w-full">
                                                    <Image src={user?.photoURL ?? DefaultUserAvatar} alt="User avatar" width={30} height={30} className="max-w-[30px] max-h-[30px] rounded-full flex-auto" />
                                                    <SidebarGroupLabel className="flex-auto max-w-100 overflow-hidden text-ellipsis">{user && user.displayName ? user.displayName : user.email}</SidebarGroupLabel>
                                                    <ChevronUp className="ml-auto flex-auto" />
                                                </SidebarMenuButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                side="top"
                                                className="w-[--radix-popper-anchor-width]"
                                            >
                                                <DropdownMenuItem>
                                                    <a className="w-100 text-lg text-black hover:no-underline d-flex flex-row gap-2 items-center" href="/dashboard/profile">
                                                        <SidebarGroupLabel className="gap-2"><FontAwesomeIcon icon={faUser} /> Profil</SidebarGroupLabel>
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <a className="w-100 text-lg text-black hover:no-underline d-flex flex-row gap-2 items-center" href="#">
                                                        <SidebarGroupLabel className="gap-2"><FontAwesomeIcon icon={faGear} /> Ustawienia</SidebarGroupLabel>
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <a onClick={handleLogout} className="w-100 text-lg text-black hover:no-underline d-flex flex-row gap-2 items-center" href="#">
                                                        <SidebarGroupLabel className="gap-2"><FontAwesomeIcon icon={faPowerOff} />Wyloguj się</SidebarGroupLabel>
                                                    </a>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarFooter>
                </Sidebar>
                {
                    //#endregion
                }
                <main className="w-full h-full max-h-100">
                    <SidebarTrigger size="lg" />
                    {isSidebarLoaded && children}
                </main>
            </SidebarProvider >
        </>
    )
}

function getCookie(name) {
    if (document) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    return null;
}
