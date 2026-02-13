import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const createScan = mutation({
  args: {
    patientId: v.id("patients"),
    imageId: v.id("_storage"),
    scanType: v.union(v.literal("mammography"), v.literal("ultrasound"), v.literal("mri")),
    scanDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify patient belongs to user
    const patient = await ctx.db.get(args.patientId);
    if (!patient || patient.createdBy !== userId) {
      throw new Error("Patient not found or access denied");
    }

    return await ctx.db.insert("scans", {
      ...args,
      createdBy: userId,
    });
  },
});

export const listScans = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify patient belongs to user
    const patient = await ctx.db.get(args.patientId);
    if (!patient || patient.createdBy !== userId) {
      throw new Error("Patient not found or access denied");
    }

    const scans = await ctx.db
      .query("scans")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();

    return Promise.all(
      scans.map(async (scan) => ({
        ...scan,
        imageUrl: await ctx.storage.getUrl(scan.imageId),
      }))
    );
  },
});

export const getScan = query({
  args: { scanId: v.id("scans") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const scan = await ctx.db.get(args.scanId);
    if (!scan || scan.createdBy !== userId) {
      throw new Error("Scan not found or access denied");
    }

    return {
      ...scan,
      imageUrl: await ctx.storage.getUrl(scan.imageId),
    };
  },
});
