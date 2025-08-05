// ABOUTME: Component for displaying generated consulting proposals
// ABOUTME: Shows proposal details, pricing, timeline, and terms in formatted layout

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Download, 
  Mail,
  Calendar
} from 'lucide-react';
import type { ProposalData } from '../types';

interface ProposalDisplayProps {
  proposal: ProposalData;
  onDownload?: () => void;
  onSendEmail?: () => void;
  showActions?: boolean;
}

export function ProposalDisplay({ 
  proposal, 
  onDownload, 
  onSendEmail, 
  showActions = true 
}: ProposalDisplayProps) {
  const formatCurrency = (amount: number) => 
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Consulting Proposal</h1>
        <div className="text-lg text-muted-foreground">
          <p><strong>Prepared for:</strong> {proposal.clientInfo.company}</p>
          <p><strong>Contact:</strong> {proposal.clientInfo.contact}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
        </div>
        
        {showActions && (
          <div className="flex justify-center gap-3">
            <Button onClick={onDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={onSendEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Send to Client
            </Button>
          </div>
        )}
      </div>

      {/* Investment Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <DollarSign className="w-5 h-5" />
            Investment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-blue-700 mb-1">Subtotal</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(proposal.pricing.subtotal)}
              </p>
            </div>
            
            {proposal.pricing.discounts && proposal.pricing.discounts.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-green-700 mb-1">Savings</p>
                <p className="text-2xl font-bold text-green-800">
                  -{formatCurrency(
                    proposal.pricing.discounts.reduce((sum, d) => sum + d.amount, 0)
                  )}
                </p>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-sm text-blue-700 mb-1">Total Investment</p>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(proposal.pricing.total)}
              </p>
            </div>
          </div>
          
          {proposal.pricing.discounts && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm text-blue-800 mb-2">Applied Discounts:</p>
              {proposal.pricing.discounts.map((discount, index) => (
                <div key={index} className="flex justify-between text-sm text-blue-700">
                  <span>{discount.reason}</span>
                  <span>-{formatCurrency(discount.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Proposed Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {proposal.services.map((service, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Investment</p>
                      <p className="text-lg font-semibold">{formatCurrency(service.basePrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estimated Hours</p>
                      <p className="text-lg font-semibold">{service.baseHours} hours</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Includes:</p>
                    <ul className="space-y-1">
                      {service.includes.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {index < proposal.services.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Structure */}
      {proposal.pricing.milestonePayments && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Payment Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.pricing.milestonePayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Payment {index + 1}</h4>
                    <p className="text-sm text-muted-foreground">{payment.milestone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">{payment.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Payment Terms:</strong> {proposal.pricing.paymentTerms}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {proposal.timeline.map((phase, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-700">{index + 1}</span>
                    </div>
                    {index < proposal.timeline.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{phase.phase}</h3>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                    
                    {phase.dependencies && (
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Depends on:</strong> {phase.dependencies.join(', ')}
                      </p>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Deliverables:</p>
                      <ul className="space-y-1">
                        {phase.deliverables.map((deliverable, deliverableIndex) => (
                          <li key={deliverableIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deliverables Summary */}
      <Card>
        <CardHeader>
          <CardTitle>All Deliverables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {proposal.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {deliverable}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {proposal.terms.map((term, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                {term}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-green-800 font-medium">
              This proposal is valid for 30 days from the date above.
            </p>
            <p className="text-green-700">
              We look forward to partnering with you on this exciting project!
            </p>
            <p className="text-sm text-green-600">
              <strong>Next Steps:</strong> Reply to this proposal to schedule a discussion call and finalize project details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}