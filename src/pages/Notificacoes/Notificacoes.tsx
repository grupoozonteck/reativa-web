import { useState } from 'react';
import { Bell, ShoppingCart, UserCheck, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const typeConfig = {
    venda: {
        label: 'Venda',
        icon: ShoppingCart,
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        dot: 'bg-blue-400',
        glow: 'shadow-blue-500/10',
    },
    reativacao: {
        label: 'Reativação',
        icon: UserCheck,
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-400',
        glow: 'shadow-emerald-500/10',
    },
    primeiro_pedido: {
        label: '1ª Compra',
        icon: Star,
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        dot: 'bg-blue-400',
        glow: 'shadow-blue-500/10',
    },
};



export default function Notificacoes() {
    return ( 
        <h1 className="text-2xl font-bold">Em breve...</h1>
     );
}
