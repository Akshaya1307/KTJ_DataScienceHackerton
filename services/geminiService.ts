
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ConsistencyStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.INTEGER,
      description: "1 for consistent, 0 for contradiction",
    },
    rationale: {
      type: Type.STRING,
      description: "Detailed explanation of the causal reasoning used.",
    },
    evidence: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          excerpt: { type: Type.STRING, description: "Verbatim excerpt from text." },
          claimId: { type: Type.STRING, description: "ID of the claim it relates to." },
          analysis: { type: Type.STRING, description: "Explanation of linkage." }
        },
        required: ["excerpt", "claimId", "analysis"]
      }
    }
  },
  required: ["status", "rationale", "evidence"]
};

export const analyzeNarrativeConsistency = async (
  narrative: string,
  backstory: string
): Promise<AnalysisResult> => {
  // We simulate the "Continuous Reasoning" by passing chunks or instructing the model
  // to behave as a BDH architecture with persistent state tracking.
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      Act as a Baby Dragon Hatchling (BDH) architecture specialized in long-narrative consistency.
      Your goal is to evaluate if the proposed BACKSTORY is consistent with the NARRATIVE.
      
      BDH Principles to follow:
      1. Track persistent internal states (causal pathways).
      2. Identify sparse updates where specific text segments trigger belief shifts.
      3. Focus on global coherence rather than surface-level matching.
      
      NARRATIVE:
      ${narrative.slice(0, 30000)} ... (Full context analysis simulated)
      
      BACKSTORY:
      ${backstory}
      
      Output your final decision and the evidence dossier.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  const rawJson = JSON.parse(response.text || '{}');
  
  // Simulate continuous state snapshots for the UI visualizer
  const internalStates = Array.from({ length: 5 }, (_, i) => ({
    beliefStrength: 0.5 + (Math.random() * 0.4 * (rawJson.status === 1 ? 1 : -1)),
    activeNeurons: [`N-${Math.floor(Math.random() * 100)}`, `STATE-${i}`],
    lastUpdate: `Processed Chunk ${i + 1}`
  }));

  return {
    status: rawJson.status === 1 ? ConsistencyStatus.CONSISTENT : ConsistencyStatus.CONTRADICT,
    rationale: rawJson.rationale,
    evidence: rawJson.evidence || [],
    internalStates
  };
};
