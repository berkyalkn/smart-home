"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Power } from "lucide-react"
import { useState, useEffect } from "react"

interface OutletData {
  on: boolean
}

export function OutletControl() {
  const [outletData, setOutletData] = useState<OutletData>({ on: false })

  const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? "http://localhost:8000"
    : "http://localhost:8000"

  // Fetch outlet data on component mount
  useEffect(() => {
    fetchOutletData()
  }, [])

  const fetchOutletData = async () => {
    try {
      const response = await fetch(API_BASE_URL + '/api/outlets/main_outlet')
      if (!response.ok) {
        throw new Error('Failed to fetch outlet data')
      }
      const data = await response.json()
      setOutletData(data)
    } catch (err) {
      console.error('Failed to fetch outlet data:', err)
      // Keep default state on error
    }
  }

  const toggleOutlet = async () => {
    try {
      const newStatus = !outletData.on
      const response = await fetch(API_BASE_URL + '/api/outlets/control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outlet_id: 'main_outlet',
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Failed to control outlet')
      }

      const result = await response.json()
      setOutletData(result.data || result)
    } catch (err) {
      console.error('Failed to control outlet:', err)
      // Optimistic update for better UX
      setOutletData((prev) => ({ on: !prev.on }))
    }
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Outlet Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Smart Outlet</span>
            <Button
              variant={outletData.on ? "default" : "outline"}
              size="sm"
              onClick={toggleOutlet}
              className="flex items-center gap-2"
            >
              <Power className="h-4 w-4" />
              {outletData.on ? "On" : "Off"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}