const AVATAR_COLORS = [
    'bg-blue-600',
    'bg-violet-600',
    'bg-amber-600',
    'bg-emerald-600',
    'bg-rose-600',
    'bg-blue-600',
];

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(p => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function getAvatarColor(name: string): string {
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function formatWhatsApp(phone: string | null | undefined): string {
    if (!phone) return '--';
    const digits = phone.replace(/\D/g, '');
    const national = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
    if (national.length === 11)
        return `(${national.slice(0, 2)}) ${national.slice(2, 7)}-${national.slice(7)}`;
    if (national.length === 10)
        return `(${national.slice(0, 2)}) ${national.slice(2, 6)}-${national.slice(6)}`;
    return phone;
}

export function getWhatsAppLink(phone: string | null | undefined): string {
    if (!phone) return '#';
    const digits = phone.replace(/\D/g, '');
    return digits.startsWith('55') ? `https://wa.me/${digits}` : `https://wa.me/55${digits}`;
}

export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        
    });
}

export function formatDateTime(dateStr: string | null | undefined): string {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatCurrency(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
        return 'R$ 0,00';
    }
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) {
        return 'R$ 0,00';
    }
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
