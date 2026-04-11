type Props = {
    title: string;
    value: string | number;
    sub?: string;
};

export default function StatCard({ title, value, sub }: Props) {
    return (
        <div className="border rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
    );
}