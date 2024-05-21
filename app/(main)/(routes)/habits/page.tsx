"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";

const HabitsPage = () => {
  // const { user } = useUser();
  const create = useMutation(api.habits.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" });

    toast.promise(promise, {
      loading: "Creating a new note ...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      Ooops, you have empty list of Habits...
      <p>Please Create 1 Below </p>
      <Image
        src="/sad-box.png"
        height="200"
        width="200"
        alt="Sad Box"
        className="dark:hidden"
      ></Image>
      <Image
        src="/sad-box-dark.png"
        height="200"
        width="200"
        alt="Sad Box"
        className="hidden dark:block"
      ></Image>
      <h2 className="text-lg font-medium">Welcome to LevelUp</h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2"></PlusCircle>
        Create a Habit
      </Button>
    </div>
  );
};

export default HabitsPage;
