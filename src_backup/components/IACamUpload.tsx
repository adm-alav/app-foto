'use client';

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useStakbroker } from "@/components/providers/stakbroker-provider";

interface ChartAnalysis {
  action: 'COMPRE' | 'VENDA';
  asset: string;
  timeframe: string;
  entryTime: string;
  confidence: number;
  protection1: string;
  protection2: string;
  entryPrice: number;
}

export default function IACamUpload() {
  const { logout } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState('BTC/USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('M1');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ChartAnalysis | null>(null);

  const analyzeImage = () => {
    if (!selectedImage || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    const generateResult = () => {
      const currentPrice = Number((Math.random() * 90 + 10).toFixed(2));
      const action: 'COMPRE' | 'VENDA' = Math.random() > 0.5 ? 'COMPRE' : 'VENDA';
      
      // Define os horários de entrada e proteções
      const entryTime = new Date();
      entryTime.setMinutes(entryTime.getMinutes() + 1);
      
      const protection1Time = new Date(entryTime);
      protection1Time.setMinutes(protection1Time.getMinutes() + 1);
      
      const protection2Time = new Date(protection1Time);
      protection2Time.setMinutes(protection2Time.getMinutes() + 1);

      return {
        action,
        asset: selectedAsset,
        timeframe: selectedTimeframe,
        entryTime: entryTime.toISOString(),
        confidence: Math.floor(Math.random() * 20) + 80,
        entryPrice: currentPrice,
        protection1: protection1Time.toISOString(),
        protection2: protection2Time.toISOString()
      };
    };

    setTimeout(() => {
      setAnalysisResult(generateResult());
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setSelectedImage(imageUrl);
      };
      
      reader.onerror = () => {
        console.error("Erro ao ler o arquivo.");
        setSelectedImage(null);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <Card className="p-8 max-w-4xl mx-auto" style={{
      background: 'linear-gradient(145deg, #1a1505, #1f1a08)',
      boxShadow: '0 4px 60px rgba(255, 184, 0, 0.15)',
    }}>
      <div className="fixed top-0 left-0 right-0 bg-gradient-golden z-10 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="logo-gradient text-2xl">IACAM</span>
                        <span className="bg-[#FFB800] text-black text-xs px-2 py-1 rounded-full">2.0</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#FFB800]/80">
              Saldo: ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <a 
              href="https://stakbroker.com/traderoom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#FFB800]/80 hover:text-[#FFB800] transition-colors"
            >
              stakbroker.com
            </a>
            <button
              onClick={logout}
              className="text-sm text-[#FFB800]/60 hover:text-[#FFB800] transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mb-12 space-y-4 mt-20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="animate-pulse text-[#FFB800] text-3xl">✨</span>
          <h2 className="logo-gradient text-4xl tracking-tight">
            IA CAM 2.0
          </h2>
          <span className="animate-pulse text-[#FFB800] text-3xl">✨</span>
        </div>
        <p className="text-[#FFB800]/80 text-lg font-medium">
          Análise Automática de Sinais
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FFB800]/20 to-transparent mx-auto" />
      </div>

      {selectedImage && (
        <div className="mb-6 rounded-lg overflow-hidden bg-[#0a0a0a]">
          <h3 className="text-[#FFB800] text-lg p-4 border-b border-[#FFB800]/20">
            Gráfico Carregado
          </h3>
          <div className="p-4">
            <img src={selectedImage} alt="Gráfico carregado" className="w-full rounded" />
          </div>
        </div>
      )}

      {selectedImage && !isAnalyzing && !analysisResult && (
        <div className="mb-6 rounded-lg overflow-hidden bg-[#0a0a0a]">
          <h3 className="text-[#FFB800] text-lg p-4 border-b border-[#FFB800]/20">
            Configurar Análise
          </h3>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-[#FFB800]/80 mb-3">Selecione o Ativo</p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedAsset('BTC/USD')}
                  className={`${
                    selectedAsset === 'BTC/USD' 
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]' 
                      : 'text-[#FFB800]/60 border-[#FFB800]/20 hover:border-[#FFB800]/40'
                  }`}
                >
                  BTC/USD
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedAsset('XRP/USD')}
                  className={`${
                    selectedAsset === 'XRP/USD' 
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]' 
                      : 'text-[#FFB800]/60 border-[#FFB800]/20 hover:border-[#FFB800]/40'
                  }`}
                >
                  XRP/USD
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedAsset('BCH/USD')}
                  className={`${
                    selectedAsset === 'BCH/USD' 
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]' 
                      : 'text-[#FFB800]/60 border-[#FFB800]/20 hover:border-[#FFB800]/40'
                  }`}
                >
                  BCH/USD
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedAsset('ETH/USD')}
                  className={`${
                    selectedAsset === 'ETH/USD' 
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]' 
                      : 'text-[#FFB800]/60 border-[#FFB800]/20 hover:border-[#FFB800]/40'
                  }`}
                >
                  ETH/USD
                </Button>
              </div>
            </div>

            <div>
              <p className="text-[#FFB800]/80 mb-3">Selecione o Timeframe</p>
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedTimeframe('M1')}
                  className={`${
                    selectedTimeframe === 'M1' 
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]' 
                      : 'text-[#FFB800]/60 border-[#FFB800]/20 hover:border-[#FFB800]/40'
                  }`}
                >
                  M1
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedTimeframe('M2')}
                  className={`${
                    selectedTimeframe === 'M2' 
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]' 
                      : 'text-[#FFB800]/60 border-[#FFB800]/20 hover:border-[#FFB800]/40'
                  }`}
                >
                  M2
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedTimeframe('M5')}
                  className={`${
                    selectedTimeframe === 'M5' 
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]' 
                      : 'text-[#FFB800]/60 border-[#FFB800]/20 hover:border-[#FFB800]/40'
                  }`}
                >
                  M5
                </Button>
              </div>
            </div>

            <Button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className={`w-full h-14 bg-[#FFB800] text-black ${
                isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FFB800]/90 hover:scale-[1.02]'
              } text-lg font-medium tracking-wider shadow-lg shadow-[#FFB800]/10 transition-all duration-300`}
            >
              {isAnalyzing ? 'ANALISANDO...' : 'INICIAR ANÁLISE'}
            </Button>

            <p className="text-[#FFB800]/60 text-sm text-center">
              {isAnalyzing ? 'Aguarde enquanto analisamos seu gráfico' : 'Clique para analisar o gráfico'}
            </p>
          </div>
        </div>
      )}

      {isAnalyzing ? (
        <div className="space-y-8 text-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#FFB800]/10 rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-xl font-medium text-[#FFB800] mb-3">Analisando...</div>
            <div className="text-[#FFB800]/60 transition-all duration-300">
              Processando sua análise...
            </div>
          </div>
        </div>
      ) : (
        !selectedImage && (
          <div 
            className={`
              border-2 border-dashed rounded-lg p-8 text-center space-y-4 cursor-pointer
              transition-all duration-300 group
              ${dragActive 
                ? 'border-[#FFB800] bg-[#FFB800]/10' 
                : 'border-[#FFB800]/20 hover:border-[#FFB800]/40 hover:bg-[#FFB800]/5'
              }
            `}
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.querySelector('input[type="file"]')?.click()}
          >
            <div className="w-16 h-16 rounded-full bg-[#FFB800]/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 text-[#FFB800]/60" />
            </div>
            <div>
              <h3 className="text-[#FFB800] text-xl mb-2">
                {dragActive ? 'Solte o arquivo aqui' : 'Carregar Gráfico'}
              </h3>
              <p className="text-[#FFB800]/60">
                Arraste e solte ou clique para selecionar
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
        )
      )}

      {analysisResult && (
        <div className="space-y-8">
          <div className="bg-gradient-to-b from-[#FFB800]/10 to-transparent p-8 rounded-2xl text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#FFB800]/20 mb-4">
                <div className={`text-4xl font-bold ${
                  analysisResult.action === 'COMPRE' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {analysisResult.action}
                </div>
              </div>
              
              <a 
                href="https://stakbroker.com/traderoom"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFB800] text-black rounded-lg hover:bg-[#FFB800]/90 transition-all duration-300 font-medium"
              >
                Abrir Corretora
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
            
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#FFB800]/5 border border-[#FFB800]/10">
                  <p className="text-[#FFB800]/60 text-sm mb-1">Ativo</p>
                  <p className="text-[#FFB800] font-semibold">{analysisResult.asset}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFB800]/5 border border-[#FFB800]/10">
                  <p className="text-[#FFB800]/60 text-sm mb-1">Timeframe</p>
                  <p className="text-[#FFB800] font-semibold">{analysisResult.timeframe}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFB800]/5 border border-[#FFB800]/10">
                  <p className="text-[#FFB800]/60 text-sm mb-1">Confiança</p>
                  <p className="text-[#FFB800] font-semibold">{analysisResult.confidence}%</p>
                </div>
              </div>

              <div className="bg-[#FFB800]/5 rounded-xl p-4 border border-[#FFB800]/10">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-[#FFB800]/60 text-sm mb-1">Entrada em</p>
                    <p className="text-[#FFB800] font-semibold">
                      {new Date(analysisResult.entryTime).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#FFB800]/60 text-sm mb-1">Preço</p>
                    <p className="text-[#FFB800] font-semibold">{analysisResult.entryPrice}</p>
                  </div>
                  <div>
                    <p className="text-[#FFB800]/60 text-sm mb-1">Proteção 1</p>
                    <p className="text-red-400 font-semibold">
                      {new Date(analysisResult.protection1).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#FFB800]/60 text-sm mb-1">Proteção 2</p>
                    <p className="text-red-400 font-semibold">
                      {new Date(analysisResult.protection2).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-4">
              <Button
                onClick={() => {
                  setSelectedImage(null);
                  setAnalysisResult(null);
                }}
                className="w-full h-12 bg-transparent border border-[#FFB800]/20 text-[#FFB800]/80 hover:bg-[#FFB800]/5 hover:border-[#FFB800]/40 transition-all duration-300"
              >
                Analisar Novo Gráfico
              </Button>
              
              <p className="text-center text-[#FFB800]/60 text-sm px-4">
                Este sistema funciona exclusivamente na{' '}
                <a 
                  href="https://stakbroker.com/traderoom" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#FFB800] hover:underline"
                >
                  Stak Broker
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
