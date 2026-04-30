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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!member || (member.role !== "owner" && member.role !== "admin")) {
      throw new Error("Unauthorized to create channels");
    }

    const channelId = await ctx.db.insert("channels", {
      name: args.name.replace(/\s+/g, "-").toLowerCase(),
      workspaceId: args.workspaceId,
      description: args.description,
      isPrivate: args.isPrivate,
      createdAt: Date.now(),
    });

    return channelId;
  },
});

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!member) return [];

    return await ctx.db
      .query("channels")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const get = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const channel = await ctx.db.get(args.channelId);
    if (!channel) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", channel.workspaceId)
      )
      .unique();

    if (!member) return null;

    return channel;
  },
});
