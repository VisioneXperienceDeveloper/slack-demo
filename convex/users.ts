import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication");
    }

    // Check if we've already stored this user
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (user !== null) {
      // If we've seen this user before but their name has changed, update it.
      if (user.name !== identity.name || user.image !== identity.pictureUrl || user.email !== identity.email) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          image: identity.pictureUrl,
          email: identity.email ?? user.email,
        });
      }
      return user._id;
    }

    // If it's a new user, create them.
    return await ctx.db.insert("users", {
      name: identity.name,
      externalId: identity.subject,
      image: identity.pictureUrl,
      email: identity.email ?? "",
    });
  },
});

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();
  },
});
