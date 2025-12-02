import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { contractId, fileUrl, airline, flightNumber, departureDate, arrivalDate, price } = body

        if (!contractId || !fileUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const ticket = await prisma.flightTicket.create({
            data: {
                contractId,
                fileUrl,
                airline,
                flightNumber,
                departureDate: departureDate ? new Date(departureDate) : null,
                arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
                price: price ? parseFloat(price) : null,
            }
        })

        // Create notification for the employer (user associated with the contract)
        // First, get the contract to find the user
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            include: { application: { include: { job: { include: { employer: true } } } } }
        })

        if (contract?.application?.job?.employer?.id) {
            await prisma.notification.create({
                data: {
                    userId: contract.application.job.employer.id,
                    title: "Flight Ticket Uploaded",
                    message: `A flight ticket has been uploaded for contract #${contract.contractNumber}`,
                    type: "FLIGHT_TICKET_UPLOADED",
                    actionUrl: `/portals/employer/contracts/${contract.id}`,
                    metadata: { contractId, ticketId: ticket.id }
                }
            })
        }

        return NextResponse.json(ticket)
    } catch (error) {
        console.error('Error uploading flight ticket:', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
