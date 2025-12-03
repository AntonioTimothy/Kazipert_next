// Comprehensive Salary Calculator based on Kazipert Excel Logic
// Includes all multipliers, hourly frequencies, time validation, and 160 OMR cap

export const MAXIMUM_SALARY = 160 // OMR
export const MAXIMUM_WORK_HOURS = 12 // hours per day
export const BASE_SALARY = 90 // OMR - includes basic cleaning

// Age ranges and their multipliers (from Excel)
export const AGE_RANGES = {
    UNDER_1: { label: '<1 year', min: 0, max: 1, category: 'infant' },
    AGE_1_2: { label: '1-2 years', min: 1, max: 2, category: 'infant' },
    AGE_3_8: { label: '3-8 years', min: 3, max: 8, category: 'child' },
    AGE_9_12: { label: '9-12 years', min: 9, max: 12, category: 'child' },
    AGE_13_17: { label: '13-17 years', min: 13, max: 17, category: 'teen' },
    AGE_18_25: { label: '18-25 years', min: 18, max: 25, category: 'adult' },
    AGE_26_35: { label: '26-35 years', min: 26, max: 35, category: 'adult' },
    AGE_36_69: { label: '36-69 years', min: 36, max: 69, category: 'adult' },
    AGE_70_80: { label: '70-80 years', min: 70, max: 80, category: 'elderly' },
    OVER_81: { label: '>81 years', min: 81, max: 150, category: 'elderly' },
}

// Disability/Condition levels and their multipliers (from Excel)
export const DISABILITY_LEVELS = {
    NORMAL: { label: 'Normal', multiplier: 1.0, addCost: 0 },
    MILD: { label: 'Mild Disability', multiplier: 1.2, addCost: 10 },
    MODERATE: { label: 'Moderate Disability', multiplier: 1.5, addCost: 26 },
    SEVERE: { label: 'Severe Disability', multiplier: 2.0, addCost: 52 },
    COMPLETE: { label: 'Complete Disability', multiplier: 2.5, addCost: 78 },
}

// Duty configurations with hourly frequency and costs (from Excel)
export interface DutyConfig {
    label: string
    category: string
    hoursPerDay: number // How many hours this duty takes per day
    costPerHour: number // OMR per hour
    totalCost: number // Total monthly cost in OMR
    required?: boolean
    dependsOn?: string[] // Dependencies (e.g., cooking depends on family size)
}

