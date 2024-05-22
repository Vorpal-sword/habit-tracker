import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { title } from "process";

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

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return habits;
  },
});

export const restore = mutation({
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

    const recursiveRestore = async (habitId: Id<"habits">) => {
      const children = await ctx.db
        .query("habits")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentHabit", habitId)
        )
        .collect();
      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"habits">> = {
      isArchived: false,
    };

    if (existingHabit.parentHabit) {
      const parent = await ctx.db.get(existingHabit.parentHabit);
      if (parent?.isArchived) {
        options.parentHabit = undefined;
      }
    }

    const habit = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return habit;
  },
});

export const remove = mutation({
  args: { id: v.id("habits") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingHabit = await ctx.db.get(args.id);

    if (!existingHabit) {
      throw new Error("Not Found");
    }
    if (existingHabit.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const habit = await ctx.db.delete(args.id);

    return habit;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return habits;
  },
});

export const getById = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const habit = await ctx.db.get(args.habitId);

    if (!habit) {
      throw new Error("Not found");
    }

    if (habit.isPublished && !habit.isArchived) {
      return habit;
    }

    if (!identity) {
      throw new Error("Not authentificated");
    }

    const userId = identity.subject;
    if (habit.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return habit;
  },
});

export const update = mutation({
  args: {
    id: v.id("habits"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authentificated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingHabit = await ctx.db.get(args.id);

    if (!existingHabit) {
      throw new Error("Not Found");
    }
    if (existingHabit.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const habit = await ctx.db.patch(args.id, {
      ...rest,
    });
    return habit;
  },
});
