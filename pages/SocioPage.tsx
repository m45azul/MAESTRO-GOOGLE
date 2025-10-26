import React from 'react';
import { Card } from '../components/Card';

export const SocioPage: React.FC = () => (
    <Card>
        <h1 className="text-2xl font-bold text-white">Módulo Societário</h1>
        <p className="mt-4 text-slate-400">
            Esta área é designada para a gestão societária. Sócios podem visualizar o superávit/déficit, solicitar retiradas,
            efetuar aportes e acompanhar os resultados consolidados do escritório e suas projeções individuais.
        </p>
    </Card>
);