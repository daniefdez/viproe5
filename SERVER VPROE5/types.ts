
export interface VisualElements {
  mainSubject: string;
  background: string;
  objects: string[];
}

export interface CompositionAnalysis {
  type: string;
  style: string;
  confidence: number;
}

export interface ForensicEvidence {
  type: string;
  description: string;
  area: string;
}

export interface ForensicAnalysis {
  manipulationDetected: boolean;
  confidence: number;
  evidence: ForensicEvidence[];
  summary: string;
}

export interface InferredMetadataEntry {
  field: string;
  value: string;
  warning: boolean;
  note: string;
  category: 'fecha' | 'gps' | 'camara' | 'software' | 'otro';
  risk: number; // 1 (Low), 2 (Medium), 3 (High)
}


export interface AnalysisResult {
  visualElements: VisualElements;
  compositionAnalysis: CompositionAnalysis;
  forensicAnalysis: ForensicAnalysis;
  inferredMetadata: InferredMetadataEntry[];
  imagePrompt: string;
}

export interface CreativeAnalysis {
  composition: {
    principle: string; // "Rule of Thirds", "Symmetrical Balance", etc.
    critique: string; // "The main subject is placed effectively, guiding the viewer's eye."
  };
  colorPalette: {
    mood: string; // "Warm and Inviting", "Mysterious and Cool", etc.
    dominantColors: string[]; // List of hex codes, e.g., ["#A52A2A", "#F4A460"]
    critique: string; // "The analogous colors create a harmonious and pleasing effect."
  };
  suggestion: {
    explanation: string; // "To enhance the sense of scale, try adding..."
    promptAddition: string; // "'towering ancient trees'"
  };
  overallImpression: string; // "A beautifully rendered image with a strong sense of wonder."
}

export interface CreativeAnalysisResult {
    analysis: CreativeAnalysis;
}

export type Message = {
    role: 'user' | 'ai';
    content: string;
};
