'use client';

import { auth } from '@/app/firebaseConfig';
import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';

export default function UncompletedTasksChart() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth && auth.currentUser) {
            setUser(auth.currentUser);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchUncompletedTasks = async () => {
            try {
                const response = await fetch('/api/postgres/get-uncompleted-tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ auth0_id: user.sub }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setTasks(data.tasks);
                    setLoading(false);
                } else {
                    console.error('Failed to fetch uncompleted tasks');
                }
            } catch (error) {
                console.error('Error fetching uncompleted tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUncompletedTasks();
        }
    }, [user]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className='d-flex flex-column items-center justify-center gap-3'>
            <h1 className='text-8xl m-0'>
                {tasks.length}
            </h1>
            <p className='text-lg m-0'>
                {
                    tasks.length === 1
                        ? 'niewykonane zadanie'
                        : tasks.length < 5
                            ? 'niewykonane zadania'
                            : 'niewykonanych zadań'
                }
            </p>
        </div>
    )
}
