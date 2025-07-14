import React, { useState } from 'react';
import { IconBrain, IconZap, IconShieldCheck, IconKey, IconClipboard, IconCheck, IconLayers, IconChip, IconCode } from './icons';

const DocSection: React.FC<{ title: string; children: React.ReactNode, id?: string }> = ({ title, children, id }) => (
    <section id={id} className="mb-12 scroll-mt-20">
        <h2 className="text-3xl font-bold text-slate-200 mb-4 pb-2 border-b border-slate-700">
            {title}
        </h2>
        <div className="prose prose-invert prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-slate-100 prose-a:text-purple-400 hover:prose-a:text-purple-300 space-y-4 max-w-none">
            {children}
        </div>
    </section>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative bg-slate-900/70 rounded-lg my-4">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
                aria-label="Copiar código"
            >
                {isCopied ? <IconCheck className="w-5 h-5 text-green-400" /> : <IconClipboard className="w-5 h-5 text-slate-400" />}
            </button>
            <pre className="p-4 text-sm overflow-x-auto text-slate-300">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const CodeTabs: React.FC<{ examples: { lang: string; code: string }[] }> = ({ examples }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="border-b border-slate-700">
                {examples.map((ex, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2 ${
                            activeTab === index 
                            ? 'text-yellow-400 border-yellow-400' 
                            : 'text-slate-400 border-transparent hover:border-slate-500 hover:text-slate-200'
                        }`}
                    >
                        {ex.lang}
                    </button>
                ))}
            </div>
            <div>
                <CodeBlock code={examples[activeTab].code} />
            </div>
        </div>
    );
}

const AdvantageCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children}) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 h-full">
        <div className="flex items-center gap-3 mb-2">
            {icon}
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        </div>
        <p className="text-slate-400 text-sm">{children}</p>
    </div>
);


export const Documentation: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const [isKeyCopied, setIsKeyCopied] = useState(false);

    const generateApiKey = () => {
        const newKey = `vision_sk_e5_${[...Array(30)].map(() => Math.random().toString(36)[2]).join('')}`;
        setApiKey(newKey);
    };

    const handleCopyKey = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey);
        setIsKeyCopied(true);
        setTimeout(() => setIsKeyCopied(false), 2000);
    };

    const codeExamples = {
        curl: `curl -X POST "https://api.visionaipro.com/v1/analyze" \\
-H "Authorization: Bearer \${API_KEY}" \\
-F "image=@/path/to/your/image.jpg"`,
        javascript: `const analyzeImage = async (apiKey, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('https://api.visionaipro.com/v1/analyze', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  console.log(data);
  return data;
};`,
        python: `import requests

def analyze_image(api_key, file_path):
    url = "https://api.visionaipro.com/v1/analyze"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    with open(file_path, 'rb') as f:
        files = {'image': (file_path.split('/')[-1], f)}
        response = requests.post(url, headers=headers, files=files)
    
    response.raise_for_status() # Lanza un error para códigos de estado 4xx/5xx
    return response.json()

# Uso:
# api_key = "TU_CLAVE_DE_API_E5"
# result = analyze_image(api_key, "/ruta/a/tu/imagen.jpg")
# print(result)`
    };

    const successResponseExample = JSON.stringify({
        "analysisModel": "VisionAI Pro (Gemini Pro Implementation)",
        "visualElements": { /* ... */ },
        "compositionAnalysis": { /* ... */ },
        "forensicAnalysis": { /* ... */ }
    }, null, 2);

    const errorResponseExample = JSON.stringify({
        "error": {
            "code": 401,
            "message": "Authentication failed: Invalid API Key for Model e5."
        }
    }, null, 2);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in py-8 px-4">
        <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-slate-100">Integrando el Poder de Gemini Pro con VisionAI</h1>
            <p className="text-lg text-slate-400 mt-4 max-w-3xl mx-auto">
                Integra el poder del análisis de VisionAI Pro en tus aplicaciones con nuestra API RESTful, construida sobre Gemini Pro y optimizada en Google AI Studio.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className='lg:col-span-3'>
                
                <section id="advantages" className="mb-12 scroll-mt-20">
                    <h2 className="text-3xl font-bold text-slate-200 mb-4 pb-2 border-b border-slate-700 text-center">
                        Ventajas de la API de VisionAI Pro
                    </h2>
                    <div className="prose prose-invert prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-slate-100 prose-a:text-purple-400 hover:prose-a:text-purple-300 space-y-4 max-w-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AdvantageCard title="Motor Gemini Pro" icon={<IconBrain className="w-6 h-6 text-purple-400" />}>
                               Nuestra API se conecta directamente con Gemini Pro, el modelo multimodal de vanguardia de Google, permitiendo un análisis visual que transforma imágenes en información útil.
                            </AdvantageCard>
                            <AdvantageCard title="Optimizado con Google AI Studio" icon={<IconChip className="w-6 h-6 text-cyan-400" />}>
                               Cada faceta de VisionAI Pro ha sido meticulosamente afinada en Google AI Studio. Esto nos permite ofrecer una API robusta, escalable y con tiempos de respuesta excepcionales.
                            </AdvantageCard>
                             <AdvantageCard title="Rendimiento Superior" icon={<IconLayers className="w-6 h-6 text-yellow-400" />}>
                               La combinación de Gemini Pro y nuestra optimización garantiza una detección de patrones y anomalías con una precisión y velocidad superiores para tus aplicaciones.
                            </AdvantageCard>
                        </div>
                    </div>
                </section>

                <DocSection title="Empezando" id="getting-started">
                    <p>
                        Para comenzar, necesitarás una clave de API para autenticar tus solicitudes. Puedes generar una clave de prueba a continuación para empezar a experimentar de inmediato con nuestra implementación de Gemini Pro.
                    </p>
                     <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 my-6">
                        <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2"><IconKey className="w-6 h-6 text-yellow-400" /> Tu Clave de API para VisionAI</h3>
                        {!apiKey ? (
                             <button onClick={generateApiKey} className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-md hover:bg-yellow-500 transition">
                                Generar Clave de API
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 bg-slate-900/70 p-3 rounded-md border border-slate-700 font-mono text-sm">
                                <span className="text-slate-300 flex-grow truncate">{apiKey}</span>
                                 <button onClick={handleCopyKey} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors flex-shrink-0">
                                    {isKeyCopied ? <IconCheck className="w-5 h-5 text-green-400" /> : <IconClipboard className="w-5 h-5 text-slate-400" />}
                                </button>
                            </div>
                        )}
                       
                    </div>
                    <p>
                        Una vez que tengas tu clave, puedes realizar llamadas a nuestro endpoint de análisis. Asegúrate de incluir tu clave de API en la cabecera de `Authorization` como un token `Bearer`.
                    </p>
                </DocSection>

                <DocSection title="Uso de la API" id="api-usage">
                    <p>Realiza una solicitud `POST` a nuestro endpoint de análisis con la imagen que deseas procesar. La API está optimizada para tiempos de respuesta rápidos.</p>
                    <CodeTabs examples={[
                        { lang: 'cURL', code: codeExamples.curl },
                        { lang: 'JavaScript', code: codeExamples.javascript },
                        { lang: 'Python', code: codeExamples.python }
                    ]}/>
                </DocSection>

                <DocSection title="Referencia de la API" id="api-reference">
                     <h3 className="text-xl font-semibold text-slate-300"><code>POST /v1/analyze</code></h3>
                     <p className="mb-4">Analiza una imagen y devuelve un desglose completo usando nuestra implementación de Gemini Pro.</p>
                     
                     <h4 className="font-semibold text-slate-300 mt-4">Cabeceras (Headers)</h4>
                     <p><code>Authorization: Bearer TU_CLAVE_DE_API_E5</code></p>
                     
                     <h4 className="font-semibold text-slate-300 mt-4">Cuerpo (Body)</h4>
                     <p><code>multipart/form-data</code> con un campo <code>image</code> que contiene el archivo de la imagen (JPG, PNG, WEBP).</p>
                     
                     <h4 className="font-semibold text-slate-300 mt-4">Respuesta de Éxito (200 OK)</h4>
                     <p>Devuelve un objeto JSON con la estructura del análisis completo.</p>
                     <CodeBlock code={successResponseExample} />

                     <h4 className="font-semibold text-slate-300 mt-4">Respuesta de Error</h4>
                     <p>Devuelve un objeto JSON con un código de error y un mensaje.</p>
                     <CodeBlock code={errorResponseExample} />
                </DocSection>
            </div>
        </div>
    </div>
  );
};