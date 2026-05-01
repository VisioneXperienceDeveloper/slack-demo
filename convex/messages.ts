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
export const search = query({
  args: {
    workspaceId: v.id("workspaces"),
    query: v.string(),
    channelId: v.optional(v.id("channels")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const messages = await ctx.db
      .query("messages")
      .withSearchIndex("search_body", (q) => {
        const search = q.search("body", args.query).eq("workspaceId", args.workspaceId);
        return args.channelId ? search.eq("channelId", args.channelId) : search;
      })
      .take(10);


    return await Promise.all(
      messages.map(async (msg) => {
        const author = await ctx.db.get(msg.authorId);
        const channel = await ctx.db.get(msg.channelId);
        return {
          ...msg,
          author,
          channel,
        };
      })
    );
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.id);
    if (!message) throw new Error("Message not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user || user._id !== message.authorId) {
      throw new Error("Unauthorized to edit this message");
    }

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.id);
    if (!message) throw new Error("Message not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user || user._id !== message.authorId) {
      throw new Error("Unauthorized to delete this message");
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
