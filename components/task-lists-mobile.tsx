import { auth } from '@/app/firebaseConfig';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Card, CardHeader, CardTitle } from './ui/card';

interface TaskListMobileProps {
    name: string;
    id: number;
    fetchItems: () => void;
}

const TaskListsMobile: React.FC<TaskListMobileProps> = ({ name, id, fetchItems }) => {
    const [offset, setOffset] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [bgColor, setBgColor] = useState('rgb(255, 255, 255)');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Calculate maximum swipe distance (75% of screen width)
    const maxSwipe = typeof window !== 'undefined' ? -window.innerWidth * 0.75 : -300;
    const colorThreshold = maxSwipe / 3; // Start color change at 1/3 of max swipe

    async function removeList(id: number) {
        setIsDeleting(true);
        const response = await fetch('/api/postgres/remove-task-list', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        });

        if (response.ok) {
            setIsDeleted(true);
            fetchItems();
        } else {
            console.error('Failed to remove task list');
            setIsDeleting(false);
        }
    }

    const handlers = useSwipeable({
        onSwiping: (e) => {
            if (isDeleting) return;
            if (e.deltaX < 0) {
                const newOffset = Math.max(maxSwipe, e.deltaX);
                setOffset(newOffset);

                // Calculate opacity
                const progress = Math.abs(newOffset / maxSwipe);
                setOpacity(1 - (progress * 0.7));

                // Only start color transition after threshold
                if (newOffset < colorThreshold) {
                    // Recalculate progress based on remaining distance
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
            if (isDeleting) return;
            // Snap back if not swiped far enough
            if (offset > maxSwipe / 1.25) {
                setOffset(0);
                setOpacity(1);
                setBgColor('rgb(255, 255, 255)');
            } else {
                // Delete the task list
                setIsDeleting(true);
                try {
                    await removeList(id);
                } catch (error) {
                    // Reset states if deletion fails
                    setOffset(0);
                    setOpacity(1);
                    setBgColor('rgb(255, 255, 255)');
                }
                setIsDeleting(false);
            }
        }
    });

    return (
        <div className="w-full px-2 py-1 relative">
            {/* Swipeable container */}
            <div
                {...handlers}
                style={{
                    transform: isDeleting ? 'translateX(-120%)' : `translateX(${offset}px)`,
                    opacity: opacity,
                    transition: offset === 0 && !isDeleting ? 'all 0.2s ease-out' : 'all 0.3s ease-out'
                }}
            >
                <Card
                    className={"w-full bg-gray-0 active:bg-gray-300 transition-colors duration-200" + ` ${isDeleted ? ' opacity-0' : ''}`}
                    style={{ backgroundColor: bgColor }}
                    onClick={() => navigate.push(`/dashboard/task-lists/${id}`)}
                >
                    <CardHeader className="flex flex-row justify-between px-6 py-3">
                        <CardTitle className='text-gray-700'>{name}</CardTitle>
                        <FontAwesomeIcon className='text-white' icon={faTrash} />
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

export default TaskListsMobile;