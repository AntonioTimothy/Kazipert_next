"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/ThemeContext"
import * as jobService from "@/lib/services/jobService"
import { ArrowLeft, Save } from "lucide-react"

const COLORS = {
  primary: '#117c82',
  secondary: '#009CA6',
  gold: '#FDB913',
  purple: '#463189',
}

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const { currentTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [job, setJob] = useState<any>(null)

  useEffect(() => {
    const loadJob = async () => {
      try {
        const jobData = await jobService.getJob(params.id as string)
        setJob(jobData)
      } catch (error) {
        console.error('Error loading job:', error)
        router.push('/portals/employer/jobs')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadJob()
    }
  }, [params.id, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      await jobService.updateJob(params.id as string, job)
      router.push('/portals/employer/jobs')
    } catch (error) {
      console.error('Error updating job:', error)
      alert('Failed to update job')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!job) {
    return <div>Job not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
              Edit Job
            </h1>
            <p className="text-gray-600 mt-1">Update your job posting details</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Job Title</label>
                <Input
                  value={job.title || ''}
                  onChange={(e) => setJob({ ...job, title: e.target.value })}
                  placeholder="Job title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={job.category || ''}
                  onValueChange={(v) => setJob({ ...job, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL_HOUSE_HELP">General House Help</SelectItem>
                    <SelectItem value="CHILD_CARE">Child Care / Nanny</SelectItem>
                    <SelectItem value="ELDERLY_CARE">Elderly Care</SelectItem>
                    <SelectItem value="COOKING_SPECIALIST">Cooking Specialist</SelectItem>
                    <SelectItem value="HOUSE_MANAGER">House Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Select
                  value={job.city || ''}
                  onValueChange={(v) => setJob({ ...job, city: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Muscat">Muscat</SelectItem>
                    <SelectItem value="Salalah">Salalah</SelectItem>
                    <SelectItem value="Sohar">Sohar</SelectItem>
                    <SelectItem value="Nizwa">Nizwa</SelectItem>
                    <SelectItem value="Sur">Sur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  value={job.location || ''}
                  onChange={(e) => setJob({ ...job, location: e.target.value })}
                  placeholder="Specific area"
                />
              </div>
            </div>

            {/* Salary */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Monthly Salary</label>
                <Input
                  type="number"
                  readOnly
                  value={job.salary || ''}
                  onChange={(e) => setJob({ ...job, salary: parseInt(e.target.value) || 0 })}
                  placeholder="Salary amount"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={job.status || ''}
                  onValueChange={(v) => setJob({ ...job, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Job Description</label>
              <Textarea
                value={job.description || ''}
                onChange={(e) => setJob({ ...job, description: e.target.value })}
                placeholder="Describe the job requirements and expectations"
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
                style={{ backgroundColor: COLORS.primary, color: 'white' }}
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}