export const DUTY_CONFIGS: Record<string, DutyConfig> = {
    // CLEANING (Base - included in 90 OMR)
    BASIC_CLEANING: {
        label: 'Basic Cleaning',
        category: 'cleaning',
        hoursPerDay: 3,
        costPerHour: 0, // Included in base
        totalCost: 0,
        required: true
    },
    DUSTING: {
        label: 'Dusting Furniture & Surfaces',
        category: 'cleaning',
        hoursPerDay: 0.42,
        costPerHour: 0.29,
        totalCost: 2,
    },
    MOPPING_FLOORS: {
        label: 'Mopping Floors',
        category: 'cleaning',
        hoursPerDay: 0.5,
        costPerHour: 0.29,
        totalCost: 2.5,
    },
    VACUUMING: {
        label: 'Vacuuming Carpets',
        category: 'cleaning',
        hoursPerDay: 0.33,
        costPerHour: 0.29,
        totalCost: 2,
    },
    BATHROOM_CLEANING: {
        label: 'Bathroom Deep Cleaning',
        category: 'cleaning',
        hoursPerDay: 0.5,
        costPerHour: 0.29,
        totalCost: 3,
    },
    WINDOW_CLEANING: {
        label: 'Window Cleaning',
        category: 'cleaning',
        hoursPerDay: 0.5,
        costPerHour: 0.29,
        totalCost: 3,
    },

    // COOKING
    SIMPLE_COOKING: {
        label: 'Simple Cooking (1-2 meals/day)',
        category: 'cooking',
        hoursPerDay: 1.5,
        costPerHour: 10.67,
        totalCost: 16,
    },
    FULL_ARABIC_COOKING: {
        label: 'Full Arabic Cooking (3 meals/day)',
        category: 'cooking',
        hoursPerDay: 2.5,
        costPerHour: 11.2,
        totalCost: 28,
    },
    OMANI_COOKING: {
        label: 'Omani/International Cooking',
        category: 'cooking',
        hoursPerDay: 2,
        costPerHour: 10,
        totalCost: 20,
    },
    GUEST_COOKING: {
        label: 'Cooking for Guests (occasional)',
        category: 'cooking',
        hoursPerDay: 0.5,
        costPerHour: 12,
        totalCost: 6,
    },
    MEAL_PLANNING: {
        label: 'Meal Planning & Prep',
        category: 'cooking',
        hoursPerDay: 0.5,
        costPerHour: 8,
        totalCost: 4,
    },

    // LAUNDRY & IRONING
    NORMAL_LAUNDRY: {
        label: 'Normal Laundry (1-4 people)',
        category: 'laundry',
        hoursPerDay: 1,
        costPerHour: 10,
        totalCost: 10,
    },
    LARGE_FAMILY_LAUNDRY: {
        label: 'Large Family Laundry (5+ people)',
        category: 'laundry',
        hoursPerDay: 1.5,
        costPerHour: 9.33,
        totalCost: 14,
    },
    IRONING: {
        label: 'Ironing Clothes',
        category: 'laundry',
        hoursPerDay: 1,
        costPerHour: 8,
        totalCost: 8,
    },
    FOLDING_ORGANIZING: {
        label: 'Folding & Organizing Clothes',
        category: 'laundry',
        hoursPerDay: 0.5,
        costPerHour: 6,
        totalCost: 3,
    },

    // WASHING & DISHES
    WASHING_DISHES: {
        label: 'Washing Dishes & Kitchenware',
        category: 'washing',
        hoursPerDay: 0.42,
        costPerHour: 7,
        totalCost: 3,
    },

    // CHILDCARE
    INFANT_CARE: {
        label: 'Infant Care (0-2 years)',
        category: 'childcare',
        hoursPerDay: 4,
        costPerHour: 10.5,
        totalCost: 42,
    },
    CHILD_CARE: {
        label: 'Child Care (3-12 years)',
        category: 'childcare',
        hoursPerDay: 3,
        costPerHour: 8,
        totalCost: 24,
    },
    TEEN_SUPERVISION: {
        label: 'Teen Supervision (13-17 years)',
        category: 'childcare',
        hoursPerDay: 2,
        costPerHour: 7,
        totalCost: 14,
    },
    DISABLED_CHILD_CARE: {
        label: 'Disabled Child Care',
        category: 'childcare',
        hoursPerDay: 5,
        costPerHour: 10.4,
        totalCost: 52,
    },
    HOMEWORK_HELP: {
        label: 'Homework Assistance',
        category: 'childcare',
        hoursPerDay: 1,
        costPerHour: 8,
        totalCost: 8,
    },

    // ELDERLY CARE
    MOBILE_ELDERLY_CARE: {
        label: 'Mobile Elderly Care',
        category: 'elderly',
        hoursPerDay: 2.5,
        costPerHour: 8.4,
        totalCost: 21,
    },
    BEDRIDDEN_ELDERLY_CARE: {
        label: 'Bedridden Elderly Care',
        category: 'elderly',
        hoursPerDay: 6,
        costPerHour: 12.17,
        totalCost: 73,
    },
    ELDERLY_MOBILITY_ASSIST: {
        label: 'Assisting Elderly with Mobility',
        category: 'elderly',
        hoursPerDay: 1.25,
        costPerHour: 7.5,
        totalCost: 9.5,
    },

    // PET CARE
    PET_CARE: {
        label: 'Pet Care (Feeding & Walking)',
        category: 'pets',
        hoursPerDay: 0.75,
        costPerHour: 5.33,
        totalCost: 4,
    },
    PET_GROOMING: {
        label: 'Pet Grooming',
        category: 'pets',
        hoursPerDay: 0.5,
        costPerHour: 8,
        totalCost: 4,
    },

    // SHOPPING & ERRANDS
    GROCERY_SHOPPING: {
        label: 'Grocery Shopping',
        category: 'shopping',
        hoursPerDay: 1,
        costPerHour: 5,
        totalCost: 5,
    },
    MEAL_PLANNING_SHOPPING: {
        label: 'Meal Planning & Shopping',
        category: 'shopping',
        hoursPerDay: 1,
        costPerHour: 6,
        totalCost: 6,
    },
    ERRANDS: {
        label: 'Running Errands',
        category: 'shopping',
        hoursPerDay: 0.5,
        costPerHour: 6,
        totalCost: 3,
    },

    // HOME MAINTENANCE
    PLANT_WATERING: {
        label: 'Watering Plants',
        category: 'maintenance',
        hoursPerDay: 0.25,
        costPerHour: 4,
        totalCost: 1,
    },
    GARDEN_MAINTENANCE: {
        label: 'Basic Garden Maintenance',
        category: 'maintenance',
        hoursPerDay: 0.5,
        costPerHour: 6,
        totalCost: 3,
    },
    POOL_CLEANING: {
        label: 'Pool Cleaning',
        category: 'maintenance',
        hoursPerDay: 1,
        costPerHour: 8,
        totalCost: 8,
    },

    // FAMILY CARE
    HOSTING_GUESTS: {
        label: 'Assisting with Hosting Guests',
        category: 'family',
        hoursPerDay: 0.5,
        costPerHour: 5,
        totalCost: 2.5,
    },
    TABLE_SETTING: {
        label: 'Setting Table & Serving',
        category: 'family',
        hoursPerDay: 0.3,
        costPerHour: 5,
        totalCost: 1.5,
    },
}

