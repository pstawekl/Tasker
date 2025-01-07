'use client';

import { auth } from '@/app/firebaseConfig';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

export default function UncompletedTasksChartByDay() {
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
    const taskCountByDate = tasks.reduce((acc, task) => {
        const date = new Date(task.due_date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(taskCountByDate).map(([date, count]) => ({
        date,
        count,
    }));

    return (
        <ChartContainer config={{
            desktop: {
                label: "Desktop",
                color: "#2563eb",
            },
            mobile: {
                label: "Mobile",
                color: "#60a5fa",
            },
        }}>
            {loading ? (
                <Spinner />
            ) : (
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" label={{ value: 'Niewykonane zadania wg dnia', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Liczba zadań', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<ChartTooltipContent labelKey="date" formatter={(value, name, props) => (
                        <div>
                            <div>Dzień: {props.payload.date}</div>
                            <div>Liczba niewykonanych zadań: {value}</div>
                        </div>
                    )} />} />
                    <Legend content={<ChartLegendContent nameKey={'date'} />} />
                    <Bar dataKey="count" fill="#8884d8" animationDuration={1500} />
                </BarChart>
            )}
        </ChartContainer>
    );
};
