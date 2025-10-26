import React from 'react';
import { Card } from '../components/Card';

export const ConfiguracoesPage: React.FC = () => (
    <Card>
        <h1 className="text-2xl font-bold text-white">Configurações Globais</h1>
        <p className="mt-4 text-slate-400">
            Esta é a área de configurações globais do sistema, acessível apenas pelo perfil MAESTRO.
            Aqui é possível gerenciar TAGS, configurar workflows, definir alçadas de aprovação e controlar
            todos os parâmetros estratégicos da plataforma.
        </p>
    </Card>
);