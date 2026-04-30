import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: { 
    name: v.string(),
    workspaceId: v.id("workspaces"),
    description: v.optional(v.string()),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    // To be implemented when connecting to Convex
    return null;
  },
});

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    // To be implemented when connecting to Convex
    return [];
  },
});

export const get = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    // To be implemented when connecting to Convex
    return null;
  },
});
