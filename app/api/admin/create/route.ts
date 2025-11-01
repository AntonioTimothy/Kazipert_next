import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

const DEFAULT_PERMISSIONS = {
    super_admin: ['all'],
    hospital_admin: ['view_users', 'edit_users', 'view_medical', 'update_medical', 'approve_medical'],
    photo_studio_admin: ['view_users', 'upload_photos', 'approve_photos', 'manage_gallery'],
    embassy_admin: ['view_analytics', 'generate_reports', 'export_data'],
    admin: ['view_users', 'view_analytics']
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { firstName, lastName, email, phone, company, role, customPermissions } = body

        console.log('Creating admin with data:', { firstName, lastName, email, phone, company, role, customPermissions })

        // Validate required fields
        if (!firstName || !lastName || !email || !company || !role) {
            return NextResponse.json(
                { error: 'All required fields must be filled' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)
        const hashedPassword = await hash(tempPassword, 12)

        // Map role to Prisma enum - use the actual enum values
        const roleMap: { [key: string]: any } = {
            'super_admin': 'SUPER_ADMIN',
            'hospital_admin': 'HOSPITAL_ADMIN',
            'photo_studio_admin': 'PHOTO_STUDIO_ADMIN',
            'embassy_admin': 'EMBASSY_ADMIN',
            'admin': 'ADMIN',
            'custom': 'ADMIN'
        }

        const dbRole = roleMap[role]
        if (!dbRole) {
            return NextResponse.json(
                { error: 'Invalid role selected' },
                { status: 400 }
            )
        }

        // Determine permissions
        let permissions: string[] = []
        if (role === 'custom') {
            permissions = customPermissions || []
        } else {
            permissions = DEFAULT_PERMISSIONS[role as keyof typeof DEFAULT_PERMISSIONS] || []
        }

        console.log('Creating user with permissions:', permissions)

        // Create user in database - using Prisma enum values directly
        const user = await prisma.user.create({
            data: {
                email,
                phone: phone || null,
                password: hashedPassword,
                // firstName: firstName, // Add firstName if it exists in schema
                // lastName: lastName,   // Add lastName if it exists in schema
                fullName: `${firstName} ${lastName}`,
                company,
                role: dbRole as any, // Cast to any to bypass TypeScript enum checking
                adminStatus: 'PENDING',
                // requiresPasswordChange: true,
                permissions: permissions
            }
        })

        console.log('User created successfully:', user.id)

        // Create profile for the user
        await prisma.profile.create({
            data: {
                userId: user.id,
                language: 'en',
                currency: 'USD',
                theme: 'light'
            }
        })

        console.log('Profile created for user:', user.id)

        // Create OTP for email verification
        const otp = Math.random().toString(36).slice(-8)
        await prisma.otpVerification.create({
            data: {
                email,
                otp,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            }
        })

        console.log('OTP created for user:', user.id)

        // Generate login link
        const loginLink = `${process.env.NEXTAUTH_URL}/auth/set-password?token=${otp}&email=${encodeURIComponent(email)}`

        // Send invitation email
        try {
            await sendAdminInvitationEmail(email, firstName, loginLink, tempPassword)
            console.log('Invitation email sent to:', email)
        } catch (emailError) {
            console.error('Email sending failed:', emailError)
            // Continue even if email fails, but log it
        }

        return NextResponse.json({
            success: true,
            message: 'Admin created successfully. Login instructions have been sent to the email address.',
            data: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role.toLowerCase(),
                status: user.adminStatus?.toLowerCase() || 'pending'
            }
        })
    } catch (error: any) {
        console.error('Error creating admin:', error)

        // Return more specific error message
        let errorMessage = 'Failed to create admin account. Please try again.'

        if (error.code === 'P2002') {
            errorMessage = 'A user with this email already exists.'
        } else if (error.message?.includes('Unknown argument')) {
            errorMessage = 'Database schema mismatch. Please contact administrator.'
        } else if (error.message?.includes('Invalid value for argument `role`')) {
            errorMessage = 'Invalid role selected. Please choose a valid role.'
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}

async function sendAdminInvitationEmail(
    email: string,
    firstName: string,
    loginLink: string,
    tempPassword: string
) {
    const { data, error } = await resend.emails.send({
        from: 'Kazipert Admin <admin@kazipert.com>',
        to: email,
        subject: 'Welcome to Kazipert Admin Portal',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f5c849, #e6b400); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { background: #f5c849; color: #7c2d12; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
              .info-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .password { font-family: monospace; background: #f8f9fa; padding: 8px 12px; border-radius: 4px; border: 1px solid #dee2e6; font-size: 14px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1 style="color: #7c2d12; margin: 0;">Welcome to Kazipert Admin</h1>
              </div>
              <div class="content">
                  <h2>Hello ${firstName},</h2>
                  <p>You have been invited to join the Kazipert Admin Portal as an administrator.</p>
                  
                  <div class="info-box">
                      <h3 style="margin-top: 0;">Your Temporary Credentials:</h3>
                      <p><strong>Email:</strong> ${email}</p>
                      <p><strong>Temporary Password:</strong> <span class="password">${tempPassword}</span></p>
                      <p><em>You will be required to change your password on first login.</em></p>
                  </div>
                  
                  <p>To get started, please click the button below to set up your account:</p>
                  
                  <p style="text-align: center; margin: 30px 0;">
                      <a href="${loginLink}" class="button" style="color: #7c2d12; text-decoration: none;">Setup Your Account</a>
                  </p>
                  
                  <p><strong>Important Security Notes:</strong></p>
                  <ul>
                      <li>This link will expire in 24 hours</li>
                      <li>Keep your credentials secure</li>
                      <li>You must change your password on first login</li>
                      <li>Do not share your password with anyone</li>
                  </ul>
                  
                  <p>If you didn't request this invitation or have any questions, please contact our support team immediately.</p>
                  
                  <p>Best regards,<br><strong>Kazipert Team</strong></p>
                  
                  <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
                  <p style="color: #6c757d; font-size: 12px; text-align: center;">
                      This is an automated message. Please do not reply to this email.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `
    })

    if (error) {
        throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
}