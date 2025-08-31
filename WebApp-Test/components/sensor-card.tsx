import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface SensorCardProps {
  title: string
  value: number | string
  unit: string
  status: string
  icon: LucideIcon
}

export function SensorCard({ title, value, unit, status, icon: Icon }: SensorCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-primary text-primary-foreground"
      case "warning":
        return "bg-accent text-accent-foreground"
      case "error":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {value}
          {unit}
        </div>
        <Badge className={`mt-2 ${getStatusColor(status)}`}>{status}</Badge>
      </CardContent>
    </Card>
  )
}
