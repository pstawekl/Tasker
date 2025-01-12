import { Spinner } from '@/components/ui/spinner';

type LoadingSpinnerProps = {
    className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
    return (
        <div className={"absolute inset-0 flex justify-center items-center bg-white/80 backdrop-blur-xs z-50 " + className}>
            <Spinner className="text-gray-800 w-8 h-8" />
        </div>
    );
};
