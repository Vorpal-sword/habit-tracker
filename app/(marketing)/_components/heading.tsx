"use client";
import { useConvexAuth } from "convex/react";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

import Link from "next/link";
import { Spinner } from "../../../components/spinner";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-v-3xl space-y-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
        Habits, Plans and Schedule Welcome to{" "}
        <span className="underline">Level Up</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Level Up is a platform to improve your productivity and create new
        habits
      </h3>
      {isLoading && (
        <div className="flex items-center w-full justify-center">
          <Spinner size="lg"></Spinner>
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/habits">
            Enter LevelUp
            <ArrowRight className="h-4 w-4 ml-2"></ArrowRight>
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get LevelUp Free
            <ArrowRight className="h-4 w-4 ml-2"></ArrowRight>
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
