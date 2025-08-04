// ABOUTME: Utility function for generating URL-friendly slugs
// ABOUTME: Converts text to lowercase, removes special characters, and replaces spaces with hyphens

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}