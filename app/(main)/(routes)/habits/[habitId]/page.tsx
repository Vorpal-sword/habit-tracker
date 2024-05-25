"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";

interface HabitIdPageProps {
  params: {
    habitId: Id<"habits">;
  };
}

const HabitIdPage = ({ params }: HabitIdPageProps) => {
  const habit = useQuery(api.habits.getById, {
    habitId: params.habitId,
  });

  if (habit === undefined) {
    return <div>Loading...</div>;
  }

  if (habit === null) {
    return <div>Not Found</div>;
  }

  return (
    <div className="pb-40">
      <div className="h-[35vh]" />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={habit} />
      </div>
    </div>
  );
};

export default HabitIdPage;
