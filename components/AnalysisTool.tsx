@@ .. @@
     useEffect(() => {
-        try {
+        const loadSavedState = () => {
+            try {
+                const savedState = localStorage.getItem('analysisToolState');
+                if (!savedState) return;
+                
+                const parsed = JSON.parse(savedState);
+                
+                // Validate the structure of saved data
+                if (typeof parsed !== 'object' || parsed === null) {
+                    localStorage.removeItem('analysisToolState');
+                    return;
+                }
+                
+                // Only restore valid data
+                if (parsed.imageUrl && typeof parsed.imageUrl === 'string') {
+                    setImageUrl(parsed.imageUrl);
+                }
+                if (parsed.analysis && typeof parsed.analysis === 'object') {
+                    setAnalysis(parsed.analysis);
+                }
+                if (Array.isArray(parsed.messages)) {
+                    setMessages(parsed.messages);
+                }
+            } catch (e) {
+                console.error("Error al cargar el estado desde localStorage", e);
+                localStorage.removeItem('analysisToolState');
+            }
+        };
+        
+        loadSavedState();
+    }, []);
+    
+    useEffect(() => {
+        const saveState = () => {
+            try {
+                if (imageUrl) {
+                    const stateToSave = { imageUrl, analysis, messages };
+                    localStorage.setItem('analysisToolState', JSON.stringify(stateToSave));
+                }
+            } catch (e) {
+                console.error("Error al guardar el estado en localStorage", e);
+            }
+        };
+        
+        saveState();
+    }, [imageUrl, analysis, messages]);
+    
+    const handleImageSelect = (file: File) => {
+        // Additional client-side validation
+        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
+        if (!allowedTypes.includes(file.type)) {
+            setError('Tipo de archivo no válido.');
+            return;
+        }
+        
+        if (file.size > 10 * 1024 * 1024) { // 10MB
+            setError('El archivo es demasiado grande.');
+            return;
+        }
+        
+        handleReset();
+        setImageFile(file);
+        
+        try {
+            const url = URL.createObjectURL(file);
+            setImageUrl(url);
+        } catch (e) {
+            setError('Error al procesar la imagen.');
+        }
+    };