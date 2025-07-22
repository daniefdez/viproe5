@@ .. @@
import React, { useState } from 'react';
import { View } from '../App';
import { IconChip, IconLayers, IconZap, IconShieldCheck, IconEye, IconCode, IconBrain, IconWand, IconGallery, IconPhoto } from './icons';
+import { ArtGallery } from './ArtGallery';

interface HomeProps {
    setView: (view: View) => void;
}

@@ .. @@
export const Home: React.FC<HomeProps> = ({ setView }) => {
    const [activeTab, setActiveTab] = useState<'studio' | 'forensic' | 'api'>('studio');
    
    const featuresData = {
@@ .. @@
                    <TabButton title="API para Desarrolladores" icon={<IconCode className="w-5 h-5" />} isActive={activeTab === 'api'} onClick={() => setActiveTab('api')} />
                </div>

                {/* Tab Content */}
                <div className="relative min-h-[500px]">
                   {activeTab === 'studio' && <TabContent {...featuresData.studio} setView={setView} />}
                   {activeTab === 'forensic' && <TabContent {...featuresData.forensic} setView={setView} />}
                   {activeTab === 'api' && <TabContent {...featuresData.api} setView={setView} />}
                </div>
            </section>
+
+            {/* Art Gallery Section */}
+            <section className="w-full max-w-7xl mx-auto py-20">
+                <ArtGallery onRemix={(prompt) => {
+                    // Store the prompt for the creative studio
+                    localStorage.setItem('remixPrompt', prompt);
+                    setView('studio');
+                }} />
+            </section>
        </div>
    );
};