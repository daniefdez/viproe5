@@ .. @@
 const MAX_FILE_SIZE_MB = 10;
 const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
 const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
+const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

 export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
@@ .. @@
   const validateFile = (file: File): string | null => {
+    // Check file name for suspicious patterns
+    const suspiciousPatterns = [
+      /\.(exe|bat|cmd|scr|pif|com)$/i,
+      /\.(js|vbs|jar|app)$/i,
+      /\.(php|asp|jsp|py)$/i,
+      /[<>:"|?*]/,
+      /^\./,
+      /\.\./
+    ];
+    
+    for (const pattern of suspiciousPatterns) {
+      if (pattern.test(file.name)) {
+        return 'Nombre de archivo no válido o potencialmente peligroso.';
+      }
+    }
+    
+    // Check file extension
+    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => 
+      file.name.toLowerCase().endsWith(ext)
+    );
+    
+    if (!hasValidExtension) {
+      return `Extensión de archivo no válida. Solo se permiten: ${ALLOWED_EXTENSIONS.join(', ')}.`;
+    }
+    
     if (!ALLOWED_MIME_TYPES.includes(file.type)) {
       return `Tipo de archivo no válido. Solo se permiten PNG, JPG, WEBP.`;
     }
+    
     if (file.size > MAX_FILE_SIZE_BYTES) {
       return `El archivo es demasiado grande. El tamaño máximo es de ${MAX_FILE_SIZE_MB}MB.`;
     }
+    
+    // Additional size check for empty files
+    if (file.size === 0) {
+      return 'El archivo está vacío.';
+    }
+    
     return null;
   };