'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SignalConfigProps {
  onGenerateSignal: (config: SignalConfig) => void;
}

export interface SignalConfig {
  timeframe: string;
  assets: number;
  direction: 'PUT' | 'CALL' | 'BOTH';
  percentage: number;
  days: number;
  martingale: number;
  startTime: string;
  endTime: string;
  otcList: boolean;
  removeEquals: boolean;
  ignoreToday: boolean;
  nextDay: boolean;
}

export default function SignalConfig({ onGenerateSignal }: SignalConfigProps) {
  const [config, setConfig] = useState<SignalConfig>({
    timeframe: 'M1',
    assets: 2,
    direction: 'BOTH',
    percentage: 85,
    days: 10,
    martingale: 2,
    startTime: '14:40',
    endTime: '15:00',
    otcList: true,
    removeEquals: true,
    ignoreToday: false,
    nextDay: false
  });

  const handleSubmit = () => {
    onGenerateSignal(config);
  };

  return (
    <Card className="p-6 space-y-6 bg-[#1a1505]">
      {/* Timeframe */}
      <div>
        <h3 className="text-[#FFB800] mb-3">Timeframe</h3>
        <div className="grid grid-cols-6 gap-2">
          {['M1', 'M2', 'M1+', 'M5', 'M15', 'M30'].map((tf) => (
            <Button
              key={tf}
              onClick={() => setConfig({ ...config, timeframe: tf })}
              className={`${
                config.timeframe === tf
                  ? 'bg-[#00C288] text-black'
                  : 'bg-[#1E1E1E] text-[#FFB800]/60 hover:bg-[#1E1E1E]/80'
              }`}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Ativos e Direção */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-[#FFB800] mb-3">Selecionar ativos</h3>
          <Button
            className="w-full bg-[#1E1E1E] text-[#FFB800] hover:bg-[#1E1E1E]/80"
          >
            <span className="mr-2">🎯</span>
            {config.assets} Ativos
          </Button>
        </div>
        <div>
          <h3 className="text-[#FFB800] mb-3">Direção</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => setConfig({ ...config, direction: 'PUT' })}
              className={`${
                config.direction === 'PUT'
                  ? 'bg-[#FF5555] text-black'
                  : 'bg-[#1E1E1E] text-[#FFB800]/60 hover:bg-[#1E1E1E]/80'
              }`}
            >
              PUT
            </Button>
            <Button
              onClick={() => setConfig({ ...config, direction: 'CALL' })}
              className={`${
                config.direction === 'CALL'
                  ? 'bg-[#00C288] text-black'
                  : 'bg-[#1E1E1E] text-[#FFB800]/60 hover:bg-[#1E1E1E]/80'
              }`}
            >
              CALL
            </Button>
            <Button
              onClick={() => setConfig({ ...config, direction: 'BOTH' })}
              className={`${
                config.direction === 'BOTH'
                  ? 'bg-[#00C288] text-black'
                  : 'bg-[#1E1E1E] text-[#FFB800]/60 hover:bg-[#1E1E1E]/80'
              }`}
            >
              CALL/PUT
            </Button>
          </div>
        </div>
      </div>

      {/* Porcentagem, Dias e Martingale */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h3 className="text-[#FFB800] mb-3">Porcentagem</h3>
          <select
            value={config.percentage}
            onChange={(e) => setConfig({ ...config, percentage: Number(e.target.value) })}
            className="w-full bg-[#1E1E1E] text-[#FFB800] border border-[#FFB800]/20 rounded-lg p-2"
          >
            {[75, 80, 85, 90, 95].map((p) => (
              <option key={p} value={p}>{p}%</option>
            ))}
          </select>
        </div>
        <div>
          <h3 className="text-[#FFB800] mb-3">Dias</h3>
          <select
            value={config.days}
            onChange={(e) => setConfig({ ...config, days: Number(e.target.value) })}
            className="w-full bg-[#1E1E1E] text-[#FFB800] border border-[#FFB800]/20 rounded-lg p-2"
          >
            {[5, 10, 15, 20, 30].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <h3 className="text-[#FFB800] mb-3">Martingale</h3>
          <select
            value={config.martingale}
            onChange={(e) => setConfig({ ...config, martingale: Number(e.target.value) })}
            className="w-full bg-[#1E1E1E] text-[#FFB800] border border-[#FFB800]/20 rounded-lg p-2"
          >
            {[0, 1, 2, 3, 4].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Intervalo */}
      <div>
        <h3 className="text-[#FFB800] mb-3">Intervalo</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            value={config.startTime}
            onChange={(e) => setConfig({ ...config, startTime: e.target.value })}
            className="bg-[#1E1E1E] text-[#FFB800] border border-[#FFB800]/20 rounded-lg p-2"
          />
          <input
            type="time"
            value={config.endTime}
            onChange={(e) => setConfig({ ...config, endTime: e.target.value })}
            className="bg-[#1E1E1E] text-[#FFB800] border border-[#FFB800]/20 rounded-lg p-2"
          />
        </div>
      </div>

      {/* Filtros Adicionais */}
      <div>
        <h3 className="text-[#FFB800] mb-3">Filtros Adicionais</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#FFB800]/60">
              <input
                type="checkbox"
                checked={config.otcList}
                onChange={(e) => setConfig({ ...config, otcList: e.target.checked })}
                className="rounded border-[#FFB800]/20"
              />
              Lista OTC
            </label>
            <label className="flex items-center gap-2 text-[#FFB800]/60">
              <input
                type="checkbox"
                checked={config.ignoreToday}
                onChange={(e) => setConfig({ ...config, ignoreToday: e.target.checked })}
                className="rounded border-[#FFB800]/20"
              />
              Ignorar dia Atual
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#FFB800]/60">
              <input
                type="checkbox"
                checked={config.removeEquals}
                onChange={(e) => setConfig({ ...config, removeEquals: e.target.checked })}
                className="rounded border-[#FFB800]/20"
              />
              Remover horários iguais
            </label>
            <label className="flex items-center gap-2 text-[#FFB800]/60">
              <input
                type="checkbox"
                checked={config.nextDay}
                onChange={(e) => setConfig({ ...config, nextDay: e.target.checked })}
                className="rounded border-[#FFB800]/20"
              />
              Próximo dia
            </label>
          </div>
        </div>
      </div>

      {/* Botão Gerar */}
      <Button
        onClick={handleSubmit}
        className="w-full bg-[#00C288] hover:bg-[#00C288]/90 text-black font-medium py-3"
      >
        Gerar Sinais
      </Button>
    </Card>
  );
}
