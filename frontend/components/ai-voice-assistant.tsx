"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

export function AIVoiceAssistant() {
  const [aiResponse, setAiResponse] = useState("")
  const [isListening, setIsListening] = useState(false)

  const toggleVoiceListening = async () => {
    if (!isListening) {
      setIsListening(true)
      setAiResponse("Listening... Speak your command")

      setTimeout(() => {
        setIsListening(false)
        setAiResponse(
          "Voice command processed. I can help you control your smart home devices, adjust temperature, manage lighting, and monitor your home's status. Try saying 'Turn on living room lights' or 'Set temperature to 22 degrees'.",
        )
      }, 3000)
    } else {
      setIsListening(false)
      setAiResponse("")
    }
  }

  return (
    <Card className="border-primary/50 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">AI Voice Assistant</h2>
            <p className="text-sm text-muted-foreground">
              {isListening
                ? "Listening for your command..."
                : "Tap the microphone to control your smart home with voice"}
            </p>
          </div>

          <Button
            onClick={toggleVoiceListening}
            size="lg"
            className={`h-20 w-20 rounded-full transition-all duration-300 ${
              isListening
                ? "bg-destructive hover:bg-destructive/90 animate-pulse shadow-lg shadow-destructive/50"
                : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
            }`}
          >
            {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>

          {aiResponse && (
            <div className="w-full max-w-2xl p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-foreground text-center">{aiResponse}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
