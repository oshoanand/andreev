
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareText } from 'lucide-react';
import { FeedbackDialog } from './FeedbackDialog';
import { cn } from '@/lib/utils';

export function FeedbackButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        size="lg"
        className={cn(
          "fixed bottom-6 right-6 z-50 shadow-lg rounded-full h-14 w-14 p-0 sm:h-auto sm:w-auto sm:px-4 sm:py-2",
          "bg-card hover:bg-muted border-border" 
        )}
        aria-label="Open feedback form"
      >
        <MessageSquareText className="h-6 w-6 sm:mr-0 sm:group-hover:mr-2 transition-all duration-200" />
        <span className="hidden sm:inline sm:group-hover:inline">Feedback</span>
      </Button>
      <FeedbackDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
