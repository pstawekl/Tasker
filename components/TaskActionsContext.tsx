'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from 'next/navigation';

export interface ContextMenuButtonProps {
    title: string;
    id: number;
    deleteFunction?: () => void;
    editFunction?: () => void;
    completeFunction?: () => void;
}

export function TaskActionsContext(props: ContextMenuButtonProps) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button id="Actions" variant='outline' title={props.title}>
                    <FontAwesomeIcon icon={faEllipsis} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => console.log('Edit Task')}>Edytuj</DropdownMenuItem>
                <DropdownMenuItem onSelect={props.deleteFunction}>Usuń</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => console.log('Complete Task')}>Zakończ</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}