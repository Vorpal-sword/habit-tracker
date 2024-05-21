import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    const habits = await ctx.db.query("habits").collect();

    return habits;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentHabit: v.optional(v.id("habits")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const habit = await ctx.db.insert("habits", {
      title: args.title,
      parentHabit: args.parentHabit,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return habit;
  },
});
