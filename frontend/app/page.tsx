"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Home, Thermometer, Droplets, Wind, Eye, Sun, Gauge } from "lucide-react"
import { SensorCard } from "@/components/sensor-card"
import { AIVoiceAssistant } from "@/components/ai-voice-assistant"
import { LightControls } from "@/components/light-controls"
import { OutletControl } from "@/components/outlet-control"

interface SensorData {
  temperature: { value: number | string; unit: string; status: string }
  humidity: { value: number | string; unit: string; status: string }
  pressure: { value: number | string; unit: string; status: string }
  motion: { value: boolean | string; unit: string; status: string }
  lightLevel: { value: number | string; unit: string; status: string }
}

interface LightState {
  [room: string]: {
    on: boolean
  }
}



export default function SmartHomeDashboard() {
  // Create null sensor data for error states
  const createNullSensorData = (): SensorData => ({
    temperature: { value: "N/A", unit: "", status: "error" },
    humidity: { value: "N/A", unit: "", status: "error" },
    pressure: { value: "N/A", unit: "", status: "error" },
    motion: { value: "N/A", unit: "", status: "error" },
    lightLevel: { value: "N/A", unit: "", status: "error" }
  })

  const [sensorData, setSensorData] = useState<SensorData | null>(createNullSensorData())
  const [lightState, setLightState] = useState<LightState>({})

  const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? "http://localhost:8000"
    : "http://localhost:8000"

  // Fetch individual sensor data from separate endpoints
  const fetchIndividualSensorData = async () => {
    const sensorEndpoints = {
      temperature: "/api/sensors/temperature",
      humidity: "/api/sensors/humidity",
      pressure: "/api/sensors/pressure",
      motion: "/api/sensors/motion",
      light: "/api/sensors/light"
    }

    const results: any = {}

    // Fetch each sensor endpoint individually
    const fetchPromises = Object.entries(sensorEndpoints).map(async ([key, endpoint]) => {
      try {
        const response = await fetch(API_BASE_URL + endpoint)
        if (response.ok) {
          const data = await response.json()
          results[key] = data
        } else {
          // If endpoint fails, set to null so it shows as N/A
          results[key] = null
        }
      } catch (error) {
        // If fetch fails, set to null so it shows as N/A
        results[key] = null
      }
    })

    // Wait for all fetches to complete
    await Promise.all(fetchPromises)

    return results
  }

  // Transform sensor data from individual API responses to frontend format
  const transformSensorData = (apiData: any): SensorData => ({
    temperature: {
      value: apiData.temperature?.temperature ?? "N/A",
      unit: apiData.temperature ? "°C" : "",
      status: apiData.temperature ? "good" : "error"
    },
    humidity: {
      value: apiData.humidity?.humidity ?? "N/A",
      unit: apiData.humidity ? "%" : "",
      status: apiData.humidity ? "good" : "error"
    },
    pressure: {
      value: apiData.pressure?.pressure ?? "N/A",
      unit: apiData.pressure ? "hPa" : "",
      status: apiData.pressure ? "good" : "error"
    },
    motion: {
      value: apiData.motion?.motion_detected ?? "N/A",
      unit: "",
      status: apiData.motion ? (apiData.motion.motion_detected ? "warning" : "good") : "error"
    },
    lightLevel: {
      value: apiData.light?.light_level ?? "N/A",
      unit: apiData.light ? "lux" : "",
      status: apiData.light ? "good" : "error"
    }
  })


  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        // Fetch sensor data from individual endpoints
        const sensorData = await fetchIndividualSensorData()
        const transformedData = transformSensorData(sensorData)
        setSensorData(transformedData)
      } catch (error) {
        // Silently handle API errors - sensor cards will show N/A values
        setSensorData(createNullSensorData())
      }
    }

    fetchSensorData()
    const interval = setInterval(fetchSensorData, 5000)
    return () => clearInterval(interval)
  }, [API_BASE_URL])

  useEffect(() => {
    const fetchLightState = async () => {
      try {
        const response = await fetch(API_BASE_URL + "/api/lights/")
        if (!response.ok) throw new Error("HTTP error! status: " + response.status)
        const data = await response.json()
        setLightState(data)
      } catch (error) {
        setLightState({})
      }
    }

    fetchLightState()
  }, [API_BASE_URL])




  const toggleLight = async (room: string) => {
    try {
      const response = await fetch(API_BASE_URL + "/api/lights/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, status: !lightState[room]?.on }),
      })

      if (response.ok) {
        const data = await response.json()
        setLightState((prev) => ({
          ...prev,
          [room]: data.data || data,
        }))
      }
    } catch (error) {
      // Optimistic update for better UX
      setLightState((prev) => ({
        ...prev,
        [room]: {
          ...prev[room],
          on: !prev[room]?.on
        },
      }))
    }
  }




  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">HOMIFY</h1>
                <p className="text-muted-foreground">Smart Home Control Center</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              System Online
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* AI Assistant Section */}
        <section className="flex justify-center">
          <div className="w-full max-w-2xl">
            <AIVoiceAssistant />
          </div>
        </section>

        {/* Environment Monitoring Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Environment Monitoring</h2>
            <p className="text-muted-foreground">Real-time sensor readings from your smart home</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {sensorData ? (
              <>
                <SensorCard
                  title="Temperature"
                  value={sensorData.temperature.value}
                  unit={sensorData.temperature.unit}
                  status={sensorData.temperature.status}
                  icon={Thermometer}
                />
                <SensorCard
                  title="Humidity"
                  value={sensorData.humidity.value}
                  unit={sensorData.humidity.unit}
                  status={sensorData.humidity.status}
                  icon={Droplets}
                />
                <SensorCard
                  title="Pressure"
                  value={sensorData.pressure.value}
                  unit={sensorData.pressure.unit}
                  status={sensorData.pressure.status}
                  icon={Gauge}
                />
                <SensorCard
                  title="Motion"
                  value={typeof sensorData.motion.value === 'boolean' ? (sensorData.motion.value ? "Detected" : "Clear") : sensorData.motion.value}
                  unit=""
                  status={sensorData.motion.status}
                  icon={Eye}
                />
                <SensorCard
                  title="Light Level"
                  value={typeof sensorData.lightLevel.value === 'number' ? (sensorData.lightLevel.value + " " + sensorData.lightLevel.unit) : sensorData.lightLevel.value}
                  unit=""
                  status={sensorData.lightLevel.status}
                  icon={Sun}
                />
              </>
            ) : (
              <div className="col-span-full">
                <div className="bg-card rounded-lg border p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading sensor data...</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Device Controls Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Device Controls</h2>
            <p className="text-muted-foreground">Control your smart home devices</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <LightControls lightState={lightState} onToggleLight={toggleLight} />
            </div>

            <div className="lg:col-span-1">
              <OutletControl />
            </div>

            {/* Placeholder for future devices */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border p-6 text-center h-full flex items-center justify-center">
                <div className="text-muted-foreground">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">+</span>
                  </div>
                  <p className="font-medium">Add Device</p>
                  <p className="text-sm">More devices coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
