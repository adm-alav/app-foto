'use client';

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useSound } from "@/hooks/use-sound";
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
  const { playNotification, playSuccess } = useSound();
  const { wallets, trades, openTrade, getCurrentPrice } = useStakbroker();
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState('BTC/USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('M1');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ChartAnalysis | null>(null);

  const analyzeImage = async () => {
    if (!selectedImage || isAnalyzing) return;
    
    setIsAnalyzing(true);
    playNotification(); // Toca som quando começa a análise
    
    try {
      // Obter preço atual do ativo
      const currentPrice = await getCurrentPrice(selectedAsset);
      
      if (!currentPrice) {
        throw new Error('Não foi possível obter o preço atual');
      }
      
      // Simula análise da IA (em produção, isso seria uma chamada real à API de IA)
      const action: 'COMPRE' | 'VENDA' = Math.random() > 0.5 ? 'COMPRE' : 'VENDA';
      const confidence = Math.floor(Math.random() * 20) + 80;
      
      // Define os horários de entrada e proteções
      const entryTime = new Date();
      entryTime.setMinutes(entryTime.getMinutes() + 1);
      
      const protection1Time = new Date(entryTime);
      protection1Time.setMinutes(protection1Time.getMinutes() + 1);
      
      const protection2Time = new Date(protection1Time);
      protection2Time.setMinutes(protection2Time.getMinutes() + 1);

      const result: ChartAnalysis = {
        action,
        asset: selectedAsset,
        timeframe: selectedTimeframe,
        entryTime: entryTime.toISOString(),
        confidence,
        entryPrice: currentPrice,
        protection1: protection1Time.toISOString(),
        protection2: protection2Time.toISOString()
      };

      // Se a confiança for alta, executa a ordem automaticamente
      if (confidence > 85) {
        const quantity = 1; // Quantidade padrão para teste
        const type = action === 'COMPRE' ? 'BUY' : 'SELL';
        
        const trade = await openTrade(selectedAsset, quantity, type, currentPrice);
        
        if (trade) {
          playSuccess();
          console.log('Ordem executada com sucesso:', trade);
        }
      }

      setAnalysisResult(result);
      setIsAnalyzing(false);
      playSuccess(); // Toca som quando finaliza a análise
      
    } catch (error) {
      console.error('Erro na análise:', error);
      setIsAnalyzing(false);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      // Verifica o tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo é muito grande. Por favor, selecione uma imagem menor que 5MB.');
        return;
      }

      // Verifica o tipo do arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      const reader = new FileReader();
      
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        
        // Comprimir imagem antes de salvar
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Define o tamanho máximo mantendo a proporção
          const maxSize = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          } else if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Converter para WebP com qualidade reduzida
          const compressedImageUrl = canvas.toDataURL('image/webp', 0.8);
          setSelectedImage(compressedImageUrl);
        };
        
        img.src = imageUrl;
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
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#1a1505] to-[#1f1a08] border-b border-[#FFB800]/20 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto px-6 py-4">
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
            <a 
              href="https://stakbroker.com/traderoom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#FFB800]/80 hover:text-[#FFB800] transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              stakbroker.com
            </a>
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
              Upload sua imagem para análise instantânea com inteligência artificial
            </p>
          </div>
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
            onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
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
