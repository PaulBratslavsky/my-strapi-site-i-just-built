/**
 * Content configuration for common UI strings.
 * These are fallback values used when Strapi data doesn't provide them.
 * They can be overridden by component-level props or Strapi data.
 */

export const contentConfig = {
  blog: {
    // Blog listing page
    pageHeading: 'Blog',
    pageDescription: 'Explore my latest articles, tutorials, and thought leadership on web development.',
    noResultsMessage: 'No articles found.',
    clearSearchLabel: 'Clear search',
    searchPlaceholder: 'Search articles…',
    searchButtonLabel: 'Search',
  },
  home: {
    // Home page - latest articles section
    latestArticlesLabel: 'Latest Articles',
    recentPostsHeading: 'Recent Posts',
    viewAllLink: 'View all →',
    eyebrowLabel: 'Self-Taught Dev',
    articlesCountLabel: 'Articles Published',
  },
  article: {
    // Article detail page
    relatedArticlesHeading: 'Related Articles',
    backToAllPostsLabel: 'Back to all posts',
    articleInfoLabel: 'Article Info',
    publishedLabel: 'Published',
    noContentMessage: 'No content available for this article.',
  },
}