// import { useRef } from 'react';
// import { Button } from '@chakra-ui/react';
// import ImageUploader from './ImageUploader';

// const ParentComponent = () => {
//   const uploaderRef = useRef();

//   const handleSubmit = async () => {
//     try {
//       const fileData = await uploaderRef.current.uploadFile();
//       console.log('Archivo subido:', fileData);
//       // Aquí puedes guardar fileData en tu base de datos
//     } catch (error) {
//       console.error('Error al subir:', error);
//     }
//   };

//   return (
//     <div>
//       <ImageUploader ref={uploaderRef} folderPath="debate" />
      
//       <Button 
//         onClick={handleSubmit}
//         colorScheme="blue"
//         mt={4}
//         isDisabled={!uploaderRef.current?.hasFile}
//       >
//         Guardar todo
//       </Button>
//     </div>
//   );
// }; 
// export default ParentComponent;