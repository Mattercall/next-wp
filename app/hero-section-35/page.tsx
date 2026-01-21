import Header from '@/components/shadcn-studio/blocks/hero-section-35/header'
import HeroSection from '@/components/shadcn-studio/blocks/hero-section-35/hero-section-35'
import type { NavigationSection } from '@/components/shadcn-studio/blocks/menu-navigation'

const navigationData: NavigationSection[] = [
  {
    title: 'Home',
    href: '#'
  },
  {
    title: 'Categories',
    href: '#'
  },
  {
    title: 'Team',
    href: '#'
  },
  {
    title: 'About Us',
    href: '#'
  }
]

const blogdata = [
  {
    img: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-02.png',
    date: 'January 20, 2026',
    blogTitle: 'Build with Empathy for Better User Outcomes',
    description: 'Understand user needs to create intuitive and lovable experiences.',
    author: 'Allen Reilly',
    badge: 'UI',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#'
  },
  {
    img: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-03.png',
    date: 'May 20, 2025',
    blogTitle: 'Write Code That Scales with Your Product',
    description: 'Structure your projects for easier updates, faster growth, and bugs.',
    author: 'Sara Wilkerson',
    badge: 'Coding',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#'
  }
]

const HeroSectionPage = () => {
  return (
    <div className='overflow-x-hidden'>
      {/* Header Section */}
      <Header navigationData={navigationData} />

      {/* Main Content */}
      <main className='flex flex-col pt-17.5'>
        <HeroSection blogdata={blogdata} />
      </main>
    </div>
  )
}

export default HeroSectionPage
