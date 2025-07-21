@@ .. @@
 export interface CreativeAnalysisResult {
-    analysis: CreativeAnalysis;
+    description: string;
+    artisticStyle: string;
+    technicalElements: string[];
+    remixSuggestions: string[];
 }