// ABOUTME: Component displaying featured stories in a grid layout with images and descriptions
// ABOUTME: Shows curated articles and long-form content recommendations

import Image from "next/image"
import Link from "next/link"

interface Story {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  imageUrl: string
  category: string
  readTime: string
  link: string
  featured?: boolean
}

// Sample data - replace with actual data from your CMS/API
const FEATURED_STORIES: Story[] = [
  {
    id: "1",
    title: "The Evolution of Modern Masculinity: Redefining Strength in the 21st Century",
    excerpt: "How contemporary men are challenging traditional notions of masculinity and creating new paradigms for personal growth, emotional intelligence, and authentic self-expression.",
    author: "Marcus Chen",
    date: "July 2025",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    category: "Culture",
    readTime: "8 min read",
    link: "/stories/evolution-modern-masculinity",
    featured: true
  },
  {
    id: "2",
    title: "The Art of Slow Living: Finding Balance in a Hyperconnected World",
    excerpt: "Exploring the principles of intentional living and how modern men are embracing mindfulness, minimalism, and meaningful connections.",
    author: "David Torres",
    date: "July 2025",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop",
    category: "Lifestyle",
    readTime: "6 min read",
    link: "/stories/art-of-slow-living"
  },
  {
    id: "3",
    title: "Style Beyond Fashion: Building a Timeless Personal Aesthetic",
    excerpt: "A deep dive into developing a personal style that transcends trends and reflects your authentic self.",
    author: "James Liu",
    date: "June 2025",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop",
    category: "Style",
    readTime: "5 min read",
    link: "/stories/style-beyond-fashion"
  },
  {
    id: "4",
    title: "The Creative Renaissance: Why Every Man Should Cultivate Artistic Expression",
    excerpt: "From writing to woodworking, exploring how creative pursuits enhance mental health and personal fulfillment.",
    author: "Roberto Silva",
    date: "June 2025",
    imageUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&h=600&fit=crop",
    category: "Personal Development",
    readTime: "7 min read",
    link: "/stories/creative-renaissance"
  }
]

export function Stories() {
  const featuredStory = FEATURED_STORIES.find(story => story.featured)
  const regularStories = FEATURED_STORIES.filter(story => !story.featured)

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-brand-brown">Stories</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Story */}
        {featuredStory && (
          <Link 
            href={featuredStory.link}
            className="group col-span-1 lg:col-span-2"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 hover:shadow-xl transition-shadow">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={featuredStory.imageUrl}
                  alt={featuredStory.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <span className="font-medium text-brand-terracotta">{featuredStory.category}</span>
                  <span>{featuredStory.date}</span>
                  <span>{featuredStory.readTime}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-brand-brown group-hover:text-brand-terracotta transition-colors">
                  {featuredStory.title}
                </h3>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {featuredStory.excerpt}
                </p>
                
                <p className="text-sm text-gray-600">
                  By {featuredStory.author}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Regular Stories Grid */}
        {regularStories.map((story) => (
          <Link 
            key={story.id}
            href={story.link}
            className="group"
          >
            <article className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={story.imageUrl}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <span className="font-medium text-brand-terracotta">{story.category}</span>
                  <span>{story.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-brand-brown group-hover:text-brand-terracotta transition-colors line-clamp-2">
                  {story.title}
                </h3>
                
                <p className="text-gray-700 mb-4 line-clamp-3 flex-1">
                  {story.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">By {story.author}</p>
                  <p className="text-gray-500">{story.date}</p>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* View All Stories Link */}
      <div className="text-center mt-8">
        <Link 
          href="/stories"
          className="inline-block bg-brand-brown hover:bg-brand-rust text-white font-medium py-3 px-8 transition-colors"
        >
          View All Stories
        </Link>
      </div>
    </section>
  )
}