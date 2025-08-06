// ABOUTME: Comprehensive admin dashboard for course management with analytics
// ABOUTME: Provides course overview, enrollment stats, and management tools

'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

interface AdminCourseDashboardProps {
  courses: Array<{
    id: string;
    title: string;
    slug: string;
    thumbnailUrl?: string;
    isActive: boolean;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    enrollmentCount: number;
    totalRevenue: number;
    averageProgress: number;
    completionRate: number;
    lastEnrollment?: Date;
    createdAt: Date;
    modules: Array<{
      id: string;
      title: string;
      lessons: Array<{ id: string }>;
    }>;
  }>;
  stats: {
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    averageCompletionRate: number;
  };
}

export function AdminCourseDashboard({ courses, stats }: AdminCourseDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'enrollments' | 'revenue' | 'created'>('created');

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesStatus = selectedStatus === 'all' || 
        (selectedStatus === 'active' && course.isActive) ||
        (selectedStatus === 'inactive' && !course.isActive);
      
      return matchesSearch && matchesLevel && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'enrollments':
          return b.enrollmentCount - a.enrollmentCount;
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              <p className="text-sm text-gray-600">Total Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Enrollments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{Math.round(stats.averageCompletionRate)}%</p>
              <p className="text-sm text-gray-600">Avg Completion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Recently Created</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="enrollments">Enrollments</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Link href="/admin/courses/new">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Course List or Grid */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedLevel !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first course'
              }
            </p>
            {!searchTerm && selectedLevel === 'all' && selectedStatus === 'all' && (
              <Link href="/admin/courses/new">
                <Button>Create Your First Course</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCourses.map((course) => {
              const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
              
              return (
                <div key={course.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-6">
                    {/* Course Thumbnail */}
                    <div className="flex-shrink-0">
                      {course.thumbnailUrl ? (
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {course.title}
                            </h3>
                            <Badge className={getLevelColor(course.level)}>
                              {course.level}
                            </Badge>
                            <Badge variant={course.isActive ? "default" : "secondary"}>
                              {course.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <span>{course.modules.length} modules</span>
                            <span>{totalLessons} lessons</span>
                            <span>Created {formatDate(course.createdAt)}</span>
                            {course.lastEnrollment && (
                              <span>Last enrollment {formatDate(course.lastEnrollment)}</span>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/courses/${course.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/courses/${course.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Course
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/courses/${course.id}`}>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Preview Course
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-lg font-semibold text-blue-900">{course.enrollmentCount}</div>
                          <div className="text-xs text-blue-700">Enrollments</div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="text-lg font-semibold text-green-900">
                            {formatCurrency(course.totalRevenue)}
                          </div>
                          <div className="text-xs text-green-700">Revenue</div>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <BarChart3 className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="text-lg font-semibold text-orange-900">
                            {Math.round(course.averageProgress)}%
                          </div>
                          <div className="text-xs text-orange-700">Avg Progress</div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="text-lg font-semibold text-purple-900">
                            {Math.round(course.completionRate)}%
                          </div>
                          <div className="text-xs text-purple-700">Completion</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}