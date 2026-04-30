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
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId))
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...messages,
      page: await Promise.all(
        messages.page.map(async (msg) => {
          const author = await ctx.db.get(msg.authorId);
          return {
            ...msg,
            author,
          };
        })
      ),
    };
  },
});