export interface FamilyMember {
    id: string
    ageRange: keyof typeof AGE_RANGES
    disabilityLevel: keyof typeof DISABILITY_LEVELS
}

export interface SelectedDuty {
    dutyKey: keyof typeof DUTY_CONFIGS
    quantity?: number // For duties like extra bathrooms
}

export interface SalaryBreakdown {
    baseSalary: number
    familyCareCosts: number // Total cost for all family care
    dutyCosts: number // Total cost for all duties
    totalHoursPerDay: number
    totalMonthlyCost: number
    cappedSalary: number
    breakdown: string[]
}

/**
 * Calculate total salary based on family composition and selected duties
 */
export function calculateSalary(
    familyMembers: FamilyMember[],
    selectedDuties: SelectedDuty[]
): SalaryBreakdown {
    let totalCost = BASE_SALARY
    let totalHours = DUTY_CONFIGS.BASIC_CLEANING.hoursPerDay
    const breakdown: string[] = [`Base Salary (includes basic cleaning): ${BASE_SALARY} OMR`]
    const familyCareCosts: { member: FamilyMember; cost: number; hours: number }[] = []
    const dutyCosts: { duty: SelectedDuty; cost: number; hours: number }[] = []

    // 1. Calculate family care costs
    familyMembers.forEach(member => {
        const ageRange = AGE_RANGES[member.ageRange]
        const disability = DISABILITY_LEVELS[member.disabilityLevel]
        let memberCost = 0
        let memberHours = 0

        // Determine care type and cost based on age and disability
        if (ageRange.category === 'infant') {
            // Infant care
            memberCost = DUTY_CONFIGS.INFANT_CARE.totalCost
            memberHours = DUTY_CONFIGS.INFANT_CARE.hoursPerDay

            if (member.disabilityLevel !== 'NORMAL') {
                memberCost += disability.addCost
                memberHours += 1 // Extra hour for disabled infant
            }
        } else if (ageRange.category === 'child') {
            // Child care
            if (member.disabilityLevel !== 'NORMAL') {
                memberCost = DUTY_CONFIGS.DISABLED_CHILD_CARE.totalCost
                memberHours = DUTY_CONFIGS.DISABLED_CHILD_CARE.hoursPerDay
            } else {
                memberCost = DUTY_CONFIGS.CHILD_CARE.totalCost
                memberHours = DUTY_CONFIGS.CHILD_CARE.hoursPerDay
            }
        } else if (ageRange.category === 'elderly') {
            // Elderly care
            if (member.disabilityLevel === 'SEVERE' || member.disabilityLevel === 'COMPLETE') {
                memberCost = DUTY_CONFIGS.BEDRIDDEN_ELDERLY_CARE.totalCost
                memberHours = DUTY_CONFIGS.BEDRIDDEN_ELDERLY_CARE.hoursPerDay
            } else {
                memberCost = DUTY_CONFIGS.MOBILE_ELDERLY_CARE.totalCost
                memberHours = DUTY_CONFIGS.MOBILE_ELDERLY_CARE.hoursPerDay

                if (member.disabilityLevel !== 'NORMAL') {
                    memberCost += disability.addCost
                    memberHours += 0.5
                }
            }
        } else if (member.disabilityLevel !== 'NORMAL') {
            // Adult with disability
            memberCost = disability.addCost
            memberHours = 2
        }

        if (memberCost > 0) {
            totalCost += memberCost
            totalHours += memberHours
            familyCareCosts.push({ member, cost: memberCost, hours: memberHours })
            breakdown.push(`${ageRange.label} (${disability.label}): ${memberCost} OMR`)
        }
    })

    // 2. Calculate duty costs
    selectedDuties.forEach(selectedDuty => {
        const duty = DUTY_CONFIGS[selectedDuty.dutyKey]
        if (!duty || duty.required) return // Skip if already included in base

        const quantity = selectedDuty.quantity || 1
        const dutyCost = duty.totalCost * quantity
        const dutyHours = duty.hoursPerDay * quantity

        totalCost += dutyCost
        totalHours += dutyHours
        dutyCosts.push({ duty: selectedDuty, cost: dutyCost, hours: dutyHours })

        if (quantity > 1) {
            breakdown.push(`${duty.label} (x${quantity}): ${dutyCost} OMR`)
        } else {
            breakdown.push(`${duty.label}: ${dutyCost} OMR`)
        }
    })

    // 3. Apply maximum cap
    const cappedSalary = Math.min(totalCost, MAXIMUM_SALARY)

    if (totalCost > MAXIMUM_SALARY) {
        breakdown.push(`⚠️ Capped at maximum: ${MAXIMUM_SALARY} OMR`)
    }

    // Calculate aggregated totals
    const totalFamilyCareCost = familyCareCosts.reduce((sum, item) => sum + item.cost, 0)
    const totalDutyCost = dutyCosts.reduce((sum, item) => sum + item.cost, 0)

    return {
        baseSalary: BASE_SALARY,
        familyCareCosts: totalFamilyCareCost,
        dutyCosts: totalDutyCost,
        totalHoursPerDay: totalHours,
        totalMonthlyCost: totalCost,
        cappedSalary,
        breakdown
    }
}

