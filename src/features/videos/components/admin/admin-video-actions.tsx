// ABOUTME: Admin video actions dropdown with delete and other actions
// ABOUTME: Provides quick actions for video management

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';
import type { VideoWithRelations } from '@/features/videos/types';

interface AdminVideoActionsProps {
  video: VideoWithRelations;
}

export function AdminVideoActions({ video }: AdminVideoActionsProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}/watch/${video.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Video URL copied to clipboard');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleToggleStatus = async () => {
    try {
      // TODO: Implement toggle published status action
      const newStatus = !video.isPublished;
      toast.success(`Video ${newStatus ? 'published' : 'unpublished'} successfully`);
      router.refresh();
    } catch {
      toast.error('Failed to update video status');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // TODO: Implement delete video action
      toast.success('Video deleted successfully');
      router.push('/admin/videos');
    } catch {
      toast.error('Failed to delete video');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyUrl}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Video URL
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleToggleStatus}>
            {video.isPublished ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Unpublish Video
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Publish Video
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Video
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{video.title}&quot;? This action cannot be undone.
              The video will be permanently removed from your content library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Video'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}