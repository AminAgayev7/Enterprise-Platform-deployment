"use client";

type Props = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) {
        return null;
    }
    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition"
            >
                ← Prev
            </button>
            <span className="text-sm text-gray-500">
                {page} / {totalPages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition"
            >
                Next →
            </button>
        </div>
    );
}
