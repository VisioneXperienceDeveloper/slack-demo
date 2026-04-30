import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrGet = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const currentUserId = user._id;

    // Check if conversation already exists
    const conv1 = await ctx.db
      .query("conversations")
      .withIndex("by_members", (q) =>
        q.eq("memberOneId", currentUserId).eq("memberTwoId", args.otherUserId)
      )
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .first();

    const conv2 = await ctx.db
      .query("conversations")
      .withIndex("by_members", (q) =>
        q.eq("memberOneId", args.otherUserId).eq("memberTwoId", currentUserId)
      )
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .first();

    const existingConversation = conv1 || conv2;

    if (existingConversation) {
      return existingConversation.channelId;
    }

    // Create a new DM channel
    const otherUser = await ctx.db.get(args.otherUserId);
    if (!otherUser) throw new Error("Other user not found");

    const channelId = await ctx.db.insert("channels", {
      name: `${user.name}, ${otherUser.name}`,
      workspaceId: args.workspaceId,
      isPrivate: true,
      createdAt: Date.now(),
      type: "dm",
    });

    await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      memberOneId: currentUserId,
      memberTwoId: args.otherUserId,
      channelId,
    });

    return channelId;
  },
});

export const list = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return [];

    const currentUserId = user._id;

    const conv1 = await ctx.db
      .query("conversations")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("memberOneId"), currentUserId))
      .collect();

    const conv2 = await ctx.db
      .query("conversations")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("memberTwoId"), currentUserId))
      .collect();

    const allConversations = [...conv1, ...conv2];

    const populatedConversations = await Promise.all(
      allConversations.map(async (conv) => {
        const otherUserId =
          conv.memberOneId === currentUserId ? conv.memberTwoId : conv.memberOneId;
        const otherUser = await ctx.db.get(otherUserId);
        const channel = await ctx.db.get(conv.channelId);
        
        return {
          ...conv,
          otherUser,
          channel,
        };
      })
    );

    return populatedConversations;
  },
});
