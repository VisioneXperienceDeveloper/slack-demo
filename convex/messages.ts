import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const send = mutation({
  args: {
    channelId: v.id("channels"),
    workspaceId: v.id("workspaces"),
    body: v.string(),
    parentMessageId: v.optional(v.id("messages")),
    image: v.optional(v.id("_storage")),
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

    if (!member) throw new Error("Unauthorized to send messages");

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      authorId: user._id,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      image: args.image,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

export const list = query({
  args: {
    channelId: v.id("channels"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Only fetch main messages, not replies
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId))
      .filter((q) => q.eq(q.field("parentMessageId"), undefined))
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...messages,
      page: await Promise.all(
        messages.page.map(async (msg) => {
          const author = await ctx.db.get(msg.authorId);
          
          // Get thread count
          const replies = await ctx.db
            .query("messages")
            .withIndex("by_parentMessageId", (q) => q.eq("parentMessageId", msg._id))
            .collect();
            
          // Get reactions
          const reactions = await ctx.db
            .query("reactions")
            .withIndex("by_messageId", (q) => q.eq("messageId", msg._id))
            .collect();
            
          const groupedReactions = reactions.reduce((acc, curr) => {
            if (!acc[curr.emoji]) {
              acc[curr.emoji] = { emoji: curr.emoji, count: 0, userIds: [] };
            }
            acc[curr.emoji].count += 1;
            acc[curr.emoji].userIds.push(curr.userId);
            return acc;
          }, {} as Record<string, { emoji: string; count: number; userIds: string[] }>);

          return {
            ...msg,
            author,
            threadCount: replies.length,
            reactions: Object.values(groupedReactions),
          };
        })
      ),
    };
  },
});

export const listThread = query({
  args: {
    parentMessageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const parentMsg = await ctx.db.get(args.parentMessageId);
    if (!parentMsg) throw new Error("Parent message not found");
    
    const parentAuthor = await ctx.db.get(parentMsg.authorId);
    
    const replies = await ctx.db
      .query("messages")
      .withIndex("by_parentMessageId", (q) => q.eq("parentMessageId", args.parentMessageId))
      .order("asc")
      .collect();

    const populatedReplies = await Promise.all(
      replies.map(async (msg) => {
        const author = await ctx.db.get(msg.authorId);
        
        // Get reactions
        const reactions = await ctx.db
          .query("reactions")
          .withIndex("by_messageId", (q) => q.eq("messageId", msg._id))
          .collect();
          
        const groupedReactions = reactions.reduce((acc, curr) => {
          if (!acc[curr.emoji]) {
            acc[curr.emoji] = { emoji: curr.emoji, count: 0, userIds: [] };
          }
          acc[curr.emoji].count += 1;
          acc[curr.emoji].userIds.push(curr.userId);
          return acc;
        }, {} as Record<string, { emoji: string; count: number; userIds: string[] }>);

        return {
          ...msg,
          author,
          reactions: Object.values(groupedReactions),
        };
      })
    );
    
    return {
      parentMessage: { ...parentMsg, author: parentAuthor },
      replies: populatedReplies,
    };
  },
});
