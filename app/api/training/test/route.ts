import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

// POST - Submit test
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies()
        const accessToken = cookieStore.get('accessToken')?.value

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = await verifyAccessToken(accessToken)
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const userId = decoded.userId
        const body = await request.json()
        const { classId, answers } = body

        if (!classId || !answers) {
            return NextResponse.json({
                error: 'Class ID and answers required'
            }, { status: 400 })
        }

        // Get questions for this class
        const questions = await prisma.testQuestion.findMany({
            where: { classId }
        })

        if (questions.length === 0) {
            return NextResponse.json({ error: 'No questions found' }, { status: 404 })
        }

        // Calculate score
        let correctAnswers = 0
        questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                correctAnswers++
            }
        })

        const score = (correctAnswers / questions.length) * 100
        const passed = score >= 90

        // Save attempt
        const attempt = await prisma.testAttempt.create({
            data: {
                userId,
                classId,
                answers,
                score,
                passed
            }
        })

        // If passed, mark class as completed
        if (passed) {
            await prisma.classProgress.upsert({
                where: {
                    userId_classId: {
                        userId,
                        classId
                    }
                },
                create: {
                    userId,
                    classId,
                    completed: true,
                    watchedDuration: 0
                },
                update: {
                    completed: true
                }
            })

            // Create notification
            await prisma.notification.create({
                data: {
                    userId,
                    title: 'Training Completed!',
                    message: `Congratulations! You passed the test with ${score.toFixed(1)}%`,
                    type: 'TRAINING_COMPLETE',
                    metadata: { classId, score }
                }
            })
        }

        return NextResponse.json({
            attempt,
            score,
            passed,
            correctAnswers,
            totalQuestions: questions.length
        }, { status: 201 })
    } catch (error) {
        console.error('❌ SUBMIT TEST ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to submit test' },
            { status: 500 }
        )
    }
}
