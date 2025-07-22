@@ .. @@
export const IconWand: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.242.013.487.02.73.02a9.75 9.75 0 019.75 9.75c0 .243-.007.488-.02.731M9.75 3.104a2.25 2.25 0 00-1.618-1.618C7.886 1.472 7.64 1.45 7.382 1.45 3.866 1.45 1 4.316 1 7.832c0 .258.022.504.06.748a2.25 2.25 0 001.618 1.618M14.5 5l-1 1M16.5 7l-1 1M18.5 9l-1 1M20.5 11l-1 1" />
    </svg>
);

+export const IconHeart: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
+    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
+        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
+    </svg>
+);