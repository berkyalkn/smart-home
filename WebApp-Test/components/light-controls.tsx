"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Power } from "lucide-react"

interface LightState {
  [room: string]: {
    on: boolean
  }
}

interface LightControlsProps {
  lightState: LightState
  onToggleLight: (room: string) => void
}

export function LightControls({ lightState, onToggleLight }: LightControlsProps) {
  // Get the first room from lightState for single control
  const firstRoom = Object.keys(lightState)[0]
  const state = firstRoom ? lightState[firstRoom] : { on: false }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Light Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Living Room Light</span>
            <Button
              variant={state.on ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleLight(firstRoom)}
              className="flex items-center gap-2"
            >
              <Power className="h-4 w-4" />
              {state.on ? "On" : "Off"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
