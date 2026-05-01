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

    // Add creator as member
    await ctx.db.insert("channelMembers", {
      channelId,
      userId: user._id,
      role: "admin",
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

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // Filter channels: return public channels OR private channels where the user is a member
    const filteredChannels = [];
    for (const channel of channels) {
      if (!channel.isPrivate) {
        filteredChannels.push(channel);
      } else {
        const channelMember = await ctx.db
          .query("channelMembers")
          .withIndex("by_channelId_and_userId", (q) => 
            q.eq("channelId", channel._id).eq("userId", user._id)
          )
          .unique();
        
        if (channelMember) {
          filteredChannels.push(channel);
        }
      }
    }

    return filteredChannels;
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

    // If private, check channel membership
    if (channel.isPrivate) {
      const channelMember = await ctx.db
        .query("channelMembers")
        .withIndex("by_channelId_and_userId", (q) => 
          q.eq("channelId", channel._id).eq("userId", user._id)
        )
        .unique();
      
      if (!channelMember) return null;
    }

    return channel;
  },
});

export const invite = mutation({
  args: {
    channelId: v.id("channels"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const channel = await ctx.db.get(args.channelId);
    if (!channel) throw new Error("Channel not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", channel.workspaceId)
      )
      .unique();

    // Only workspace admins/owners or channel admins can invite
    const channelMember = await ctx.db
      .query("channelMembers")
      .withIndex("by_channelId_and_userId", (q) => 
        q.eq("channelId", args.channelId).eq("userId", user._id)
      )
      .unique();

    if (!member || (member.role !== "owner" && member.role !== "admin" && (!channelMember || channelMember.role !== "admin"))) {
      throw new Error("Unauthorized to invite to this channel");
    }

    // Check if user is already a member
    const existingMember = await ctx.db
      .query("channelMembers")
      .withIndex("by_channelId_and_userId", (q) => 
        q.eq("channelId", args.channelId).eq("userId", args.userId)
      )
      .unique();

    if (existingMember) return;

    await ctx.db.insert("channelMembers", {
      channelId: args.channelId,
      userId: args.userId,
      role: "member",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("channels"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const channel = await ctx.db.get(args.id);
    if (!channel) throw new Error("Channel not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", channel.workspaceId)
      )
      .unique();

    if (!member || (member.role !== "owner" && member.role !== "admin")) {
      throw new Error("Unauthorized to update channels");
    }

    const patch: any = {};
    if (args.name !== undefined) {
      patch.name = args.name.replace(/\s+/g, "-").toLowerCase();
    }
    if (args.description !== undefined) {
      patch.description = args.description;
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const channel = await ctx.db.get(args.id);
    if (!channel) throw new Error("Channel not found");

    if (channel.name === "general") {
      throw new Error("Cannot delete the general channel");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", channel.workspaceId)
      )
      .unique();

    if (!member || (member.role !== "owner" && member.role !== "admin")) {
      throw new Error("Unauthorized to delete channels");
    }

    // Delete all messages in the channel
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.id))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete all memberships
    const memberships = await ctx.db
      .query("channelMembers")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.id))
      .collect();
    
    for (const membership of memberships) {
      await ctx.db.delete(membership._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const getMembers = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const channel = await ctx.db.get(args.channelId);
    if (!channel) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return [];

    // Verify workspace membership
    const workspaceMember = await ctx.db
      .query("members")
      .withIndex("by_userId_and_workspaceId", (q) => 
        q.eq("userId", user._id).eq("workspaceId", channel.workspaceId)
      )
      .unique();

    if (!workspaceMember) return [];

    return await ctx.db
      .query("channelMembers")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId))
      .collect();
  },
});