/**
 * Validate if selected duties fit within 12-hour workday
 */
export function validateWorkHours(
    familyMembers: FamilyMember[],
    selectedDuties: SelectedDuty[]
): { valid: boolean; totalHours: number; message?: string } {
    const result = calculateSalary(familyMembers, selectedDuties)

    if (result.totalHoursPerDay > MAXIMUM_WORK_HOURS) {
        return {
            valid: false,
            totalHours: result.totalHoursPerDay,
            message: `Selected duties require ${result.totalHoursPerDay.toFixed(1)} hours/day, exceeding the ${MAXIMUM_WORK_HOURS}-hour maximum. Please reduce duties.`
        }
    }

    return {
        valid: true,
        totalHours: result.totalHoursPerDay
    }
}

/**
 * Get suggested duties based on family composition
 */
export function getSuggestedDuties(familyMembers: FamilyMember[]): (keyof typeof DUTY_CONFIGS)[] {
    const suggested: (keyof typeof DUTY_CONFIGS)[] = []

    const hasInfants = familyMembers.some(m => AGE_RANGES[m.ageRange].category === 'infant')
    const hasChildren = familyMembers.some(m => AGE_RANGES[m.ageRange].category === 'child')
    const hasElderly = familyMembers.some(m => AGE_RANGES[m.ageRange].category === 'elderly')
    const familySize = familyMembers.length

    // Suggest cooking based on family size
    if (familySize <= 4) {
        suggested.push('SIMPLE_COOKING')
    } else {
        suggested.push('FULL_ARABIC_COOKING')
    }

    // Suggest laundry based on family size
    if (familySize >= 5) {
        suggested.push('LARGE_FAMILY_LAUNDRY')
    } else {
        suggested.push('NORMAL_LAUNDRY')
    }

    // Suggest ironing for most families
    suggested.push('IRONING')

    // Suggest grocery shopping
    suggested.push('GROCERY_SHOPPING')

    return suggested
}
