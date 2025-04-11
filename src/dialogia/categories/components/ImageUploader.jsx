import { useState, useImperativeHandle, forwardRef, useContext } from 'react';
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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      setPreviewUrl(''); // Resetear vista previa anterior
      
      // Comprimir imagen
      const compressed = await imageCompression(selectedFile, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      });
      
      // Generar vista previa
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
      
      // Mantener el nombre original del archivo
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

  // Exponemos la función uploadFile al componente padre
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
      
      {!currentUser && (
        <Text mt={2} color="red.500" fontSize="sm">
          Debes iniciar sesión para subir imágenes
        </Text>
      )}
      
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
            {file?.name} - {(compressedFile?.size / 1024).toFixed(2)} KB
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