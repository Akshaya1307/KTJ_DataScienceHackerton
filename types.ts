
export enum ConsistencyStatus {
  CONSISTENT = 1,
  CONTRADICT = 0,
  PENDING = -1
}

export interface BackstoryClaim {
  id: string;
  claim: string;
  category: 'early-life' | 'belief' | 'ambition' | 'rule';
}

export interface EvidencePair {
  excerpt: string;
  claimId: string;
  analysis: string;
}

export interface ReasoningState {
  beliefStrength: number; // 0 to 1
  activeNeurons: string[];
  lastUpdate: string;
}

export interface AnalysisResult {
  status: ConsistencyStatus;
  rationale: string;
  evidence: EvidencePair[];
  internalStates: ReasoningState[];
}

export interface ProcessingChunk {
  text: string;
  index: number;
}
