import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    externalId: v.string(), // Clerk's user ID
    email: v.string(),
  }).index("by_externalId", ["externalId"]),
});
