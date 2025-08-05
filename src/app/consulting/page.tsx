// ABOUTME: Consulting services page with inquiry form
// ABOUTME: Public-facing page for B2B lead generation and consulting services

import { Metadata } from 'next';
import { ConsultingInquiryForm } from '@/features/consulting/components/consulting-inquiry-form';

export const metadata: Metadata = {
  title: 'Consulting Services | MenFem',
  description: 'Transform your brand with expert consulting in brand strategy, content development, community building, and AI integration. Get started with a free consultation.',
  keywords: ['consulting', 'brand strategy', 'content strategy', 'AI integration', 'business consulting'],
  openGraph: {
    title: 'Expert Consulting Services | MenFem',
    description: 'Transform your brand with expert consulting in brand strategy, content development, community building, and AI integration.',
    type: 'website'
  }
};

export default function ConsultingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Transform Your Brand with Expert Consulting
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From brand strategy to AI integration, we help forward-thinking companies 
            build authentic connections with their audiences and scale their impact.
          </p>
        </div>

        {/* Services Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <ServiceCard
            title="Brand Strategy"
            description="Develop a compelling brand identity that resonates with your target audience"
            features={[
              'Brand positioning & messaging',
              'Competitive analysis',
              'Visual identity guidance',
              'Brand guidelines'
            ]}
            icon="🎯"
          />
          
          <ServiceCard
            title="Content Strategy"
            description="Create content that engages, educates, and converts your audience"
            features={[
              'Content audit & strategy',
              'Editorial calendar planning',
              'Content performance optimization',
              'Multi-platform distribution'
            ]}
            icon="📝"
          />
          
          <ServiceCard
            title="Community Building"
            description="Build engaged communities that drive business growth"
            features={[
              'Community strategy development',
              'Platform selection & setup',
              'Engagement frameworks',
              'Growth & retention tactics'
            ]}
            icon="👥"
          />
          
          <ServiceCard
            title="AI Integration"
            description="Leverage AI to streamline operations and enhance customer experience"
            features={[
              'AI strategy development',
              'Tool selection & implementation',
              'Workflow automation',
              'Performance measurement'
            ]}
            icon="🤖"
          />
          
          <ServiceCard
            title="Market Research"
            description="Data-driven insights to inform strategic decisions"
            features={[
              'Market analysis',
              'Competitor research',
              'Audience insights',
              'Trend identification'
            ]}
            icon="📊"
          />
          
          <ServiceCard
            title="Speaking & Advisory"
            description="Industry expertise for events, boards, and strategic guidance"
            features={[
              'Keynote presentations',
              'Workshop facilitation',
              'Board advisory services',
              'Strategic consulting'
            ]}
            icon="🎤"
          />
        </div>

        {/* Consultation Form */}
        <ConsultingInquiryForm />

        {/* Why Choose Us */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Results</h3>
              <p className="text-slate-600">
                See measurable improvements within 30 days of implementation.
              </p>
            </div>
            
            <div className="p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Proven Expertise</h3>
              <p className="text-slate-600">
                Leveraging years of experience building successful brands and communities.
              </p>
            </div>
            
            <div className="p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Partnership Approach</h3>
              <p className="text-slate-600">
                We work as an extension of your team, not just another vendor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  icon: string;
}

function ServiceCard({ title, description, features, icon }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="text-3xl mb-4 text-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
      <p className="text-slate-600 mb-4 text-center">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-slate-600">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3 flex-shrink-0"></span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}