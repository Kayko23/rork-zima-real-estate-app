import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export async function pickPdfOrImage() {
  try {
    // Propose d'abord PDF, sinon image
    const doc = await DocumentPicker.getDocumentAsync({ 
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });
    
    if (doc.assets && doc.assets[0]) {
      const asset = doc.assets[0];
      return { 
        uri: asset.uri, 
        name: asset.name ?? "file", 
        type: asset.mimeType ?? "application/octet-stream" 
      };
    }
    
    // Si pas de document, essayer image
    const imgPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!imgPerm.granted) {
      console.log('Permission refusée pour accéder aux images');
      return null;
    }
    
    const img = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      quality: 0.8,
      allowsEditing: true,
    });
    
    if (!img.canceled && img.assets[0]) {
      const asset = img.assets[0];
      return { 
        uri: asset.uri, 
        name: asset.fileName ?? "image.jpg", 
        type: asset.mimeType ?? "image/jpeg" 
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la sélection du fichier:', error);
    return null;
  }
}