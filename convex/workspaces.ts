import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // To be implemented when connecting to Convex
    // 1. Check auth
    // 2. Create workspace
    // 3. Create owner member record
    // 4. Create #general channel
    console.log("Mock implementation for workspaces.create", args);
    return null;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    // To be implemented when connecting to Convex
    return [];
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    // To be implemented when connecting to Convex
    return null;
  },
});

export const join = mutation({
  args: { joinCode: v.string() },
  handler: async (ctx, args) => {
    // To be implemented when connecting to Convex
    return null;
  },
});
