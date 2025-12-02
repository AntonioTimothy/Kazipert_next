// Currency Helper for Kazipert
// Handles currency display based on user nationality

export type Currency = 'OMR' | 'KES'
export type UserNationality = 'KENYAN' | 'OMANI' | 'OTHER'

// Exchange rates (update these periodically)
const EXCHANGE_RATES = {
    OMR_TO_KES: 335.50, // 1 OMR = ~335.50 KES
    KES_TO_OMR: 0.00298, // 1 KES = ~0.00298 OMR
}

/**
 * Get the appropriate currency for a user based on their nationality
 */
export function getUserCurrency(nationality: string): Currency {
    const upperNationality = nationality.toUpperCase()

    if (upperNationality === 'KENYAN' || upperNationality === 'KENYA') {
        return 'KES'
    }

    // Default to OMR for Omanis and others
    return 'OMR'
}

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
): number {
    if (fromCurrency === toCurrency) {
        return amount
    }

    if (fromCurrency === 'OMR' && toCurrency === 'KES') {
        return amount * EXCHANGE_RATES.OMR_TO_KES
    }

    if (fromCurrency === 'KES' && toCurrency === 'OMR') {
        return amount * EXCHANGE_RATES.KES_TO_OMR
    }

    return amount
}

/**
 * Format currency for display
 */
export function formatCurrency(
    amount: number,
    currency: Currency,
    showSymbol: boolean = true
): string {
    const formatted = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    if (!showSymbol) {
        return formatted
    }

    return `${currency} ${formatted}`
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
    switch (currency) {
        case 'OMR':
            return 'ر.ع.'
        case 'KES':
            return 'KSh'
        default:
            return currency
    }
}

/**
 * Display amount in user's preferred currency
 * Converts from base OMR if needed
 */
export function displayAmount(
    amountInOMR: number,
    userNationality: string,
    showSymbol: boolean = true
): string {
    const userCurrency = getUserCurrency(userNationality)
    const convertedAmount = convertCurrency(amountInOMR, 'OMR', userCurrency)
    return formatCurrency(convertedAmount, userCurrency, showSymbol)
}

/**
 * Display amount with both currencies (for transparency)
 */
export function displayAmountWithConversion(
    amountInOMR: number,
    userNationality: string
): string {
    const userCurrency = getUserCurrency(userNationality)

    if (userCurrency === 'OMR') {
        return formatCurrency(amountInOMR, 'OMR')
    }

    const convertedAmount = convertCurrency(amountInOMR, 'OMR', userCurrency)
    return `${formatCurrency(convertedAmount, userCurrency)} (${formatCurrency(amountInOMR, 'OMR')})`
}
