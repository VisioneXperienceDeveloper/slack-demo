import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      ownerId: user._id,
      joinCode,
      createdAt: Date.now(),
    });

    await ctx.db.insert("members", {
      userId: user._id,
      workspaceId,
      role: "owner",
    });

    await ctx.db.insert("channels", {
      name: "general",
      workspaceId,
      isPrivate: false,
      createdAt: Date.now(),
    });

    return workspaceId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return [];

    const members = await ctx.db
      .query("members")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const workspaceIds = members.map((m) => m.workspaceId);

    const workspaces = [];
    for (const id of workspaceIds) {
      const ws = await ctx.db.get(id);
      if (ws) workspaces.push(ws);
    }

    return workspaces;
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!member) return null;

    return await ctx.db.get(args.workspaceId);
  },
});

export const getByJoinCode = query({
  args: { joinCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workspaces")
      .withIndex("by_joinCode", (q) => q.eq("joinCode", args.joinCode))
      .unique();
  },
});

export const join = mutation({
  args: { joinCode: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_joinCode", (q) => q.eq("joinCode", args.joinCode))
      .unique();

    if (!workspace) throw new Error("Workspace not found");

    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", workspace._id)
      )
      .unique();

    if (existingMember) return workspace._id;

    await ctx.db.insert("members", {
      userId: user._id,
      workspaceId: workspace._id,
      role: "member",
    });

    return workspace._id;
  },
});
