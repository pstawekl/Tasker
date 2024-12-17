'use client';

import { useEffect, useState } from 'react';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Spinner } from 'reactstrap';

export default function UncompletedTasksChartByDay() {
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

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
