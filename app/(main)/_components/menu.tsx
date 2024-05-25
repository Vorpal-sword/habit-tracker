"use client";

import { Id } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { MoreHorizontal, Trash } from "lucide-react";

import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuProps {
  habitId: Id<"habits">;
}

export const Menu = ({ habitId }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.habits.archive);

  const onArchive = () => {
    const promise = archive({ id: habitId });

    toast.promise(promise, {
      loading: "Moving to trash",
      success: "Note moved to trash",
      error: "Failed to archive note.",
    });

    router.push("/habits");
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4"></MoreHorizontal>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60"
          align="end"
          alignOffset={8}
          forceMount
        >
          <DropdownMenuItem onClick={onArchive}>
            <Trash className="h-4 w-4 mr-2">Delete</Trash>
          </DropdownMenuItem>
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <div className="text-xs text-muted-foreground p-2">
            Last edited by: {user?.firstName}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10"></Skeleton>;
};
