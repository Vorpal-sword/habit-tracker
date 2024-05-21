"use client";

import { ChevronsLeftRight } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/clerk-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserItem = () => {
  const { user } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          role="button"
          className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
        >
          <div className="gap-x-2 flex items-center">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.imageUrl}></AvatarImage>
            </Avatar>
            <span className="text-star font-medium line-clamp-1">
              {user?.firstName}&apos;s Habits
            </span>
            <ChevronsLeftRight className="rotate-90 ml-1 text-muted-foreground h-4 w-4"></ChevronsLeftRight>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.emailAddresses[0].emailAddress}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondery p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl}></AvatarImage>
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm line-clamp-1">
                {user?.fullName}&apos;s Habits
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem
          asChild
          className="w-full cursor-pointer text-muted-foreground"
        >
          <SignOutButton>Log out</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
