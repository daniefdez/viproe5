@@ .. @@
     const handleAsk = (prompt?: string) => {
         const messageToSend = prompt || currentMessage;
-        if (!messageToSend.trim() || isLoading) return;
+        
+        // Enhanced input validation
+        if (!messageToSend || typeof messageToSend !== 'string' || !messageToSend.trim() || isLoading) {
+            return;
+        }
+        
+        // Check message length
+        if (messageToSend.trim().length > 500) {
+            alert('El mensaje es demasiado largo. Máximo 500 caracteres.');
+            return;
+        }
+        
+        // Check for suspicious patterns
+        const suspiciousPatterns = [
+            /<script/i,
+            /javascript:/i,
+            /on\w+\s*=/i,
+            /data:text\/html/i,
+            /vbscript:/i
+        ];
+        
+        for (const pattern of suspiciousPatterns) {
+            if (pattern.test(messageToSend)) {
+                alert('El mensaje contiene contenido no permitido.');
+                return;
+            }
+        }
         
        onSendMessage(messageToSend);
}