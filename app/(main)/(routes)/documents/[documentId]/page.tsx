"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import Toolbar from "@/components/toolbar";
import Cover from "@/components/cover";
import ConfirmModal from "@/components/modals/confirm-modal";
import { FaTimes } from "react-icons/fa";

interface Habit {
  _id: Id<"habits">;
  name: string;
  userId: string;
  documentId: Id<"documents">;
  days: string[];
  comments: string[];
  createdAt: string;
}

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  const habits = useQuery(api.habits.getHabitsByDocumentId, {
    documentId: params.documentId,
  });

  const updateHabitDays = useMutation(api.habits.updateHabitDays);
  const createHabit = useMutation(api.habits.createHabit);
  const updateHabit = useMutation(api.habits.updateHabit);
  const deleteHabit = useMutation(api.habits.deleteHabit);

  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDays, setNewHabitDays] = useState(30); // Default to 30 days

  const handleDayClick = (habit: Habit, dayIndex: number) => {
    const currentDate = new Date();
    const habitStartDate = new Date(habit.createdAt);
    const diffDays = Math.floor(
      (currentDate.getTime() - habitStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayIndex <= diffDays) {
      if (dayIndex === diffDays) {
        const updatedDays = [...habit.days];
        updatedDays[dayIndex] =
          updatedDays[dayIndex] === "green" ? "red" : "green";
        updateHabitDays({
          habitId: habit._id,
          days: updatedDays,
          comments: habit.comments,
        });
      }
    } else {
      const updatedComments = [...habit.comments];
      updatedComments[dayIndex] =
        prompt("Enter your comment for this day:") || "";
      updateHabitDays({
        habitId: habit._id,
        days: habit.days,
        comments: updatedComments,
      });
    }
  };

  const addHabit = () => {
    if (!newHabitName.trim()) {
      alert("Please enter a habit name.");
      return;
    }

    createHabit({
      name: newHabitName,
      documentId: params.documentId,
      days: newHabitDays,
    });
    setNewHabitName("");
    setNewHabitDays(30); // Reset to default
  };

  const [editedHabitId, setEditedHabitId] = useState<Id<"habits"> | null>(null);
  const [editedHabitName, setEditedHabitName] = useState("");

  const startEditingHabit = (habit: Habit) => {
    setEditedHabitId(habit._id);
    setEditedHabitName(habit.name);
  };

  const saveHabitName = (habitId: Id<"habits">) => {
    updateHabit({ habitId, name: editedHabitName });
    setEditedHabitId(null);
    setEditedHabitName("");
  };

  const removeHabit = (habitId: Id<"habits">) => {
    deleteHabit({ habitId });
  };

  if (document === undefined || habits === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />

        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4 flex justify-center items-center">
            Habits
          </h2>
          <div className="space-y-4">
            {habits.map((habit: Habit) => (
              <div
                key={habit._id}
                className="relative flex items-center justify-between p-4 bg-purple-100 border border-fuchsia-900"
              >
                <div className="flex items-center space-x-4 ">
                  {editedHabitId === habit._id ? (
                    <input
                      className="flex-shrink-0 w-44 p-2 bg-white border border-fuchsia-900"
                      value={editedHabitName}
                      onChange={(e) => setEditedHabitName(e.target.value)}
                      onBlur={() => saveHabitName(habit._id)}
                    />
                  ) : (
                    <div
                      className="flex-shrink-0 w-44 items-center flex justify-center  cursor-pointer"
                      onClick={() => startEditingHabit(habit)}
                    >
                      <span className="text-xl break-words w-full items-center text-center ">
                        {habit.name}
                      </span>
                    </div>
                  )}
                  <div className="my-1">
                    <div className="flex space-x-1 mt-1 ">
                      <div className="flex flex-wrap items-center justify-center">
                        {habit.days.map((day, index) => (
                          <div
                            key={index}
                            className={`w-10 h-10 mb-1 mr-1 flex items-center justify-center ${
                              index <
                              Math.floor(
                                (new Date().getTime() -
                                  new Date(habit.createdAt).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                                ? "border-gray-100"
                                : ""
                            } ${
                              day === "green"
                                ? "bg-green-500"
                                : day === "red"
                                ? "bg-red-500"
                                : habit.comments[index]
                                ? "bg-yellow-200"
                                : "bg-white"
                            } border border-gray-700 cursor-pointer`}
                            onClick={() => handleDayClick(habit, index)}
                          >
                            <div
                              key={index}
                              className={`${
                                index <
                                Math.floor(
                                  (new Date().getTime() -
                                    new Date(habit.createdAt).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )
                                  ? "frozen "
                                  : ""
                              }`}
                            >
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <ConfirmModal onConfirm={() => removeHabit(habit._id)}>
                  <FaTimes className="absolute top-2 right-2 cursor-pointer" />
                </ConfirmModal>
              </div>
            ))}
            <div className="flex space-x-4">
              <input
                className="flex-1 border border-gray-300 p-2"
                type="text"
                placeholder="New habit name"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
              />
              <input
                className="flex-1 border border-gray-300 p-2"
                type="number"
                placeholder="Number of days"
                value={newHabitDays}
                onChange={(e) => setNewHabitDays(Number(e.target.value))}
              />
              <button
                className="px-4 py-2 bg-green-500 text-white"
                onClick={addHabit}
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
        <Editor
          onChange={(content) => update({ id: params.documentId, content })}
          initialContent={document.content}
        />
      </div>
    </div>
  );
}
