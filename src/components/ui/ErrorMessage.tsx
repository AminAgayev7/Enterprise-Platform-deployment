type Props = {
    message?: string;
    onRetry?: () => void;
};

export default function ErrorMessage({ message = "Error occured.", onRetry }: Props) {
    return (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-red-500">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Try again
                </button>
            )}
        </div>
    );
}