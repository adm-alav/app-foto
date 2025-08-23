'use client';

import { useState, useEffect } from "react";
import { Upload, LineChart, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useSound } from "@/hooks/use-sound";
import { useStakbroker } from "@/components/providers/stakbroker-provider";
import { validateChartImage } from "@/lib/chart-validator";
import { SignalAnimation } from "@/components/ui/signal-animation";
import { motion, AnimatePresence } from "framer-motion";

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

  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const analyzeImage = async () => {
    if (!selectedImage || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setCurrentStep(1);
    playNotification();
    
    try {
      // Simula análise detalhada com passos
      for (let step = 1; step <= 6; step++) {
        setCurrentStep(step);
        await new Promise(resolve => setTimeout(resolve, 1500));
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
      setShowSuccess(true);
      playSuccess();
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(false);
      setIsAnalyzing(false);
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
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#FFB800]/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#FFB800]/10 blur-3xl"></div>
      </div>

      <Card className="relative z-10 w-full max-w-4xl bg-gradient-card border-[#FFB800]/20 shadow-golden-lg p-8" style={{
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

      <AnimatePresence>
        {isValidating && (
          <motion.div 
            className="space-y-8 text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#FFB800]/10 rounded-full animate-pulse" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-xl font-medium text-[#FFB800] mb-3">
                Validando Gráfico
              </div>
              <div className="text-[#FFB800]/60">
                {validationMessage}
              </div>
            </motion.div>
          </motion.div>
        )}

        {isAnalyzing && !showSuccess && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12"
          >
            <SignalAnimation step={currentStep} />
          </motion.div>
        )}

        {showSuccess && (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-medium text-green-500"
            >
              Sinal Gerado com Sucesso!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedImage && !isAnalyzing && (
        <div className="text-center space-y-8">
          <div className="text-center mb-6">
            <Upload className="w-8 h-8 text-[#FFB800] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#FFB800] mb-2">Upload do Gráfico</h2>
            <p className="text-[#FFB800]/60">Envie um screenshot de gráfico de candlestick</p>
          </div>

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
                {dragActive ? 'Solte o arquivo aqui' : 'Clique para fazer upload'}
              </h3>
              <p className="text-[#FFB800]/60 mb-2">
                PNG, JPG ou JPEG
              </p>
              <p className="text-[#FFB800]/40 text-sm">
                Screenshots de gráficos com velas vermelhas e verdes
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#FFB800]/5 border border-[#FFB800]/20 rounded-lg">
            <div className="flex items-start">
              <div className="w-4 h-4 bg-[#FFB800] rounded-full flex-shrink-0 mt-0.5 mr-3"></div>
              <div>
                <p className="text-sm text-[#FFB800]/60">
                  IA CAM 2.0 funciona exclusivamente na{" "}
                  <span className="text-[#FFB800] font-medium underline cursor-pointer">
                    STAK BROKER
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-[#FFB800]/40">
              © 2025 IA CAM 2.0 - Todos os direitos reservados
            </p>
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
          <div className="bg-gradient-to-b from-[#FFB800]/10 to-transparent p-8 rounded-2xl border border-[#FFB800]/20">
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/5 rounded-full blur-3xl"></div>
              <div className="relative space-y-6 text-[#FFB800]">
                <div className="flex items-center justify-between border-b border-[#FFB800]/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFB800]/10 flex items-center justify-center">
                      <LineChart className="w-6 h-6 text-[#FFB800]" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">STAK BROKER</p>
                      <p className="text-[#FFB800]/60 text-sm">CORRETORA RECOMENDADA</p>
                    </div>
                  </div>
                  <div className="animate-pulse">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FFB800]/5 rounded-lg p-4">
                    <p className="text-[#FFB800]/60 text-sm mb-1">Moeda</p>
                    <p className="font-medium text-lg">🥇 {analysisResult.asset}</p>
                  </div>
                  <div className="bg-[#FFB800]/5 rounded-lg p-4">
                    <p className="text-[#FFB800]/60 text-sm mb-1">Expiração</p>
                    <p className="font-medium text-lg">⏰ {analysisResult.timeframe}</p>
                  </div>
                </div>

                <div className="bg-[#FFB800]/5 rounded-lg p-6 text-center">
                  <p className="text-[#FFB800]/60 text-sm mb-2">Entrada</p>
                  <p className="font-bold text-2xl">📌 {analysisResult.entryTime}</p>
                  <div className="mt-4 inline-block px-6 py-2 rounded-full bg-[#FFB800]/10 font-medium">
                    {analysisResult.action === 'COMPRE' ? '✅ COMPRA' : '❌ VENDA'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FFB800]/5 rounded-lg p-4">
                    <p className="text-[#FFB800]/60 text-sm mb-1">Proteção 1</p>
                    <p className="font-medium">📌 {analysisResult.protection1}</p>
                  </div>
                  <div className="bg-[#FFB800]/5 rounded-lg p-4">
                    <p className="text-[#FFB800]/60 text-sm mb-1">Proteção 2</p>
                    <p className="font-medium">📌 {analysisResult.protection2}</p>
                  </div>
                </div>

                <div className="bg-[#FFB800]/5 rounded-lg p-4 border-l-4 border-[#FFB800]">
                  <p className="font-medium mb-2">⚠️ Observações Importantes:</p>
                  <ul className="space-y-2 text-[#FFB800]/80">
                    <li>• ENTREM 2s antes do horário</li>
                    <li>• FAÇAM NO MÁXIMO DUAS PROTEÇÕES!</li>
                  </ul>
                </div>
              </div>
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