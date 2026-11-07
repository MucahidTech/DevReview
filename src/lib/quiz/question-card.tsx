"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    codeSnippet: string | null;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
    difficulty: string;
  };
  highlightedCodeHtml?: string;
}

export function QuestionCard({ question, highlightedCodeHtml }: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const isCorrect = selectedIndex === question.correctAnswer;

  const handleSelect = (value: string) => {
    if (hasAnswered) return;
    const index = Number(value);
    setSelectedIndex(index);
    setHasAnswered(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{question.text}</CardTitle>
          <Badge variant="secondary">{question.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {highlightedCodeHtml && (
          <div
            className="overflow-x-auto rounded-md border text-sm [&_pre]:m-0 [&_pre]:p-4"
            dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }}
          />
        )}

        <RadioGroup
          value={selectedIndex !== null ? String(selectedIndex) : null}
          onValueChange={handleSelect}
          disabled={hasAnswered}
          className="flex flex-col gap-2"
        >
          {question.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isCorrectOption = index === question.correctAnswer;
            const showCorrect = hasAnswered && isCorrectOption;
            const showWrong = hasAnswered && isSelected && !isCorrectOption;

            return (
              <Label
                key={index}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors",
                  !hasAnswered && "hover:bg-accent",
                  showCorrect && "border-green-500 bg-green-500/10",
                  showWrong && "border-red-500 bg-red-500/10",
                  hasAnswered && !isSelected && !isCorrectOption && "opacity-60",
                )}
              >
                <RadioGroupItem value={String(index)} />
                <span className="flex-1 text-sm">{option}</span>
                {showCorrect && <Check className="h-4 w-4 text-green-600" />}
                {showWrong && <X className="h-4 w-4 text-red-600" />}
              </Label>
            );
          })}
        </RadioGroup>

        {hasAnswered && (
          <div
            className={cn(
              "rounded-md border p-4 text-sm",
              isCorrect ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5",
            )}
          >
            <p className="mb-1 font-medium">{isCorrect ? "Correct!" : "Incorrect"}</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
