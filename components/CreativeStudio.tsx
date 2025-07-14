@@ .. @@
     const handleGenerateImage = async (promptToUse?: string) => {
         const finalPrompt = promptToUse || editablePrompt;
-        if (!finalPrompt.trim()) {
+        
+        // Enhanced validation
+        if (!finalPrompt || typeof finalPrompt !== 'string' || !finalPrompt.trim()) {
             setGenerationError("El prompt no puede estar vacío.");
             return;
         }
+        
+        // Check prompt length
+        if (finalPrompt.trim().length > 2000) {
+            setGenerationError("El prompt es demasiado largo. Máximo 2000 caracteres.");
+            return;
+        }
+        
+        // Check for inappropriate content patterns
+        const inappropriatePatterns = [
+            /\b(nude|naked|sex|porn|explicit)\b/i,
+            /\b(violence|blood|gore|death)\b/i,
+            /\b(hate|racist|discrimination)\b/i
+        ];
+        
+        for (const pattern of inappropriatePatterns) {
+            if (pattern.test(finalPrompt)) {
+                setGenerationError("El prompt contiene contenido no apropiado.");
+                return;
+            }
+        }
+        
         setIsGeneratingImage(true);
@@ .. @@
                             <textarea
                                 id="prompt-editor"
                                 rows={5}
                                 value={editablePrompt}
                                 onChange={(e) => setEditablePrompt(e.target.value)}
+                                maxLength={2000}
                                 className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-slate-300 font-mono text-sm"
                                 placeholder="Ej: A photorealistic portrait of an elderly fisherman..."
                             />
+                            <div className="text-xs text-slate-500 mt-1 text-right">
+                                {editablePrompt.length}/2000 caracteres
+                            </div>
                         </div>