import React from 'react';
import { Card } from '../components/Card';

export const EquipePage: React.FC = () => (
    <Card>
        <h1 className="text-2xl font-bold text-white">Módulo de Equipe</h1>
        <p className="mt-4 text-slate-400">
            Este módulo permite a gestão completa da equipe, incluindo advogados internos, parceiros e indicadores.
            O MAESTRO e o Controller podem visualizar a performance, gerenciar atribuições e configurar perfis.
        </p>
    </Card>
);