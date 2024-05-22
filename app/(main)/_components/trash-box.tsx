"use client";

import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/models/confirm-modal";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const habits = useQuery(api.habits.getTrash);
  const restore = useMutation(api.habits.restore);
  const remove = useMutation(api.habits.remove);

  const [search, setSearch] = useState("");

  const filteredHabits = habits?.filter((habits) => {
    return habits.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (habitId: string) => {
    router.push(`/habits/${habitId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    habitId: Id<"habits">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: habitId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored",
      error: "Failed to restore note.",
    });
  };

  const onRemove = (habitId: Id<"habits">) => {
    const promise = remove({ id: habitId });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted",
      error: "Failed to delete note.",
    });
    if (params.habitId === habitId) {
      router.push("/habits");
    }
  };
  if (habits === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        Loading...
      </div>
    );
  }
  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4"></Search>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by habit title..."
        ></Input>
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-ts text-center text-muted-foreground pb-2">
          No habits found.
        </p>
        {filteredHabits?.map((habit) => (
          <div
            key={habit._id}
            role="button"
            onClick={() => onClick(habit._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{habit.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, habit._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200"
              >
                <Undo className="h-4 w-4 text-muted-foreground"></Undo>
              </div>
              <ConfirmModal onConfirm={() => onRemove(habit._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200"
                >
                  <Trash className="h-4 w-4 text-muted-foreground"></Trash>
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
