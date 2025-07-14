import React from 'react';

const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-bold text-slate-200 mb-3">{title}</h2>
        <div className="prose prose-invert prose-p:text-slate-400 prose-li:text-slate-400 max-w-none space-y-4">
            {children}
        </div>
    </section>
);

export const TermsOfService: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in py-8 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-100">Términos de Servicio</h1>
                <p className="text-lg text-slate-500 mt-2">Última actualización: {new Date().toLocaleDateString()}</p>
            </div>

            <LegalSection title="1. Aceptación de los Términos">
                <p>
                    Al acceder y utilizar VisionAI Pro Model e5 (la "Aplicación"), usted acepta y se compromete a cumplir estos Términos de Servicio y nuestra Política de Privacidad. Si no está de acuerdo con estos términos, no debe utilizar la Aplicación.
                </p>
            </LegalSection>

            <LegalSection title="2. Uso de la Aplicación">
                <p>
                    Usted se compromete a utilizar la Aplicación solo para fines legales y de acuerdo con estos Términos. Usted es responsable de las imágenes que sube y de las consecuencias de su análisis.
                </p>
                <p>
                    No debe utilizar la aplicación para:
                </p>
                <ul>
                    <li>Subir contenido ilegal, dañino, amenazante, abusivo, difamatorio, obsceno o de cualquier otra forma objetable.</li>
                    <li>Violar los derechos de propiedad intelectual de terceros.</li>
                    <li>Intentar obtener acceso no autorizado a la Aplicación o a sus sistemas relacionados.</li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Propiedad Intelectual">
                <p>
                    La Aplicación y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de VisionAI Pro Model e5 y sus licenciantes. Usted no adquiere ningún derecho de propiedad sobre el contenido que sube, pero nos concede una licencia limitada para procesar dicho contenido con el fin de proporcionar el servicio de análisis.
                </p>
            </LegalSection>
            
            <LegalSection title="4. Descargo de Responsabilidad">
                <p>
                    Los análisis proporcionados por VisionAI Pro Model e5 son generados por un modelo de inteligencia artificial y se ofrecen "tal cual". No garantizamos la exactitud, integridad o fiabilidad de ningún análisis. Usted reconoce que los resultados pueden contener errores o imprecisiones y que no somos responsables de ninguna decisión que tome basándose en los resultados proporcionados por la Aplicación. Siempre debe verificar la información de forma independiente.
                </p>
            </LegalSection>

            <LegalSection title="5. Limitación de Responsabilidad">
                <p>
                    En la máxima medida permitida por la ley aplicable, en ningún caso VisionAI Pro Model e5 o sus directores, empleados o agentes serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo que resulte de su acceso o uso de la Aplicación.
                </p>
            </LegalSection>

            <LegalSection title="6. Modificaciones de los Términos">
                <p>
                    Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que los nuevos términos entren en vigor.
                </p>
            </LegalSection>
        </div>
    );
};