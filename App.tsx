@@ .. @@
 import React, { useState } from 'react';
+import { AuthProvider } from './components/AuthProvider';
 import { Header } from './components/Header';
@@ .. @@
   };

   return (
+    <AuthProvider>
       <div className="relative min-h-screen text-gray-200 font-sans flex flex-col items-center overflow-x-hidden bg-gray-900">
@@ .. @@
         <Footer setView={setView} />
       </div>
+    </AuthProvider>
   );
 };