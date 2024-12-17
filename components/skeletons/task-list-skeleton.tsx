import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function TaskListSkeleton() {
    return (
        <div className="w-full space-y-4 px-5">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex space-x-2">
                        <Skeleton className="h-[150px] flex-1" />
                    </div>
                ))}
        </div>
    );
}