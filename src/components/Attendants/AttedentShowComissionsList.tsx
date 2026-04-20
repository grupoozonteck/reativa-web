import type { ICommissions } from "@/services/team.service";

export function AttedentShowComissionsList (commisions:ICommissions[]) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Comissões</h2>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">id</th>
                        <th className="px-4 py-2">valor</th>
                        <th className="px-4 py-2">data</th>
                    </tr>
                </thead>
                <tbody>
                    {commisions.map((commission) => (
                        <tr key={commission.id}>
                            <td className="border px-4 py-2">{commission.id}</td>
                            <td className="border px-4 py-2">{commission.value}</td>
                            <td className="border px-4 py-2">{commission.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}