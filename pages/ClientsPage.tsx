import React from 'react';
import { Card } from '../components/Card';
import { Client } from '../types';

interface ClientsPageProps {
    clients: Client[];
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ clients }) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">Clientes</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Data de Conversão</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-6 py-4 font-medium text-slate-200">{client.name}</td>
                <td className="px-6 py-4">{client.email}</td>
                <td className="px-6 py-4">{new Date(client.conversionDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
              </tr>
            ))}
             {clients.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center py-8 text-slate-500">Nenhum cliente convertido ainda.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};