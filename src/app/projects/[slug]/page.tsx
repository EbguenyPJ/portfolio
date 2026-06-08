import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects } from '@/data/projects'
import ProjectDetail from '@/components/projects/ProjectDetail'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: `${project.title} — Ebgueny PJ`,
    description: project.tagline,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  return <ProjectDetail project={project} />
}
