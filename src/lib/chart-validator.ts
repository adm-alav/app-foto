export async function validateChartImage(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        resolve(false);
        return;
      }

      // Desenha a imagem no canvas
      ctx.drawImage(img, 0, 0);
      
      // Obtém os dados da imagem
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Verifica se há variação suficiente de cores (indicativo de candlesticks)
      let hasGreen = false;
      let hasRed = false;
      let hasBlack = false;
      let hasWhite = false;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Verifica verde (candlesticks de alta)
        if (g > r + 50 && g > b + 50) {
          hasGreen = true;
        }
        
        // Verifica vermelho (candlesticks de baixa)
        if (r > g + 50 && r > b + 50) {
          hasRed = true;
        }
        
        // Verifica preto (linhas de grade)
        if (r < 50 && g < 50 && b < 50) {
          hasBlack = true;
        }
        
        // Verifica branco (fundo do gráfico)
        if (r > 200 && g > 200 && b > 200) {
          hasWhite = true;
        }
        
        // Se encontrou todas as cores necessárias, é provavelmente um gráfico
        if (hasGreen && hasRed && hasBlack && hasWhite) {
          resolve(true);
          return;
        }
      }
      
      resolve(false);
    };
    
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}
