import type { ICommissions } from '@/services/team.service';

export function AttendantShowCommissionsList(commissions: ICommissions[]) {
    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Comissoes</h2>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">id</th>
                        <th className="px-4 py-2">valor</th>
                        <th className="px-4 py-2">data</th>
                    </tr>
                </thead>
                <tbody>
                    {commissions.map((commission) => (
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
