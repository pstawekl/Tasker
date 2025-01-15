'use client';
import { auth } from '@/app/firebaseConfig';
import LoadingSpinner from '@/components/loadingSpinner';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from '@/components/ui/skeleton';
import { TaskLists } from "@/lib/models/taskList";
import { User as DbUser } from '@/lib/models/users';
import DefaultUserAvatar from '@/public/default-user-avatar.jpg';
import Logo from "@/public/logo.webp";
import { faArrowLeft, faGear, faPowerOff, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, User } from 'firebase/auth';
import { ChevronDown, ChevronUp, LogOut, Plus, Settings, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { LayoutManager } from '../../utils/layout-manager';

interface LayoutProps {
    children: ReactNode;
}

const SIDEBAR_COOKIE_NAME = 'sidebar:state';

type IsDuringDeleteListType = {
    isDeleting: boolean;
    id: number | null;
}

export default function Layout({ children }: LayoutProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dbUser, setDbUser] = useState<DbUser | null>(null);
    const [taskList, setTaskList] = useState<TaskLists>([]);
    const [defaultOpen, setDefaultOpen] = useState<boolean>(false);
    const [isAddingNewList, setIsAddingNewList] = useState<boolean>(false);
    const [isSidebarLoaded, setIsSidebarLoaded] = useState(false);
    const [newListName, setNewListName] = useState<string>('');
    const [isMounted, setIsMounted] = useState(false);
    const [isDuringAddList, setIsDuringAddList] = useState(false);
    const [isDuringDeleteList, setIsDuringDeleteList] = useState<IsDuringDeleteListType>({ isDeleting: false, id: null });
    const [isDuringTaskListLoading, setIsDuringTaskListLoading] = useState(true);
    const [isShowButtonBack, setIsShowButtonBack] = useState(false);
    const [mobileNewListName, setMobileNewListName] = useState('');
    const navigate = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
                setLoading(false);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleLocationChange = () => {
            const currentPath = window.location.pathname;
            setIsShowButtonBack(currentPath.split('/dashboard')[1].length > 3);
        };

        // Initial check
        handleLocationChange();

        // Watch for URL changes
        const observer = new MutationObserver(() => {
            handleLocationChange();
        });

        observer.observe(document.querySelector('body'), {
            childList: true,
            subtree: true
        });

        // Also listen for popstate events (browser back/forward)
        window.addEventListener('popstate', handleLocationChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, []);

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
    }, []);

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
                    setDbUser(data.users[0]);
                } else {
                    console.error('Failed to fetch user');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

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
                    'Authorization': `Bearer ${await user.getIdToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: dbUser.id }),
            });
            if (response.ok) {
                const data = await response.json();
                setTaskList(data.taskLists);
                setIsDuringDeleteList({ isDeleting: false, id: null });
            } else {
                console.error('Failed to fetch task list');
                setIsDuringDeleteList({ isDeleting: false, id: null });
            }
        } catch (error) {
            setIsDuringDeleteList({ isDeleting: false, id: null });
            console.error('Error fetching task list:', error);
        }
        setIsDuringTaskListLoading(false);
    };

    useEffect(() => {
        if (dbUser) {
            fetchItems();
        }
    }, [dbUser]);

    async function addNewList() {
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
                setIsAddingNewList(false);
                fetchItems();
                setNewListName('');
                setIsDuringAddList(false);
            } else {
                console.error('Failed to add new task list');
            }
        }
    }

    async function removeList(id: number) {
        setIsDuringDeleteList({ isDeleting: true, id: id });
        const response = await fetch('/api/postgres/remove-task-list', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        });

        if (response.ok) {
            fetchItems();
        } else {
            console.error('Failed to remove task list');
            setIsDuringDeleteList({ isDeleting: false, id: null });
        }
    }

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
            window.location.pathname = '/';
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    if (!isMounted) {
        return <div></div>;
    }

    if (!user || loading) {
        return <div className="w-full h-full flex items-center justify-center"><LoadingSpinner /></div>;
    }

    function handleRemoveTasksList(id: number) {
        removeList(id)

        if (window.location.pathname == `/dashboard/task-lists/${id}`) {
            navigate.push('/dashboard')
        }
    }

    if (!LayoutManager.getIsMobile()) {
        return (
            <div>
                <SidebarProvider className='flex flex-row justify-between' defaultOpen={Boolean(defaultOpen)}>
                    <Sidebar className="max-h-[100vh] w-[20%]" onLoad={() => setIsSidebarLoaded(true)}>
                        <SidebarContent className="flex flex-col h-full">
                            <SidebarGroup className="flex flex-col flex-1">
                                <SidebarGroupLabel className="whitespace-pre text-2xl select-none"><Image src={Logo} alt="Logo" width={30} /> Tasker</SidebarGroupLabel>
                                <SidebarGroupContent className="mt-5 flex flex-col flex-1">
                                    <SidebarMenu className="h-full text-lg">
                                        <SidebarMenuItem className="h-auto" key={0}>
                                            <SidebarMenuButton asChild>
                                                <Link className="hover:no-underline text-lg text-gray-500" href="/dashboard">
                                                    Dashboard
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <Collapsible defaultOpen className="group/collapsible w-full flex-1 flex flex-col">
                                            <SidebarGroup className='group w-full flex-1 flex flex-col rounded'>
                                                <SidebarGroupLabel className="text-md" asChild>
                                                    <CollapsibleTrigger>
                                                        Listy zadań
                                                        <ChevronDown size={'2rem'} className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                                    </CollapsibleTrigger>
                                                </SidebarGroupLabel>
                                                <CollapsibleContent className={`${isDuringTaskListLoading ? 'h-full' : 'h-auto'}`}>
                                                    <SidebarGroupContent className='h-full'>
                                                        <SidebarMenu className={'relative h-full flex flex-col' + `${isDuringTaskListLoading || loading ? ' overflow-hidden' : ' overflow-auto'}`}>
                                                            {
                                                                isDuringTaskListLoading && <LoadingSpinner className="flex-1 flex items-center justify-center w-full bg-gray-100" />
                                                            }
                                                            {taskList.map((item) => (
                                                                isDuringDeleteList.isDeleting && isDuringDeleteList.id === item.id ?
                                                                    <Skeleton key={item.id} className='w-full h-[32px]' />
                                                                    :
                                                                    <SidebarMenuItem className="group-hover:bg-gray-0 d-flex flex-row" key={item.id}>
                                                                        <SidebarMenuButton className="d-flex flex-row w-100" asChild>
                                                                            <Link className="text-black hover:no-underline text-md overflow-hidden text-ellipsis ... whitespace-nowrap" href={`/dashboard/task-lists/${item.id}`}>
                                                                                {item.name}
                                                                            </Link>
                                                                        </SidebarMenuButton>
                                                                        <SidebarMenuButton onClick={() => handleRemoveTasksList(item.id)} className="w-min px-2">
                                                                            <FontAwesomeIcon icon={faTrash} />
                                                                        </SidebarMenuButton>
                                                                    </SidebarMenuItem>
                                                            ))}
                                                            {
                                                                isDuringAddList && <Skeleton className='w-full h-[32px]' />
                                                            }
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
                                                <Link className="text-black hover:no-underline d-flex justify-center" href="#">
                                                    {
                                                        isAddingNewList ?
                                                            <Input
                                                                id="add-new-list"
                                                                type="text"
                                                                className="m-0 p-1 border-none after:border-none focus:border-none focus:bg-transparent bg-transparent w-full h-min"
                                                                autoFocus
                                                                value={newListName}
                                                                onChange={(e) => setNewListName(e.target.value)}
                                                                disabled={isDuringAddList}
                                                            />
                                                            :
                                                            <SidebarGroupLabel onClick={handleAddingNewList} className="m-0 p-0 w-100 text-center d-flex flex-row gap-2 text-md">
                                                                Dodaj listę
                                                                <Plus className="ml-auto" onClick={handlePlusClick} />
                                                            </SidebarGroupLabel>
                                                    }
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <SidebarMenuButton className="flex flex-row w-full">
                                                        <Image src={user?.photoURL ?? DefaultUserAvatar} alt="User avatar" width={30} height={30} className="max-w-[30px] max-h-[30px] rounded-full flex-auto" />
                                                        <SidebarGroupLabel className="w-auto overflow-hidden text-ellipsis text-md">{user && user.displayName ? user.displayName : user.email}</SidebarGroupLabel>
                                                        <ChevronUp className="ml-auto flex-auto" />
                                                    </SidebarMenuButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    side="top"
                                                    className="w-[--radix-popper-anchor-width]"
                                                >
                                                    <DropdownMenuItem>
                                                        <Link className="w-100 text-lg text-black hover:no-underline d-flex flex-row gap-2 items-center" href="/dashboard/profile">
                                                            <SidebarGroupLabel className="gap-2 text-lg"><FontAwesomeIcon icon={faUser} /> Profil</SidebarGroupLabel>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link className="w-100 text-lg text-black hover:no-underline d-flex flex-row gap-2 items-center" href="#">
                                                            <SidebarGroupLabel className="gap-2 text-lg"><FontAwesomeIcon icon={faGear} /> Ustawienia</SidebarGroupLabel>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link onClick={handleLogout} className="w-100 text-lg text-black hover:no-underline d-flex flex-row gap-2 items-center" href="#">
                                                            <SidebarGroupLabel className="gap-2 text-lg"><FontAwesomeIcon icon={faPowerOff} />Wyloguj się</SidebarGroupLabel>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarFooter>
                    </Sidebar>
                    <main className="w-[80%] h-full max-h-100">
                        <SidebarTrigger size="lg" />
                        {children}
                    </main>
                </SidebarProvider>
            </div>
        )
    } else {
        return (
            <div className="w-screen h-screen flex flex-col overflow-hidden bg-gray-100">
                <div className='w-full overflow-hidden flex flex-row justify-between items-center gap-2 p-2 bg-white text-xl'>
                    {isShowButtonBack &&
                        <Button className='px-2' variant='ghost' onClick={() => navigate.back()}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>}
                    <div className={'flex flex-row justify-start items-center text-gray-600 gap-2' + `${isShowButtonBack ? ' self-center' : ''}`}>
                        <Image src={Logo} alt="Logo" width={30} />{process.env.NEXT_PUBLIC_APP_NAME}
                    </div>
                    <div className="justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className='flex flex-row items-center px-1'>
                                    <Image className='w-[40px] h-[40px] rounded-full' src={user.photoURL ?? DefaultUserAvatar} alt={'User Avatar'} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => window.location.pathname = '/dashboard/profile'}>
                                        <UserIcon />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.location.pathname = '/dashboard/settings'}>
                                        <Settings />
                                        <span>Ustawienia</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut />
                                        <span>Wyloguj</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <main className='w-full h-full overflow-hidden pb-16'>
                    {children}
                </main>
            </div>
        )
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
