"use client";

import { api } from "@/convex/_generated/api";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface HabitListProps {
  parentHabitId?: Id<"habits">;
  level?: number;
  data?: Doc<"habits">[];
}

export const HabitList = ({ parentHabitId, level = 0 }: HabitListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (habitId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [habitId]: !prevExpanded[habitId],
    }));
  };

  const habits = useQuery(api.habits.getSidebar, {
    parentHabit: parentHabitId,
  });

  const onRedirect = (habitId: string) => {
    router.push(`/habits/${habitId}`);
  };

  if (habits === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No habits inside
      </p>
      {habits.map((habit) => (
        <div key={habit._id}>
          <Item
            id={habit._id}
            onClick={() => onRedirect(habit._id)}
            label={habit.title}
            icon={FileIcon}
            habitIcon={habit.icon}
            active={params.habitId === habit._id}
            level={level}
            onExpand={() => onExpand(habit._id)}
            expanded={expanded[habit._id]}
          ></Item>
          {expanded[habit._id] && (
            <HabitList parentHabitId={habit._id} level={level + 1}></HabitList>
          )}
        </div>
      ))}
    </>
  );
};
