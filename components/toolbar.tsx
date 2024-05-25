"use client";

import { useRef, useState, ElementRef } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import TexareaAutosize from "react-textarea-autosize";

interface ToolbarProps {
  initialData: Doc<"habits">;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditting, setIsEditting] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.habits.update);

  const enableInput = () => {
    if (preview) return;

    setIsEditting(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditting(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={() => {}}>
            <p className="text-6-xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
            <Button
              onClick={() => {}}
              className="rounded-full opacity-0 group-hover/icon:opacity-100 transition"
              variant="outline"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </IconPicker>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6-xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker onChange={() => {}} asChild>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={() => {}}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2"></ImageIcon>
            Add Cover
          </Button>
        )}
      </div>
      {isEditting && !preview ? (
        <TexareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5-xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        ></TexareaAutosize>
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5-xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};
