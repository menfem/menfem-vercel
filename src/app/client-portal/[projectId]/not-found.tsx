// ABOUTME: Not found page for client portal when project doesn't exist
// ABOUTME: Provides helpful guidance for clients who can't access their project

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Mail, Home } from 'lucide-react';
import Link from 'next/link';

export default function ClientPortalNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Project Not Found</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We couldn't find the project you're looking for. This could be because:
          </p>
          
          <ul className="text-sm text-gray-500 text-left space-y-2">
            <li>• The project ID is incorrect</li>
            <li>• The project hasn't been set up yet</li>
            <li>• You don't have access to this project</li>
            <li>• The project has been completed or archived</li>
          </ul>
          
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm text-gray-600">
              Need help accessing your project?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="mailto:contact@menfem.com" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Support
                </Link>
              </Button>
              
              <Button asChild className="flex-1">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              If you recently submitted a consulting inquiry, please allow 24-48 hours 
              for your project portal to be set up.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}