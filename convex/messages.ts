import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const send = mutation({
  args: {
    channelId: v.id("channels"),
    workspaceId: v.id("workspaces"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // To be implemented when connecting to Convex
    return null;
  },
});

export const list = query({
  args: {
    channelId: v.id("channels"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // To be implemented when connecting to Convex
    return {
      page: [],
      isDone: true,
      continueCursor: "",
    };
  },
});
