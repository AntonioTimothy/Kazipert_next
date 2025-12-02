import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ employerId: string }> }
) {
  try {
    const { employerId } = await params

    const jobs = await prisma.job.findMany({
      where: {
        employerId: employerId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        location: true,
        city: true,
        salary: true,
        salaryCurrency: true,
        status: true,
        createdAt: true,
        bedrooms: true,
        bathrooms: true,
        workingHours: true,
        residenceType: true,
        hasGarden: true,
        hasPool: true
      }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching employer jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}