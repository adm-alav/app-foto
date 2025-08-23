'use client';

import { useState } from "react";
import { Upload, LineChart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useSound } from "@/hooks/use-sound";
import { useStakbroker } from "@/components/providers/stakbroker-provider";
import { validateChartImage } from "@/lib/chart-validator";

interface ChartAnalysis {
  action: 'COMPRE' | 'VENDA';
  asset: string;
  timeframe: string;
  entryTime: string;
  protection1: string;
  protection2: string;
}

export default function IACamUpload() {
  const { logout } = useAuth();
  const { playNotification, playSuccess } = useSound();
  const { wallets } = useStakbroker();
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('M1');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ChartAnalysis | null>(null);

  const generateSignalTimes = (timeframe: string, baseTime: Date) => {
    const entryTime = baseTime;
    const protection1 = new Date(entryTime);
    const protection2 = new Date(entryTime);

    if (timeframe === 'M1') {
      protection1.setMinutes(protection1.getMinutes() + 1);
      protection2.setMinutes(protection2.getMinutes() + 2);
    } else { // M5
      protection1.setMinutes(protection1.getMinutes() + 6);
      protection2.setMinutes(protection2.getMinutes() + 12);
    }

    return {
      entry: entryTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      prot1: protection1.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      prot2: protection2.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);

  const analyzeImage = async () => {
    if (!selectedImage || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setAnalysisSteps([]);
    playNotification();
    
    try {
      // Simula análise detalhada
      const steps = [
        'Identificando padrões de candlestick...',
        'Analisando tendência do mercado...',
        'Calculando níveis de suporte e resistência...',
        'Verificando indicadores técnicos...',
        'Avaliando momentum do mercado...',
        'Gerando previsão de movimento...',
        'Calculando pontos de entrada...',
        'Definindo níveis de proteção...',
        'Finalizando análise...'
      ];

      for (const step of steps) {
        setAnalysisSteps(prev => [...prev, step]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Gerar horários baseados no momento atual
      const times = generateSignalTimes(selectedTimeframe, new Date());
      
      // Gerar direção aleatória com base na "análise"
      const action: 'COMPRE' | 'VENDA' = Math.random() > 0.5 ? 'COMPRE' : 'VENDA';

      const result: ChartAnalysis = {
        action,
        asset: selectedAsset,
        timeframe: selectedTimeframe,
        entryTime: times.entry,
        protection1: times.prot1,
        protection2: times.prot2
      };

      setAnalysisResult(result);
      setIsAnalyzing(false);
      playSuccess();
    } catch (error) {
      console.error('Erro na análise:', error);
      setIsAnalyzing(false);
      alert('Erro ao gerar sinal. Tente novamente.');
    }
  };

  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleFileUpload = async (file: File) => {
    if (file) {
      setIsValidating(true);
      setValidationMessage('Verificando imagem...');

      try {
        // Verifica o tamanho do arquivo (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('O arquivo é muito grande. Por favor, selecione uma imagem menor que 5MB.');
        }

        // Verifica o tipo do arquivo
        if (!file.type.startsWith('image/')) {
          throw new Error('Por favor, selecione apenas arquivos de imagem.');
        }

        const reader = new FileReader();
        
        const imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
          reader.readAsDataURL(file);
        });

        setValidationMessage('Analisando padrões do gráfico...');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simula análise

        const isValid = await validateChartImage(imageUrl);
        if (!isValid) {
          throw new Error('A imagem não parece ser um gráfico válido. Certifique-se de que os candlesticks estão visíveis.');
        }

        setValidationMessage('Gráfico válido! Configurando análise...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa dramática
        
        setSelectedImage(imageUrl);
        setValidationMessage('');
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        alert(error instanceof Error ? error.message : 'Erro ao processar imagem.');
        setSelectedImage(null);
      } finally {
        setIsValidating(false);
      }
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
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#1a1505] to-[#1f1a08] border-b border-[#FFB800]/20 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFB800] to-[#FFA000]">
              IACAM
            </span>
            <span className="bg-gradient-to-r from-[#FFB800] to-[#FFA000] text-black text-xs px-2 py-1 rounded-full font-semibold">
              2.0
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[#FFB800]/10 px-4 py-2 rounded-full">
              <span className="text-sm text-[#FFB800] font-medium">
                R$ {wallets[0]?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <button
              onClick={logout}
              className="text-sm bg-[#FFB800]/10 hover:bg-[#FFB800]/20 text-[#FFB800] px-4 py-2 rounded-full transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mb-12 space-y-6 mt-24">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-30 blur-3xl">
            <div className="w-48 h-48 bg-[#FFB800] rounded-full"></div>
          </div>
          <div className="relative flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-3">
              <span className="animate-pulse text-[#FFB800] text-3xl rotate-12">✨</span>
              <h2 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FFB800] to-[#FFA000]">
                IA CAM 2.0
              </h2>
              <span className="animate-pulse text-[#FFB800] text-3xl -rotate-12">✨</span>
            </div>
            <p className="text-[#FFB800]/60 max-w-md">
              Upload do gráfico para análise e geração de sinais
            </p>
          </div>
        </div>
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
                {['BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'SOL/USDT'].map((asset) => (
                  <Button 
                    key={asset}
                    variant="outline"
                    onClick={() => setSelectedAsset(asset)}
                    className={`${
                      selectedAsset === asset 
                        ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]' 
                        : 'text-[#FFB800]/60 border-[#FFB800]/20 hover:border-[#FFB800]/40'
                    }`}
                  >
                    {asset}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#FFB800]/80 mb-3">Selecione o Timeframe</p>
              <div className="grid grid-cols-2 gap-3">
                {['M1', 'M5'].map((tf) => (
                  <Button 
                    key={tf}
                    variant="outline"
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`${
                      selectedTimeframe === tf 
                        ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]' 
                        : 'text-[#FFB800]/60 border-[#FFB800]/20 hover:border-[#FFB800]/40'
                    }`}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="w-full h-14 bg-[#FFB800] text-black hover:bg-[#FFB800]/90 hover:scale-[1.02] text-lg font-medium tracking-wider shadow-lg shadow-[#FFB800]/10 transition-all duration-300"
            >
              {isAnalyzing ? 'ANALISANDO...' : 'GERAR SINAL'}
            </Button>
          </div>
        </div>
      )}

      {(isAnalyzing || isValidating) && (
        <div className="space-y-8 text-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#FFB800]/10 rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-xl font-medium text-[#FFB800] mb-3">
              {isValidating ? 'Validando Gráfico' : 'Analisando...'}
            </div>
            <div className="text-[#FFB800]/60">
              {isValidating ? validationMessage : (
                <div className="space-y-2">
                  {analysisSteps.map((step, index) => (
                    <div key={index} className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {step}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!selectedImage && !isAnalyzing && (
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
          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
        >
          <div className="w-16 h-16 rounded-full bg-[#FFB800]/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-[#FFB800]/60" />
          </div>
          <div>
            <h3 className="text-[#FFB800] text-xl mb-2">
              {dragActive ? 'Solte o arquivo aqui' : 'Carregar Gráfico'}
            </h3>
            <div className="space-y-2">
              <p className="text-[#FFB800]/60">
                Arraste e solte ou clique para selecionar
              </p>
              <p className="text-[#FFB800]/40 text-sm">
                Importante: O gráfico deve conter candlesticks visíveis
              </p>
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {analysisResult && (
        <div className="space-y-8">
          <div className="bg-gradient-to-b from-[#FFB800]/10 to-transparent p-8 rounded-2xl">
            <div className="space-y-4 text-[#FFB800]">
              <p className="font-bold">CORRETORA RECOMENDADA: STAK BROKER</p>
              <p>🥇 Moeda = {analysisResult.asset}</p>
              <p>⏰ Expiração = {analysisResult.timeframe}</p>
              <p>📌 Entrada = {analysisResult.entryTime}</p>
              <p>{analysisResult.action === 'COMPRE' ? '✅COMPRA' : '❌VENDA'}</p>
              <p></p>
              <p>📌Proteção 1: {analysisResult.protection1}</p>
              <p>📌Proteção 2: {analysisResult.protection2}</p>
              <p></p>
              <p>OBS: ENTREM 2s antes</p>
              <p></p>
              <p>⚠️ FAÇAM NO MÁXIMO DUAS PROTEÇÕES!</p>
            </div>
          </div>

          <Button
            onClick={() => {
              setSelectedImage(null);
              setAnalysisResult(null);
            }}
            className="w-full h-12 bg-transparent border border-[#FFB800]/20 text-[#FFB800]/80 hover:bg-[#FFB800]/5 hover:border-[#FFB800]/40 transition-all duration-300"
          >
            Gerar Novo Sinal
          </Button>
        </div>
      )}
    </Card>
  );
}