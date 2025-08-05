// ABOUTME: Client portal page for viewing individual project details
// ABOUTME: Secure client access to project status, milestones, and communications

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientDashboard } from '@/features/consulting/components/client-portal/client-dashboard';
import { getClientProject } from '@/features/consulting/queries/get-client-projects';

interface ClientPortalPageProps {
  params: {
    projectId: string;
  };
}

export async function generateMetadata({ params }: ClientPortalPageProps): Promise<Metadata> {
  const project = await getClientProject(params.projectId);
  
  if (!project) {
    return {
      title: 'Project Not Found | Client Portal'
    };
  }

  return {
    title: `${project.projectName} | Client Portal`,
    description: `Track progress and view updates for your ${project.projectType.toLowerCase()} project with MenFem.`,
    robots: 'noindex, nofollow' // Keep client portals private from search engines
  };
}

export default async function ClientPortalPage({ params }: ClientPortalPageProps) {
  const project = await getClientProject(params.projectId);

  if (!project) {
    notFound();
  }

  // TODO: Add authentication check to ensure client can access this project
  // This should verify the client's email matches the inquiry email
  // or they have been granted access to this project

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
            <div className="text-sm text-gray-500">
              Project ID: {project.id.slice(-8).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <ClientDashboard project={project} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-gray-500">
            <p className="mb-2">Need help or have questions about your project?</p>
            <p>
              Contact your project manager: {project.inquiry.assignedConsultant?.email || 'contact@menfem.com'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}