import { useState, useImperativeHandle, forwardRef } from 'react';
import { getStorage, ref as ref_2, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Progress, Button, Box, Image, Text } from '@chakra-ui/react';
import imageCompression from 'browser-image-compression';
import { toaster } from "../../../components/ui/toaster";
import { useAuth } from "../../../contexts/hooks/useAuth";

const ImageUploader = forwardRef(({ folderPath = 'uploads' }, ref) => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const resetUploader = () => {
    setFile(null);
    setCompressedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
  };

  const checkImageSafety = async (imageFile) => {
    try {
      // Convertir la imagen a base64
      const reader = new FileReader();
      const base64Image = await new Promise((resolve) => {
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(imageFile);
      });

      const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_API_IMAGEN}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'SAFE_SEARCH_DETECTION',
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al verificar la imagen');
      }

      const safeSearchAnnotation = data.responses[0].safeSearchAnnotation;
      
      const isUnsafe = 
        safeSearchAnnotation.adult === 'LIKELY' || 
        safeSearchAnnotation.adult === 'VERY_LIKELY' ||
        safeSearchAnnotation.violence === 'LIKELY' || 
        safeSearchAnnotation.violence === 'VERY_LIKELY' ||
        safeSearchAnnotation.racy === 'LIKELY' || 
        safeSearchAnnotation.racy === 'VERY_LIKELY';

      return !isUnsafe;
    } catch (error) {
      console.error('Error verificando imagen:', error);
      toaster.create({
        title: 'Advertencia',
        description: 'No se pudo verificar la seguridad de la imagen. Sube solo contenido apropiado.',
        status: 'warning',
      });
      return false; // En caso de error, consideramos la imagen como insegura
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      resetUploader(); // Limpiar cualquier estado anterior
      
      // Comprimir imagen
      const compressed = await imageCompression(selectedFile, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      });
      
      // Verificar seguridad de la imagen
      const isSafe = await checkImageSafety(compressed);
      
      if (!isSafe) {
        toaster.create({ 
          title: 'Contenido no permitido', 
          description: 'La imagen contiene contenido inapropiado y ha sido descartada.', 
          status: 'error',
          duration: 5000 
        });
        // Resetear el input file para permitir nueva selección
        e.target.value = '';
        return;
      }
      
      // Generar vista previa solo si es segura
      const preview = await imageCompression.getDataUrlFromFile(compressed);
      
      setFile(selectedFile);
      setCompressedFile(compressed);
      setPreviewUrl(preview);

    } catch (error) {
      toaster.create({ 
        title: 'Error', 
        description: 'Error al procesar la imagen', 
        status: 'error' 
      });
      resetUploader();
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async () => {
    if (!currentUser) {
      toaster.create({ 
        title: 'Error', 
        description: 'Debes iniciar sesión para subir imágenes', 
        status: 'error' 
      });
      return null;
    }

    if (!compressedFile) {
      toaster.create({ 
        title: 'Error', 
        description: 'No hay archivo seleccionado', 
        status: 'error' 
      });
      return null;
    }

    try {
      setIsLoading(true);
      setUploadProgress(0);
      const storage = getStorage();
      
      const fileExtension = compressedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

      const storageRef = ref_2(storage, `${folderPath}/${fileName}`);

      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              fileName,
              fullPath: uploadTask.snapshot.ref.fullPath,
              originalName: file.name,
              size: compressedFile.size
            });
          }
        );
      });
    } catch (error) {
      toaster.create({ 
        title: 'Error', 
        description: error.message, 
        status: 'error' 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    uploadFile,
    hasFile: !!compressedFile,
    isLoading,
    previewUrl
  }));

  return (
    <Box>
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }}
        id="file-upload"
        disabled={!currentUser}
      />
      
      <label htmlFor="file-upload">
        <Button 
          as="span" 
          isLoading={isLoading}
          colorScheme={previewUrl ? 'green' : 'blue'}
          disabled={!currentUser}
        >
          {previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </Button>
      </label>
      
      
      {previewUrl && (
        <Box mb={4} textAlign="center">
          <Text mb={2} fontWeight="medium">Vista previa:</Text>
          <Image 
            src={previewUrl} 
            alt="Preview" 
            maxH="200px"
            borderRadius="md"
            mx="auto"
          />
          <Text fontSize="sm" mt={2}>
            {(compressedFile?.size / 1024).toFixed(2)} KB
          </Text>
        </Box>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress value={uploadProgress} size="sm" mt={2} colorScheme="blue" />
      )}
    </Box>
  );
});

export default ImageUploader;