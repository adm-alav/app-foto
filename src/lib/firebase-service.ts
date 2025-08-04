import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export class FirebaseService {
  static async uploadImage(file: File | Blob, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  static async uploadChartImage(
    imageBlob: Blob,
    asset: string,
    timeframe: string
  ): Promise<string> {
    const fileName = `charts/${asset}-${timeframe}-${Date.now()}.png`;
    return await this.uploadImage(imageBlob, fileName);
  }
}
