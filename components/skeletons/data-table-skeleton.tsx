import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DataTableSkeleton = () => {
    return (
        <div className="w-full space-y-4 px-5">
            <Skeleton className="h-[50px] w-full" />
            <div className="space-y-2">
                {[...Array(14)].map((_, index) => (
                    <div key={index} className="flex space-x-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataTableSkeleton;
