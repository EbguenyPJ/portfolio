import { projects } from '@/data/projects'
import DragCarousel from '@/components/projects/DragCarousel'

export const metadata = {
  title: 'Projects — Ebgueny PJ',
  description: 'Backend architecture case studies.',
}

export default function ProjectsPage() {
  return <DragCarousel projects={projects} />
}
