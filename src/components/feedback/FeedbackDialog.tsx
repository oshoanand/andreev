
"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { UserFeedback } from '@/lib/types';

const feedbackSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comments: z.string().min(10, "Comments must be at least 10 characters long.").max(1000, "Comments must be 1000 characters or less."),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ isOpen, onOpenChange }: FeedbackDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      comments: '',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    try {
      const feedbackData: Omit<UserFeedback, 'id' | 'timestamp'> & { timestamp: any } = {
        rating: data.rating,
        comments: data.comments,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        userId: currentUser?.uid || null,
        userEmail: currentUser?.email || null,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'userFeedback'), feedbackData);
      
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback!',
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Could not submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Share Your Feedback</DialogTitle>
          <DialogDescription>
            We value your input! Let us know how we can improve.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div>
            <Label htmlFor="rating" className="mb-2 block">Your Rating</Label>
            <Controller
              name="rating"
              control={form.control}
              render={({ field }) => (
                <>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.onChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${star} out of 5 stars`}
                        className="p-1"
                      >
                        <Star
                          className={cn(
                            "h-7 w-7 cursor-pointer transition-colors",
                            (hoverRating >= star || field.value >= star)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground hover:text-yellow-300"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  {form.formState.errors.rating && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.rating.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <Label htmlFor="comments">Comments</Label>
             <Controller
              name="comments"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  id="comments"
                  placeholder="Tell us more about your experience..."
                  className="mt-1 min-h-[100px]"
                  {...field}
                />
              )}
            />
            {form.formState.errors.comments && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.comments.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
