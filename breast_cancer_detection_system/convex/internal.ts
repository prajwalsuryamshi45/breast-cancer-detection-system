import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createAnalysis = internalMutation({
  args: {
    scanId: v.id("scans"),
    patientId: v.id("patients"),
    riskLevel: v.union(v.literal("low"), v.literal("moderate"), v.literal("high")),
    confidence: v.number(),
    findings: v.string(),
    recommendations: v.string(),
    aiAnalysis: v.string(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyses", {
      ...args,
      status: "pending",
    });
  },
});
