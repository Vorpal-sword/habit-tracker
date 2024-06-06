"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
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
}
