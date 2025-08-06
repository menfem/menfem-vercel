// ABOUTME: Course completion certificate component with download functionality
// ABOUTME: Generates professional certificates for completed courses

'use client';

import { useState, useRef } from 'react';
import { Download, Share2, Trophy, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CourseCertificateProps {
  certificate: {
    id: string;
    studentName: string;
    courseTitle: string;
    completedAt: Date;
    instructorName: string;
    organizationName: string;
    certificateNumber: string;
    courseDuration: string;
    skills: string[];
  };
  downloadable?: boolean;
  shareable?: boolean;
}

export function CourseCertificate({
  certificate,
  downloadable = true,
  shareable = true
}: CourseCertificateProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: 1200,
        height: 800,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${certificate.courseTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate of Completion - ${certificate.courseTitle}`,
          text: `I just completed ${certificate.courseTitle} and earned my certificate!`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      const text = `I just completed ${certificate.courseTitle} and earned my certificate! 🎉\n\nCertificate #${certificate.certificateNumber}`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Certificate Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Certificate</h1>
          <p className="text-gray-600">Certificate #{certificate.certificateNumber}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {shareable && (
            <Button variant="outline" onClick={shareCertificate}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          {downloadable && (
            <Button onClick={downloadCertificate} disabled={isGenerating}>
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          )}
        </div>
      </div>

      {/* Certificate */}
      <div 
        ref={certificateRef}
        className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-2xl p-12 relative overflow-hidden"
        style={{ width: '1200px', height: '800px', margin: '0 auto' }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-600 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
            <Trophy className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Certificate of Completion</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-8 relative z-10">
          <div>
            <p className="text-xl text-gray-700 mb-4">This is to certify that</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2 mx-auto inline-block">
              {certificate.studentName}
            </h2>
          </div>

          <div>
            <p className="text-xl text-gray-700 mb-2">has successfully completed the course</p>
            <h3 className="text-3xl font-semibold text-blue-600 mb-6">
              {certificate.courseTitle}
            </h3>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md p-4 border">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Completed on</p>
                <p className="font-semibold text-gray-900">{formatDate(certificate.completedAt)}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md p-4 border">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{certificate.courseDuration}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md p-4 border">
                <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Certificate #</p>
                <p className="font-semibold text-gray-900">{certificate.certificateNumber}</p>
              </div>
            </div>
          </div>

          {/* Skills Learned */}
          {certificate.skills.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-4">Skills and Competencies Demonstrated:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {certificate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end relative z-10">
          <div className="text-left">
            <div className="border-t-2 border-gray-400 pt-2 mb-2" style={{ width: '200px' }}>
              <p className="text-lg font-semibold text-gray-900">{certificate.instructorName}</p>
              <p className="text-sm text-gray-600">Course Instructor</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-1">{certificate.organizationName}</p>
            <p className="text-sm text-gray-600">Educational Institution</p>
          </div>

          <div className="text-right">
            <div className="border-t-2 border-gray-400 pt-2 mb-2" style={{ width: '200px' }}>
              <p className="text-lg font-semibold text-gray-900">Date Issued</p>
              <p className="text-sm text-gray-600">{formatDate(certificate.completedAt)}</p>
            </div>
          </div>
        </div>

        {/* Decorative Border */}
        <div className="absolute inset-4 border-4 border-gradient-to-r from-blue-600 to-purple-600 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-6 border-2 border-gray-300 rounded-lg pointer-events-none"></div>
      </div>

      {/* Certificate Verification */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate Verification</h3>
        <p className="text-gray-600 mb-4">
          This certificate can be verified using the certificate number: 
          <code className="mx-2 px-2 py-1 bg-gray-200 rounded text-sm font-mono">
            {certificate.certificateNumber}
          </code>
        </p>
        <p className="text-sm text-gray-500">
          Visit our verification portal to confirm the authenticity of this certificate.
        </p>
      </div>
    </div>
  );
}