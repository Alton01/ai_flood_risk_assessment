"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GlobeIcon,
  MapPin,
  Shield,
  Image as ImageIcon,
  Upload,
  Camera,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
                        onChange={() => {}}
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
                        <div></div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
