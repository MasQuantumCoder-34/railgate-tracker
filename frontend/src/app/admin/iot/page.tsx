"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Radio, Copy, Check, Cpu } from "lucide-react";

export default function IoTSettingsPage() {
  const [apiKey, setApiKey] = useState("gw-iot-vaniyambadi-2026");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = typeof window !== "undefined"
    ? window.location.origin.replace("3000", "5000")
    : "http://localhost:5000";

  const fetchHealth = useCallback(async () => {
    const res = await api.get("/iot/health");
    if (!res.success) setError("Could not reach IoT endpoint");
    setLoading(false);
  }, []);

  useEffect(() => { fetchHealth(); }, [fetchHealth]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (error) return <ErrorState message={error} onRetry={fetchHealth} />;

  const endpointUrl = `${baseUrl}/api/iot/status`;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Radio className="h-6 w-6" /> IoT Integration
        </h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Connect physical sensors to automatically update gate status
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">API Endpoint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">POST URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 rounded bg-[hsl(var(--muted))] text-sm break-all">
                  {endpointUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(endpointUrl)}
                  className="p-2 rounded hover:bg-[hsl(var(--muted))]"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">API Key</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 rounded bg-[hsl(var(--muted))] text-sm font-mono">
                  {apiKey}
                </code>
                <button
                  onClick={() => copyToClipboard(apiKey)}
                  className="p-2 rounded hover:bg-[hsl(var(--muted))]"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <p>Connect a Raspberry Pi / ESP32 to a sensor at the gate</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <p>On gate state change, send a POST request to the endpoint</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <p>Include <code className="bg-[hsl(var(--muted))] px-1 rounded">x-api-key</code> header with your API key</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <p>Gate status updates instantly on the website</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu className="h-5 w-5" /> Example Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
            Send this JSON payload to update the gate status:
          </p>
          <pre className="p-4 rounded-lg bg-[hsl(var(--muted))] text-sm overflow-x-auto">
{`POST ${endpointUrl}
Headers:
  x-api-key: ${apiKey}
  Content-Type: application/json

Body (Close Gate):
{
  "status": "CLOSED",
  "waitTime": 15,
  "trainName": "Sensor Triggered",
  "trainNumber": "IOT",
  "direction": "up"
}

Body (Open Gate):
{
  "status": "OPEN"
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
