import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const analyzeImage = action({
  args: {
    scanId: v.id("scans"),
  },
  handler: async (ctx, args): Promise<any> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get scan details
    const scan = await ctx.runQuery(api.scans.getScan, { scanId: args.scanId });
    if (!scan) {
      throw new Error("Scan not found");
    }

    // Simulate AI analysis for demonstration
    const mockAnalysisResults = [
      {
        riskLevel: "low" as const,
        confidence: 85,
        findings: "No significant abnormalities detected. Normal breast tissue architecture observed. No masses, calcifications, or architectural distortions identified.",
        recommendations: "Continue routine screening as per guidelines. Next mammogram in 12 months."
      },
      {
        riskLevel: "moderate" as const,
        confidence: 72,
        findings: "Scattered fibroglandular densities noted. Some areas of increased density that may warrant closer monitoring. No definitive masses identified.",
        recommendations: "Follow-up imaging in 6 months recommended. Consider additional views or ultrasound if symptoms develop."
      },
      {
        riskLevel: "high" as const,
        confidence: 91,
        findings: "Irregular mass detected in upper outer quadrant. Suspicious microcalcifications present. Architectural distortion noted in surrounding tissue.",
        recommendations: "Immediate biopsy recommended. Urgent referral to breast specialist. Additional imaging studies may be required."
      }
    ];

    // Randomly select one for demonstration
    const randomResult = mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)];

    // Create analysis record
    const analysisId: any = await ctx.runMutation(internal.internal.createAnalysis, {
      scanId: args.scanId,
      patientId: scan.patientId,
      riskLevel: randomResult.riskLevel,
      confidence: randomResult.confidence,
      findings: randomResult.findings,
      recommendations: randomResult.recommendations,
      aiAnalysis: `AI Analysis Complete - Risk Level: ${randomResult.riskLevel}, Confidence: ${randomResult.confidence}%`,
      createdBy: userId,
    });

    return analysisId;
  },
});

export const listAnalyses = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("analyses")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});

export const getAnalysis = query({
  args: { analysisId: v.id("analyses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis || analysis.createdBy !== userId) {
      throw new Error("Analysis not found or access denied");
    }

    return analysis;
  },
});

export const updateAnalysisStatus = mutation({
  args: {
    analysisId: v.id("analyses"),
    status: v.union(v.literal("pending"), v.literal("reviewed"), v.literal("approved")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis || analysis.createdBy !== userId) {
      throw new Error("Analysis not found or access denied");
    }

    await ctx.db.patch(args.analysisId, {
      status: args.status,
      reviewedBy: userId,
      reviewDate: new Date().toISOString(),
    });
  },
});
