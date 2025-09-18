"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GlobeIcon,
  MapPin,
  Shield,
  Image as ImageIcon,
  Upload,
  Camera,
  TrendingUp,
  Loader2,
  Globe,
  Map,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

interface FloodRiskData {
  riskLevel: "Low" | "Medium" | "High" | "Very High";
  description: string;
  recommendations: string[];
  elevation: number;
  distanceFromWater: number;
}

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<"coordinates" | "image">(
    "coordinates"
  );
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [floodRisk, setFloodRisk] = useState<FloodRiskData | null>(null);

  const [map, setMap] = useState<null>(null);
  const [mapError, setMapError] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = "https://ai-flood-risk-backend.onrender.com";

  // API CALLS

  const callAPI = async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: endpoint.includes("coordinates")
        ? { "Content-Type": "application/json" }
        : {},
      body: endpoint.includes("coordinates") ? JSON.stringify(data) : data,
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  };

  const handleImageAnalysis = async () => {
    if (!selectedImage) {
      setAlertMessage("Please select an image first");
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      const apiResponse = await callAPI("/api/analyze/image", formData);
      const riskData: FloodRiskData = {
        riskLevel: apiResponse.risk_level,
        description: apiResponse.description,
        recommendations: apiResponse.recommendations,
        elevation: apiResponse.elevation,
        distanceFromWater: apiResponse.distance_from_water,
      };
      setFloodRisk(riskData);
      setAiAnalysis(apiResponse.ai_analysis || "");
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAlertMessage(
        "Error analyzing image. Please check if the backend server is running."
      );
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions

  const getRiskVariant = (riskLevel: string) =>
    riskLevel === "Very High" || riskLevel === "High"
      ? "destructive"
      : riskLevel === "Medium"
      ? "secondary"
      : "default";

  const getRiskIcon = (riskLevel: string) =>
    riskLevel === "Very High" || riskLevel === "High" ? (
      <AlertTriangle className="h-4 w-4" />
    ) : riskLevel === "Medium" ? (
      <Info className="h-4 w-4" />
    ) : (
      <CheckCircle className="h-4 w-4" />
    );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/")) {
        setAlertMessage(
          file.size > 10 * 1024 * 1024
            ? "Image size must be less than 10MB"
            : "Please select a valid image file"
        );
        setShowAlert(true);
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <GlobeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Flood Detection System
            </h1>
          </div>
          <p className="text-slate-600">
            Analyse flood risk using coordinates or upload images for AI-powered
            terrain analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600"></Shield>
                Analysis Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs>
                <TabsList>
                  <TabsTrigger
                    value="Coordinates"
                    className="flex items-center gap-2 hover:cursor-pointer"
                  >
                    <MapPin className="h-4 w-4" />
                    Coordinates
                  </TabsTrigger>
                  <TabsTrigger
                    value="image"
                    className="flex items-center gap-2 hover:cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Image Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="Coordinates" className="mt-4 space-y-4 ">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        type="number"
                        id="latitude"
                        placeholder="Enter Latitude"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Latitude</Label>
                      <Input
                        type="number"
                        id="longitude"
                        placeholder="Enter Longitude"
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-2">
                    <MapPin className="mr-2 h-4 w-4" />
                    Analyze Coordinates
                  </Button>
                </TabsContent>

                <TabsContent value="image" className="mt-4 space-y-4 ">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {!imagePreview ? (
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 mx-auto text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              Upload terrain image
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              JPG, PNG, or GIF up to 10MB
                            </p>
                          </div>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            size="sm"
                            className="hover:cursor-pointer"
                          >
                            {" "}
                            {""}
                            <Camera className="mr-2 h-4 w-4" /> Choose Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Image
                            src={imagePreview}
                            width={1000}
                            height={1000}
                            alt="Image Preview"
                            className="max-h-48 mx-auto rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleImageAnalysis}
                      disabled={isLoading || !selectedImage}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Analyze Image
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80  backdrop-blur-sm ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                  <p className="text-slate-600">
                    {analysisType === "coordinates"
                      ? "Analyzing Coordinates..."
                      : "Analyzing Image..."}
                  </p>
                </div>
              )}

              {floodRisk && !isLoading && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getRiskIcon(floodRisk.riskLevel)}
                      <span className="font-semibold">Risk Level</span>
                    </div>
                    <Badge
                      variant={getRiskVariant(floodRisk.riskLevel)}
                      className="text-sm"
                    >
                      {floodRisk.riskLevel}
                    </Badge>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {floodRisk.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {floodRisk.elevation}m
                      </div>
                      <div className="text-xs text-slate-500">Elevation</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {floodRisk.distanceFromWater}m
                      </div>
                      <div className="text-xs text-slate-500">From Water</div>
                    </div>
                  </div>

                  {aiAnalysis && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-slate-700 mb-3">
                          AI Analysis
                        </h4>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">
                            {aiAnalysis}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {floodRisk.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {!floodRisk && !isLoading && (
                <div className="text-center py-12 text-slate-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Choose an analysis method to see flood risk assessment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Interactive Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mapError ? (
              <div className="w-full h-80 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                <Map className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Map Not Available
                </h3>
                <p>
                  To enable the interactive map, set up a Google Maps API key
                </p>
              </div>
            ) : (
              <div
                ref={mapRef}
                className="w-full h-80 rounded-lg border border-slate-200"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Input Error</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
