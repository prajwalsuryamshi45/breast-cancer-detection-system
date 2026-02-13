import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  patients: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    dateOfBirth: v.string(),
    medicalHistory: v.optional(v.string()),
    createdBy: v.id("users"),
  }).index("by_email", ["email"])
    .index("by_created_by", ["createdBy"]),

  scans: defineTable({
    patientId: v.id("patients"),
    imageId: v.id("_storage"),
    scanType: v.union(v.literal("mammography"), v.literal("ultrasound"), v.literal("mri")),
    scanDate: v.string(),
    notes: v.optional(v.string()),
    createdBy: v.id("users"),
  }).index("by_patient", ["patientId"])
    .index("by_created_by", ["createdBy"]),

  analyses: defineTable({
    scanId: v.id("scans"),
    patientId: v.id("patients"),
    riskLevel: v.union(v.literal("low"), v.literal("moderate"), v.literal("high")),
    confidence: v.number(),
    findings: v.string(),
    recommendations: v.string(),
    aiAnalysis: v.string(),
    reviewedBy: v.optional(v.id("users")),
    reviewDate: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("reviewed"), v.literal("approved")),
    createdBy: v.id("users"),
  }).index("by_scan", ["scanId"])
    .index("by_patient", ["patientId"])
    .index("by_status", ["status"]),

  reports: defineTable({
    analysisId: v.id("analyses"),
    patientId: v.id("patients"),
    reportType: v.union(v.literal("preliminary"), v.literal("final")),
    content: v.string(),
    generatedDate: v.string(),
    createdBy: v.id("users"),
  }).index("by_analysis", ["analysisId"])
    .index("by_patient", ["patientId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
