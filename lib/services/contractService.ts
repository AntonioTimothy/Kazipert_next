import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'
import { v4 as uuidv4 } from 'uuid'

export interface ContractData {
    employerName: string
    employerId: string
    employerContact: string
    employerPhone: string
    employerOffice?: string
    employerAddress: string
    employerEmail: string
    employeeName: string
    employeePassport: string
    employeePassportExpiry: string
    employeeDob: string
    employeeArrival: string
    employeeEducation: string
    employeeAddress: string
    nextOfKinName: string
    nextOfKinPhone: string
    nextOfKin2Name?: string
    nextOfKin2Phone?: string
    contractDuration: string
    contractStartDate: string
    monthlySalary: string
    documentId: string
    issueDate: string
    employerSignature?: string
    agencySignature?: string
    employeeSignature?: string
}

export const contractService = {
    async generateContract(data: ContractData): Promise<string> {
        try {
            // Read template
            const templatePath = path.join(process.cwd(), 'lib/templates/contract.html')
            let html = fs.readFileSync(templatePath, 'utf-8')

            // Replace placeholders
            html = html.replace(/{{EMPLOYER_NAME}}/g, data.employerName)
            html = html.replace(/{{EMPLOYER_ID}}/g, data.employerId)
            html = html.replace(/{{EMPLOYER_CONTACT}}/g, data.employerContact)
            html = html.replace(/{{EMPLOYER_PHONE}}/g, data.employerPhone)
            html = html.replace(/{{EMPLOYER_OFFICE}}/g, data.employerOffice || 'N/A')
            html = html.replace(/{{EMPLOYER_ADDRESS}}/g, data.employerAddress)
            html = html.replace(/{{EMPLOYER_EMAIL}}/g, data.employerEmail)
            html = html.replace(/{{EMPLOYEE_NAME}}/g, data.employeeName)
            html = html.replace(/{{EMPLOYEE_PASSPORT}}/g, data.employeePassport)
            html = html.replace(/{{EMPLOYEE_PASSPORT_EXPIRY}}/g, data.employeePassportExpiry)
            html = html.replace(/{{EMPLOYEE_DOB}}/g, data.employeeDob)
            html = html.replace(/{{EMPLOYEE_ARRIVAL}}/g, data.employeeArrival)
            html = html.replace(/{{EMPLOYEE_EDUCATION}}/g, data.employeeEducation)
            html = html.replace(/{{EMPLOYEE_ADDRESS}}/g, data.employeeAddress)
            html = html.replace(/{{NEXT_OF_KIN_NAME}}/g, data.nextOfKinName)
            html = html.replace(/{{NEXT_OF_KIN_PHONE}}/g, data.nextOfKinPhone)
            html = html.replace(/{{NEXT_OF_KIN_2_NAME}}/g, data.nextOfKin2Name || 'N/A')
            html = html.replace(/{{NEXT_OF_KIN_2_PHONE}}/g, data.nextOfKin2Phone || 'N/A')
            html = html.replace(/{{CONTRACT_DURATION}}/g, data.contractDuration)
            html = html.replace(/{{CONTRACT_START_DATE}}/g, data.contractStartDate)
            html = html.replace(/{{MONTHLY_SALARY}}/g, data.monthlySalary)
            html = html.replace(/{{DOCUMENT_ID}}/g, data.documentId)
            html = html.replace(/{{ISSUE_DATE}}/g, data.issueDate)

            // Handle signatures
            const signatureStyle = 'max-height: 60px; max-width: 150px;'

            if (data.employerSignature) {
                html = html.replace(/{{EMPLOYER_SIGNATURE}}/g, `<img src="${data.employerSignature}" style="${signatureStyle}" alt="Employer Signature" />`)
            } else {
                html = html.replace(/{{EMPLOYER_SIGNATURE}}/g, '_________________________')
            }

            if (data.agencySignature) {
                html = html.replace(/{{AGENCY_SIGNATURE}}/g, `<img src="${data.agencySignature}" style="${signatureStyle}" alt="Agency Signature" />`)
            } else {
                html = html.replace(/{{AGENCY_SIGNATURE}}/g, '_________________________')
            }

            if (data.employeeSignature) {
                html = html.replace(/{{EMPLOYEE_SIGNATURE}}/g, `<img src="${data.employeeSignature}" style="${signatureStyle}" alt="Employee Signature" />`)
            } else {
                html = html.replace(/{{EMPLOYEE_SIGNATURE}}/g, '_________________________')
            }

            // Ensure output directory exists
            const outputDir = path.join(process.cwd(), 'public/contracts')
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true })
            }

            // Generate PDF
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            })
            const page = await browser.newPage()
            await page.setContent(html, { waitUntil: 'networkidle0' })

            const fileName = `contract-${data.documentId}.pdf`
            const filePath = path.join(outputDir, fileName)

            await page.pdf({
                path: filePath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px'
                }
            })

            await browser.close()

            return `/contracts/${fileName}`
        } catch (error) {
            console.error('Error generating contract:', error)
            throw error
        }
    }
}
