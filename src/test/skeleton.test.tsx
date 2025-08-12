// ABOUTME: Tests for unified skeleton component system
// ABOUTME: Verifies skeleton components render correctly with all variants

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  Skeleton, 
  SkeletonCard, 
  SkeletonGrid, 
  SkeletonFilters,
  SkeletonViewToggle,
  SkeletonPage,
  SkeletonText,
  SkeletonTitle,
  SkeletonButton,
  SkeletonImage 
} from '@/components/ui/skeleton';

describe('Skeleton Components', () => {
  describe('Base Skeleton', () => {
    it('renders with default classes', () => {
      const { container } = render(<Skeleton />);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('animate-pulse', 'rounded-md', 'bg-gray-200');
    });

    it('applies custom className', () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('custom-class');
    });
  });

  describe('Skeleton Primitives', () => {
    it('renders SkeletonText with correct classes', () => {
      const { container } = render(<SkeletonText />);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('h-4', 'w-full');
    });

    it('renders SkeletonTitle with correct classes', () => {
      const { container } = render(<SkeletonTitle />);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('h-6', 'w-3/4');
    });

    it('renders SkeletonButton with correct classes', () => {
      const { container } = render(<SkeletonButton />);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('h-10', 'w-24');
    });

    it('renders SkeletonImage with video aspect ratio', () => {
      const { container } = render(<SkeletonImage aspect="video" />);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('aspect-video');
    });
  });

  describe('SkeletonCard Variants', () => {
    it('renders product card variant', () => {
      const { container } = render(<SkeletonCard variant="product" />);
      expect(container.querySelector('.aspect-square')).toBeInTheDocument();
    });

    it('renders video card variant', () => {
      const { container } = render(<SkeletonCard variant="video" />);
      expect(container.querySelector('.aspect-video')).toBeInTheDocument();
    });

    it('renders course card variant', () => {
      const { container } = render(<SkeletonCard variant="course" />);
      expect(container.querySelector('.aspect-video')).toBeInTheDocument();
    });

    it('renders article card variant', () => {
      const { container } = render(<SkeletonCard variant="article" />);
      expect(container.querySelector('.aspect-\\[3\\/1\\]')).toBeInTheDocument();
    });
  });

  describe('SkeletonGrid', () => {
    it('renders correct number of cards', () => {
      const { container } = render(<SkeletonGrid count={3} />);
      const cards = container.querySelectorAll('.bg-white.rounded-lg');
      expect(cards).toHaveLength(3);
    });

    it('applies correct grid classes', () => {
      const { container } = render(
        <SkeletonGrid columns={{ base: 1, md: 2, lg: 3 }} />
      );
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('renders with specified variant', () => {
      const { container } = render(<SkeletonGrid variant="video" count={2} />);
      const videoAspects = container.querySelectorAll('.aspect-video');
      expect(videoAspects.length).toBeGreaterThan(0);
    });
  });

  describe('SkeletonFilters', () => {
    it('renders simple filters variant', () => {
      const { container } = render(<SkeletonFilters variant="simple" />);
      const gridContainer = container.querySelector('.md\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });

    it('renders advanced filters variant', () => {
      const { container } = render(<SkeletonFilters variant="advanced" />);
      const gridContainer = container.querySelector('.lg\\:grid-cols-5');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('SkeletonViewToggle', () => {
    it('renders view toggle skeleton', () => {
      const { container } = render(<SkeletonViewToggle />);
      const toggles = container.querySelectorAll('.h-8.w-8');
      expect(toggles).toHaveLength(2);
    });
  });

  describe('SkeletonPage', () => {
    it('renders catalog page variant', () => {
      const { container } = render(<SkeletonPage variant="catalog" />);
      expect(container.querySelector('.lg\\:grid-cols-5')).toBeInTheDocument(); // Advanced filters
      expect(container.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')).toBeInTheDocument(); // Product grid
    });

    it('renders player page variant', () => {
      const { container } = render(<SkeletonPage variant="player" />);
      expect(container.querySelector('.w-80.border-r')).toBeInTheDocument(); // Sidebar
      expect(container.querySelector('.flex-1.flex.flex-col')).toBeInTheDocument(); // Main content
    });

    it('renders dashboard page variant', () => {
      const { container } = render(<SkeletonPage variant="dashboard" />);
      expect(container.querySelector('.md\\:grid-cols-3')).toBeInTheDocument(); // Stats grid
    });
  });
});