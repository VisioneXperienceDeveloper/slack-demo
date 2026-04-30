import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    externalId: v.string(), // Clerk's user ID
    email: v.string(),
  }).index("by_externalId", ["externalId"]),

  workspaces: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    joinCode: v.string(),       // 6-digit invite code
    createdAt: v.number(),
  }).index("by_joinCode", ["joinCode"]),

  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  })
    .index("by_userId", ["userId"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_userId_and_workspaceId", ["userId", "workspaceId"]),

  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
    description: v.optional(v.string()),
    isPrivate: v.boolean(),
    createdAt: v.number(),
    type: v.optional(v.union(v.literal("channel"), v.literal("dm"))),
  }).index("by_workspaceId", ["workspaceId"]),

  messages: defineTable({
    body: v.string(),
    authorId: v.id("users"),
    channelId: v.id("channels"),
    workspaceId: v.id("workspaces"),
    updatedAt: v.optional(v.number()),
    parentMessageId: v.optional(v.id("messages")),
    image: v.optional(v.id("_storage")),
  })
    .index("by_channelId", ["channelId"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_parentMessageId", ["parentMessageId"]),

  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  })
    .index("by_messageId", ["messageId"])
    .index("by_messageId_and_userId_and_emoji", ["messageId", "userId", "emoji"]),

  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("users"),
    memberTwoId: v.id("users"),
    channelId: v.id("channels"),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_members", ["memberOneId", "memberTwoId"]),
});
