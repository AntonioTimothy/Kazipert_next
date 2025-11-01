"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, Calendar, CheckCircle } from "lucide-react"

interface Step6PhotoStudioProps {
  data: any
}

export default function Step6PhotoStudio({ data }: Step6PhotoStudioProps) {
  const studios = [
    { name: "Picha Clear Aneps Studio", location: "Nairobi CBD", distance: "2.5 km", rating: "4.8" },
    { name: "Professional Shots Studio", location: "Westlands, Nairobi", distance: "5.1 km", rating: "4.6" },
    { name: "Quick Snap Studio", location: "Thika Road, Nairobi", distance: "8.3 km", rating: "4.4" },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 p-4 border-theme-primary/30 bg-theme-primary/5">
        <div className="flex items-start gap-3">
          <Camera className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-text mb-1">Professional Photo Session</h3>
            <p className="text-theme-text-muted text-sm">
              Visit one of our partner studios for professional photos. This service is completely free for verification purposes.
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-theme-background border-theme-border">
        <CardHeader>
          <CardTitle className="text-sm text-theme-text">County of Residence: {data.personalInfo.county || "Not selected"}</CardTitle>
          <CardDescription className="text-theme-text-muted">
            Below are the available photo studios in your county
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {studios.map((studio, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg border-theme-border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-theme-text">{studio.name}</p>
                  <Badge variant="outline" className="bg-theme-success/10 text-theme-success border-theme-success/30">
                    Free
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-theme-text-muted">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {studio.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    {studio.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    ⭐ {studio.rating}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs border-theme-border">
                  <MapPin className="h-3 w-3 mr-1" />
                  Directions
                </Button>
                <Button size="sm" className="h-8 text-xs text-white bg-theme-primary">
                  <Calendar className="h-3 w-3 mr-1" />
                  Book
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="rounded-lg border-2 p-4 border-theme-success/30 bg-theme-success/5">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-theme-success mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-success mb-1">Cost: KES 0</h3>
            <p className="text-theme-text-muted text-sm">
              The professional photo session is completely free as part of your verification process.
              This ensures we have high-quality photos for your profile that meet international standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}