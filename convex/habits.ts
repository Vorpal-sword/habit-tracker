import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const createHabit = mutation({
  args: {
    name: v.string(),
    documentId: v.id("documents"),
    days: v.number(), // Number of days for the habit
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const habit = await ctx.db.insert("habits", {
      name: args.name,
      userId,
      documentId: args.documentId,
      days: Array(args.days).fill("white"),
      comments: Array(args.days).fill(""),
      createdAt: new Date().toISOString(),
    });

    return habit;
  },
});

export const getHabitsByDocumentId = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_document", (q) =>
        q.eq("userId", userId).eq("documentId", args.documentId)
      )
      .collect();

    return habits;
  },
});

export const updateHabitDays = mutation({
  args: {
    habitId: v.id("habits"),
    days: v.array(v.string()),
    comments: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingHabit = await ctx.db.get(args.habitId);

    if (!existingHabit) {
      throw new Error("Not found");
    }

    if (existingHabit.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const habit = await ctx.db.patch(args.habitId, {
      days: args.days,
      comments: args.comments,
    });

    return habit;
  },
});

export const updateHabit = mutation({
  args: { habitId: v.id("habits"), name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingHabit = await ctx.db.get(args.habitId);

    if (!existingHabit) {
      throw new Error("Not found");
    }

    if (existingHabit.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const habit = await ctx.db.patch(args.habitId, {
      name: args.name,
    });

    return habit;
  },
});

export const deleteHabit = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingHabit = await ctx.db.get(args.habitId);

    if (!existingHabit) {
      throw new Error("Not found");
    }

    if (existingHabit.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.habitId);
  },
});
