// ABOUTME: Admin form component for creating and editing courses
// ABOUTME: Form with product selection, syllabus, duration, and difficulty level

'use client';

import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { createCourse } from '../../actions/create-course';
import { COURSE_LEVELS, COURSE_DURATIONS } from '../../constants';
import { formatPrice } from '@/features/products/utils/format-price';
import { toast } from 'sonner';
import type { ProductWithRelations } from '@/features/products/types';
import type { CourseWithRelations } from '../../types';
import type { ActionState } from '@/types/action-state';

interface AdminCourseFormProps {
  courseProducts: ProductWithRelations[];
  course?: CourseWithRelations;
}

const initialState: ActionState = {
  status: undefined,
  message: undefined,
};

export function AdminCourseForm({ courseProducts, course }: AdminCourseFormProps) {
  const router = useRouter();
  const isEditing = Boolean(course);
  
  const [actionState, formAction] = useActionState(
    createCourse, // TODO: Add updateCourse when editing
    initialState
  );

  // Handle form submission with toast feedback
  const handleSubmit = async (formData: FormData) => {
    const result = await formAction(formData);
    
    if (result.status === 'SUCCESS') {
      toast.success(result.message);
      if (!isEditing) {
        router.push('/admin/courses');
      }
    } else if (result.status === 'ERROR') {
      toast.error(result.message);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Product Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Course Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Select Course Product</Label>
            <Select name="productId" defaultValue={course?.productId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course product" />
              </SelectTrigger>
              <SelectContent>
                {courseProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{product.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {actionState.fieldErrors?.productId && (
              <p className="text-sm text-destructive">{actionState.fieldErrors.productId[0]}</p>
            )}
          </div>

          {courseProducts.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <p>
                The course will be linked to the selected product. Students will need to purchase 
                this product to enroll in the course.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Details */}
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Course Duration</Label>
            <Select name="duration" defaultValue={course?.duration}>
              <SelectTrigger>
                <SelectValue placeholder="Select course duration" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_DURATIONS.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {actionState.fieldErrors?.duration && (
              <p className="text-sm text-destructive">{actionState.fieldErrors.duration[0]}</p>
            )}
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label htmlFor="level">Difficulty Level</Label>
            <Select name="level" defaultValue={course?.level}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {level.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {actionState.fieldErrors?.level && (
              <p className="text-sm text-destructive">{actionState.fieldErrors.level[0]}</p>
            )}
          </div>

          {/* Syllabus */}
          <div className="space-y-2">
            <Label htmlFor="syllabus">Course Syllabus</Label>
            <Textarea
              id="syllabus"
              name="syllabus"
              defaultValue={course?.syllabus}
              placeholder="Describe what students will learn, course objectives, and key topics covered..."
              rows={8}
              className="resize-none"
              required
            />
            {actionState.fieldErrors?.syllabus && (
              <p className="text-sm text-destructive">{actionState.fieldErrors.syllabus[0]}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Provide a detailed overview of the course content, learning objectives, and what students can expect to achieve.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Course Structure Guide */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-800 space-y-2">
            <p>After creating your course, you'll be able to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Add course modules to organize your content</li>
              <li>Create lessons within each module</li>
              <li>Attach videos and written content to lessons</li>
              <li>Set up progress tracking and completion requirements</li>
              <li>Manage student enrollments and monitor progress</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={actionState.status === 'PENDING'}>
          {actionState.status === 'PENDING' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {isEditing ? 'Update Course' : 'Create Course'}
            </>
          )}
        </Button>
      </div>

      {/* Error Messages */}
      {actionState.status === 'ERROR' && actionState.message && (
        <div className="rounded-md bg-destructive/15 p-3">
          <p className="text-sm text-destructive">{actionState.message}</p>
        </div>
      )}
    </form>
  );
}