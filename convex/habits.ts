import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const archive = mutation({
  args: { id: v.id("habits") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingHabit = await ctx.db.get(args.id);

    if (!existingHabit) {
      throw new Error("Not found");
    }

    if (existingHabit.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (habitId: Id<"habits">) => {
      const children = await ctx.db
        .query("habits")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentHabit", habitId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: true });

        await recursiveArchive(child._id);
      }
    };

    const habit = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id);

    return habit;
  },
});

export const getSidebar = query({
  args: {
    parentHabit: v.optional(v.id("habits")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentHabit", args.parentHabit)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

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
