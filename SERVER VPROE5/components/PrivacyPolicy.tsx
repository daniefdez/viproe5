import React from 'react';

const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-bold text-slate-200 mb-3">{title}</h2>
        <div className="prose prose-invert prose-p:text-slate-400 prose-li:text-slate-400 max-w-none space-y-4">
            {children}
        </div>
    </section>
);

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in py-8 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-100">Política de Privacidad</h1>
                <p className="text-lg text-slate-500 mt-2">Última actualización: {new Date().toLocaleDateString()}</p>
            </div>

            <LegalSection title="1. Introducción">
                <p>
                    Bienvenido a VisionAI Pro Model e5. Nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando utiliza nuestra aplicación.
                </p>
            </LegalSection>

            <LegalSection title="2. Recopilación de Información">
                <p>
                    Recopilamos información que usted nos proporciona directamente, así como datos generados por su uso de nuestro servicio.
                </p>
                <ul>
                    <li><strong>Imágenes Subidas:</strong> Las imágenes que usted sube son enviadas a la API de Google Gemini para su análisis. No almacenamos permanentemente sus imágenes en nuestros servidores después de que se complete el análisis. Se mantienen solo durante el tiempo necesario para procesar su solicitud.</li>
                    <li><strong>Datos de Uso:</strong> Podemos recopilar información anónima sobre su interacción con la aplicación, como las funciones utilizadas y los errores encontrados, para mejorar nuestro servicio.</li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Uso de su Información">
                <p>
                    Utilizamos la información que recopilamos para:
                </p>
                <ul>
                    <li>Proporcionar, operar y mantener nuestra aplicación.</li>
                    <li>Mejorar, personalizar y ampliar nuestra aplicación.</li>
                    <li>Entender y analizar cómo utiliza nuestra aplicación.</li>
                    <li>Prevenir el fraude y garantizar la seguridad de nuestra plataforma.</li>
                </ul>
            </LegalSection>

            <LegalSection title="4. Intercambio de Información">
                <p>
                    No vendemos, intercambiamos ni transferimos de ninguna otra manera a terceros sus datos de identificación personal. Su imagen se comparte con la API de Google para su análisis, sujeta a las políticas de privacidad de Google. No compartimos información con otros terceros.
                </p>
            </LegalSection>
            
            <LegalSection title="5. Seguridad de los Datos">
                <p>
                    Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información. La comunicación con nuestros servidores y con la API de Google se realiza a través de protocolos seguros (HTTPS). Sin embargo, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro.
                </p>
            </LegalSection>

            <LegalSection title="6. Cambios a esta Política de Privacidad">
                <p>
                    Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página. Se le aconseja revisar esta Política de Privacidad periódicamente para cualquier cambio.
                </p>
            </LegalSection>
        </div>
    );
};