// ABOUTME: Admin component for managing course modules and their lessons
// ABOUTME: Displays modules with expand/collapse functionality and lesson management

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Plus, 
  Video, 
  FileText, 
  Eye,
  BookOpen,
  PlayCircle 
} from 'lucide-react';
import type { CourseModuleWithLessons } from '../../types';

interface AdminCourseModulesListProps {
  modules: CourseModuleWithLessons[];
  courseId: string;
}

export function AdminCourseModulesList({ modules, courseId }: AdminCourseModulesListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No modules found</h3>
        <p className="text-muted-foreground text-center mb-4">
          Start building your course by creating the first module.
        </p>
        <Button asChild>
          <Link href={`/admin/courses/${courseId}/modules/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <ModuleCard
          key={module.id}
          module={module}
          courseId={courseId}
          isExpanded={expandedModules.has(module.id)}
          onToggle={() => toggleModule(module.id)}
          moduleNumber={index + 1}
        />
      ))}
    </div>
  );
}

function ModuleCard({ 
  module, 
  courseId, 
  isExpanded, 
  onToggle, 
  moduleNumber 
}: {
  module: CourseModuleWithLessons;
  courseId: string;
  isExpanded: boolean;
  onToggle: () => void;
  moduleNumber: number;
}) {
  const publishedLessons = module.lessons.filter(l => l.isPublished).length;
  const videoLessons = module.lessons.filter(l => l.video).length;

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Module {moduleNumber}</Badge>
                  {!module.isPublished && (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold">{module.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{module._count.lessons} lessons</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span>{videoLessons} videos</span>
                </div>

                {publishedLessons < module._count.lessons && (
                  <Badge variant="outline" className="text-xs">
                    {publishedLessons}/{module._count.lessons} published
                  </Badge>
                )}

                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/courses/${courseId}/modules/${module.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4">
            <div className="border-l-2 border-muted ml-2 pl-4 space-y-3">
              {/* Lessons */}
              {module.lessons.length > 0 ? (
                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      courseId={courseId}
                      moduleId={module.id}
                      lessonNumber={lessonIndex + 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      No lessons in this module yet
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/courses/${courseId}/modules/${module.id}/lessons/new`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Add Lesson Button */}
              {module.lessons.length > 0 && (
                <div className="pt-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/courses/${courseId}/modules/${module.id}/lessons/new`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function LessonItem({
  lesson,
  courseId,
  moduleId,
  lessonNumber,
}: {
  lesson: any;
  courseId: string;
  moduleId: string;
  lessonNumber: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {lessonNumber}
          </Badge>
          {!lesson.isPublished && (
            <Badge variant="secondary" className="text-xs">Draft</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {lesson.video ? (
            <PlayCircle className="h-4 w-4 text-blue-600" />
          ) : (
            <FileText className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium">{lesson.title}</span>
        </div>

        {lesson.video && (
          <Badge variant="outline" className="text-xs">
            Video
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/courses/${lesson.course?.product?.slug}/lessons/${lesson.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}