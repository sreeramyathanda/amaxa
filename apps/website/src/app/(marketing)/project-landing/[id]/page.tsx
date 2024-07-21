import React from 'react'
import { Project } from '@amaxa/db/schema'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@amaxa/ui/carousel'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@amaxa/ui/card'

type TeamData = {
  projectId: string
  coaches: {
    name: string
    image: string
  }[]
  students: {
    name: string
    image: string
  }[]
}
const projects: Project[] = [
  {
    id: '1',
    name: 'Project 1',
    description: 'Description 1 lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat',
    image: 'https://via.placeholder.com/1000x500',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

const teamData: TeamData[] = [
  {
    projectId: '1',
    coaches: [

      {
        name: "Coach 1",
        image: "https://via.placeholder.com/1000x500"
      },
    ],
    students: [
      {
        name: "User 1",
        image: "https://via.placeholder.com/1000x500"
      }
    ]

  }
]



export default function Page({
  params
}: {
  params: {
    id: string
  }
}) {

  const { id } = params


  // find the project with the id -> //TODO: make this an actual query
  const project = projects.find((project) => project.id === id)
  const team = teamData.find((team) => team.projectId === id)

  if (!project) {
    notFound()
  }
  if (!team) {
    notFound()
  }

  return (
    <div className='flex flex-col gap-5'>

    </div>
  )
}

