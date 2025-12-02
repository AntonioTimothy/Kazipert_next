"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
    Settings,
    Save,
    DollarSign,
    Calculator,
    RefreshCw,
    Info
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Color constants
const KAZIPERT_COLORS = {
    primary: '#117c82',
    secondary: '#117c82',
    accent: '#6c71b5',
    background: '#f8fafc',
    text: '#1a202c',
    textLight: '#718096',
}

interface SalaryConfig {
    [key: string]: number
}

export default function SalaryConfigPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState<SalaryConfig>({})
    const [user, setUser] = useState<any>(null)

    // Default configuration keys based on the Excel sheet logic
    const defaultKeys = {
        base_salary: 120,
        experience_multiplier: 10,
        child_care_multiplier: 15,
        elderly_care_multiplier: 20,
        cooking_multiplier: 10,
        cleaning_multiplier: 5,
        laundry_multiplier: 5,
        pet_care_multiplier: 5,
        garden_multiplier: 5,
        driver_multiplier: 20,
        large_family_multiplier: 10, // For families > 4 members
        special_needs_multiplier: 25
    }

    useEffect(() => {
        const userData = sessionStorage.getItem("user")
        if (!userData) {
            router.push("/login")
            return
        }

        const parsedUser = JSON.parse(userData)
        if (!['ADMIN', 'SUPER_ADMIN'].includes(parsedUser.role)) {
            router.push("/login")
            return
        }

        setUser(parsedUser)
        fetchConfig()
    }, [router])

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/admin/salary-config')
            if (response.ok) {
                const data = await response.json()
                // Merge with defaults to ensure all keys exist
                setConfig({ ...defaultKeys, ...data })
            }
        } catch (error) {
            console.error('Error fetching config:', error)
            toast({
                title: "Error",
                description: "Failed to load salary configuration",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/salary-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Salary configuration updated successfully",
                })
            } else {
                throw new Error('Failed to update')
            }
        } catch (error) {
            console.error('Error saving config:', error)
            toast({
                title: "Error",
                description: "Failed to save changes",
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (key: string, value: string) => {
        setConfig(prev => ({
            ...prev,
            [key]: parseFloat(value) || 0
        }))
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-500/10 rounded-lg" style={{ backgroundColor: `${KAZIPERT_COLORS.primary}15` }}>
                            <Calculator className="h-8 w-8" style={{ color: KAZIPERT_COLORS.primary }} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                                Salary Configuration
                            </h1>
                            <p className="text-muted-foreground">Manage base rates and multipliers for salary calculation</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* Base Rates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                Base Rates
                            </CardTitle>
                            <CardDescription>Fundamental values used as starting points for calculations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="base_salary">Base Monthly Salary (OMR)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="base_salary"
                                        type="number"
                                        value={config.base_salary}
                                        onChange={(e) => handleChange('base_salary', e.target.value)}
                                        className="max-w-[200px]"
                                    />
                                    <span className="text-sm text-muted-foreground">Starting salary before additions</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Duty Multipliers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-blue-600" />
                                Duty Add-ons (OMR)
                            </CardTitle>
                            <CardDescription>Additional amounts added to the base salary for specific duties</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Child Care</Label>
                                <Input
                                    type="number"
                                    value={config.child_care_multiplier}
                                    onChange={(e) => handleChange('child_care_multiplier', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Elderly Care</Label>
                                <Input
                                    type="number"
                                    value={config.elderly_care_multiplier}
                                    onChange={(e) => handleChange('elderly_care_multiplier', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cooking</Label>
                                <Input
                                    type="number"
                                    value={config.cooking_multiplier}
                                    onChange={(e) => handleChange('cooking_multiplier', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cleaning</Label>
                                <Input
                                    type="number"
                                    value={config.cleaning_multiplier}
                                    onChange={(e) => handleChange('cleaning_multiplier', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Laundry</Label>
                                <Input
                                    type="number"
                                    value={config.laundry_multiplier}
                                    onChange={(e) => handleChange('laundry_multiplier', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Pet Care</Label>
                                <Input
                                    type="number"
                                    value={config.pet_care_multiplier}
                                    onChange={(e) => handleChange('pet_care_multiplier', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Special Conditions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-purple-600" />
                                Special Conditions (OMR)
                            </CardTitle>
                            <CardDescription>Adjustments for specific household conditions</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Large Family (4{'>'} members)</Label>
                                <Input
                                    type="number"
                                    value={config.large_family_multiplier}
                                    onChange={(e) => handleChange('large_family_multiplier', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Special Needs Care</Label>
                                <Input
                                    type="number"
                                    value={config.special_needs_multiplier}
                                    onChange={(e) => handleChange('special_needs_multiplier', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Experience Bonus (per year)</Label>
                                <Input
                                    type="number"
                                    value={config.experience_multiplier}
                                    onChange={(e) => handleChange('experience_multiplier', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
