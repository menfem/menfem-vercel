// ABOUTME: Premium paywall component for restricting access to premium videos
// ABOUTME: Shows subscription call-to-action when users don't have premium access

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Play } from 'lucide-react';
import type { VideoWithRelations } from '../types';

interface PremiumPaywallProps {
  video: VideoWithRelations;
}

export function PremiumPaywall({ video }: PremiumPaywallProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
      {/* Background thumbnail with overlay */}
      {video.thumbnailUrl && (
        <>
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-auto p-8">
        <div className="flex items-center justify-center mb-4">
          <Crown className="w-12 h-12 text-yellow-400" />
        </div>
        
        <Badge 
          variant="secondary" 
          className="bg-yellow-100 text-yellow-800 mb-4"
        >
          Premium Content
        </Badge>
        
        <h3 className="text-2xl font-bold mb-4">
          Unlock This Video
        </h3>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          This video is part of our premium content library. Subscribe to access 
          exclusive videos, courses, and advanced content on masculinity and personal development.
        </p>

        <div className="space-y-4">
          <Link href="/pricing">
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
              <Crown className="w-4 h-4 mr-2" />
              View Subscription Plans
            </Button>
          </Link>
          
          <Link href="/watch">
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
              Browse Free Content
            </Button>
          </Link>
        </div>

        {/* Features highlight */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-3">Premium includes:</p>
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Play className="w-3 h-3 text-green-400" />
              <span>Exclusive video library</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-3 h-3 text-green-400" />
              <span>Premium courses & workshops</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-3 h-3 text-green-400" />
              <span>Early access to new content</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}