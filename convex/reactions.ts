import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    // Check if reaction exists
    const existingReaction = await ctx.db
      .query("reactions")
      .withIndex("by_messageId_and_userId_and_emoji", (q) =>
        q
          .eq("messageId", args.messageId)
          .eq("userId", user._id)
          .eq("emoji", args.emoji)
      )
      .unique();

    if (existingReaction) {
      // Remove reaction if it exists
      await ctx.db.delete(existingReaction._id);
      return false; // Indicating it was removed
    } else {
      // Add reaction if it doesn't exist
      await ctx.db.insert("reactions", {
        messageId: args.messageId,
        userId: user._id,
        emoji: args.emoji,
      });
      return true; // Indicating it was added
    }
  },
});

export const listByMessage = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_messageId", (q) => q.eq("messageId", args.messageId))
      .collect();

    // Group by emoji
    const grouped = reactions.reduce((acc, curr) => {
      if (!acc[curr.emoji]) {
        acc[curr.emoji] = {
          emoji: curr.emoji,
          count: 0,
          userIds: [],
        };
      }
      acc[curr.emoji].count += 1;
      acc[curr.emoji].userIds.push(curr.userId);
      return acc;
    }, {} as Record<string, { emoji: string; count: number; userIds: string[] }>);

    return Object.values(grouped);
  },
});
