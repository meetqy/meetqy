"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import React from "react";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { NameFormSchema, NameFormType } from "@/types/name";
import { useCompletion } from "ai/react";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyButton } from "@/components/ui/copy-button";

const defaultValues = {
  fullName: "",
  gender: "Man",
  description: "",
};

const NameForm = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NameFormType>({
    resolver: zodResolver(NameFormSchema),
    defaultValues,
  });

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/chat",
  });

  const onSubmit = async (data: NameFormType) => {
    try {
      await complete("", { body: data });
    } catch (error) {
      console.error("Failed to generate:", error);
      toast({
        title: error instanceof Error ? error.message : "An unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={"w-full"}>
      <section className="font-base">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2 mt-4">
            <Label htmlFor="fullName" className="font-semibold">
              Full Name
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder={"John Doe"}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={"I am a software engineer"}
              className="h-20"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gender" className="font-semibold">
              Gender
            </Label>
            <RadioGroup
              defaultValue="Man"
              className={"flex gap-4"}
              id="gender"
              onValueChange={(value) => {
                setValue("gender", value, { shouldValidate: true });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Man" id="r1" />
                <Label htmlFor="r1">Man</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Female" id="r2" />
                <Label htmlFor="r2">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Non-binary" id="r3" />
                <Label htmlFor="r3">Non-binary</Label>
              </div>
            </RadioGroup>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "🪄 Generate"
            )}
          </Button>
        </form>
        {completion && (
          <div className={"mt-8"}>
            <Alert>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Generate Result</AlertTitle>
                </div>
                <CopyButton value={completion} />
              </div>
              <AlertDescription className="">
                <ScrollArea className="h-[120px] w-full  ">
                  <div className="prose dark:prose-invert max-w-none ">
                    <ReactMarkdown>{completion}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </section>
    </div>
  );
};
export default NameForm;
