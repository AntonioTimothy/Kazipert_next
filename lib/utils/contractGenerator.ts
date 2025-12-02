import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'
import { v4 as uuidv4 } from 'uuid'

interface ContractData {
    contractId: string
    employerName: string
    employerId: string
    employerPhone: string
    employerAddress: string
    employerEmail: string
    employeeName: string
    employeePassport: string
    employeePassportExpiry: string
    employeeDob: string
    employeeAddress: string
    employeeEducation: string
    nextOfKinName: string
    nextOfKinRelation: string
    nextOfKinPhone: string
    startDate: string
    duration: string
    salary: string
    workingHours: string
    issueDate: string
}

export async function generateContractPDF(data: ContractData): Promise<string> {
    try {
        // Read the template
        const templatePath = path.join(process.cwd(), 'contract.html')
        let htmlContent = fs.readFileSync(templatePath, 'utf-8')

        // Replace placeholders
        // Note: This is a simple string replacement. For more complex templates, use Handlebars or similar.
        // We need to map the hardcoded values in contract.html to our dynamic data

        // Employer Details
        htmlContent = htmlContent.replace(/Al-Murad Domestic Services LLC/g, data.employerName)
        htmlContent = htmlContent.replace(/OM-22933771/g, data.employerId)
        htmlContent = htmlContent.replace(/Mr\. Ahmed Al Murad/g, data.employerName) // Assuming contact person is same as employer for now
        htmlContent = htmlContent.replace(/\+968 9212 5551/g, data.employerPhone)
        htmlContent = htmlContent.replace(/info@almurad-oman\.com/g, data.employerEmail)
        htmlContent = htmlContent.replace(/Al Khuwair, Muscat — Building 22, Way 102/g, data.employerAddress)

        // Employee Details
        htmlContent = htmlContent.replace(/Mary Wanjiku Njeri/g, data.employeeName)
        htmlContent = htmlContent.replace(/AK2399917/g, data.employeePassport)
        htmlContent = htmlContent.replace(/04 August 2031/g, data.employeePassportExpiry)
        htmlContent = htmlContent.replace(/04 August 1996/g, data.employeeDob)
        htmlContent = htmlContent.replace(/KCSE — Secondary/g, data.employeeEducation)
        htmlContent = htmlContent.replace(/Githurai 45, Ruiru, Kiambu County, Kenya/g, data.employeeAddress)

        // Next of Kin
        htmlContent = htmlContent.replace(/Joseph Njeri \(Father\)<br>\+254700555123/g, `${data.nextOfKinName} (${data.nextOfKinRelation})<br>${data.nextOfKinPhone}`)

        // Contract Terms
        htmlContent = htmlContent.replace(/140 OMR/g, data.salary) // Replace all occurrences
        htmlContent = htmlContent.replace(/140 Omani Rials/g, data.salary.replace('OMR', 'Omani Rials'))
        htmlContent = htmlContent.replace(/12 January 2025/g, data.startDate)
        htmlContent = htmlContent.replace(/2 Years/g, data.duration)
        htmlContent = htmlContent.replace(/Max 10 hours\/day/g, data.workingHours)

        // Meta
        htmlContent = htmlContent.replace(/KZ-EMP-44721/g, data.contractId)
        htmlContent = htmlContent.replace(/14 January 2025/g, data.issueDate)
        htmlContent = htmlContent.replace(/14 Jan 2025/g, data.issueDate)

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        const page = await browser.newPage()

        // Set content
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

        // Generate PDF
        const fileName = `contract-${data.contractId}.pdf`
        const outputDir = path.join(process.cwd(), 'public', 'contracts')

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true })
        }

        const outputPath = path.join(outputDir, fileName)

        await page.pdf({
            path: outputPath,
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
        console.error('Error generating PDF:', error)
        throw error
    }
}
