"use client"

import { useState } from "react"
import { Leaf, Share2, Award, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ImpactPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("all-time")

  // Mock user impact data
  const userImpact = {
    allTime: {
      ordersPlaced: 24,
      foodSaved: 18.5, // in kg
      co2Saved: 37.2, // in kg
      moneySaved: 620, // in AED
      badges: [
        { name: "Food Rescuer", level: 2, progress: 80 },
        { name: "Eco Warrior", level: 1, progress: 60 },
        { name: "Regular Saver", level: 3, progress: 100 },
      ],
      rank: 128,
      totalUsers: 5280,
    },
    monthly: {
      ordersPlaced: 6,
      foodSaved: 4.2, // in kg
      co2Saved: 8.4, // in kg
      moneySaved: 150, // in AED
      badges: [
        { name: "Food Rescuer", level: 2, progress: 40 },
        { name: "Eco Warrior", level: 1, progress: 30 },
        { name: "Regular Saver", level: 3, progress: 70 },
      ],
      rank: 85,
      totalUsers: 3120,
    },
    weekly: {
      ordersPlaced: 2,
      foodSaved: 1.5, // in kg
      co2Saved: 3.0, // in kg
      moneySaved: 45, // in AED
      badges: [
        { name: "Food Rescuer", level: 2, progress: 20 },
        { name: "Eco Warrior", level: 1, progress: 15 },
        { name: "Regular Saver", level: 3, progress: 25 },
      ],
      rank: 62,
      totalUsers: 1850,
    },
  }

  // Get the selected period data
  const impactData =
    selectedPeriod === "all-time"
      ? userImpact.allTime
      : selectedPeriod === "monthly"
        ? userImpact.monthly
        : userImpact.weekly

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Your Environmental Impact</h1>
          <p className="text-gray-600">
            See the difference you're making in reducing food waste and saving the environment
          </p>
        </div>

        <div className="mb-8">
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
              <TabsTrigger value="all-time">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">Orders Placed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{impactData.ordersPlaced}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">Food Rescued</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{impactData.foodSaved} kg</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">CO₂ Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{impactData.co2Saved} kg</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">Money Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">AED {impactData.moneySaved}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-green-600" />
                Your Achievements
              </CardTitle>
              <CardDescription>Badges and achievements you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {impactData.badges.map((badge, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Leaf className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{badge.name}</div>
                          <div className="text-sm text-gray-500">Level {badge.level}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50">
                        {badge.progress}%
                      </Badge>
                    </div>
                    <Progress value={badge.progress} className="h-2 bg-gray-100" indicatorClassName="bg-green-600" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Achievements
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Your Ranking
              </CardTitle>
              <CardDescription>How you compare to other users</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">#{impactData.rank}</div>
                  <div className="text-sm text-green-700">of {impactData.totalUsers}</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                You're in the top {Math.round((impactData.rank / impactData.totalUsers) * 100)}% of food rescuers!
              </p>
              <div className="flex justify-center">
                <Badge className="bg-green-600">Keep it up!</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Community Impact
            </CardTitle>
            <CardDescription>The collective impact of all Save N' Savor users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">5,280+</div>
                <p className="text-gray-600">Meals Rescued</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">12,450+ kg</div>
                <p className="text-gray-600">CO₂ Emissions Saved</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">AED 320,000+</div>
                <p className="text-gray-600">Money Saved</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="bg-green-600 hover:bg-green-700">
              <Share2 className="mr-2 h-4 w-4" />
              Share Our Impact
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 text-green-600">What Your Impact Means</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Reduced Food Waste</h3>
                <p className="text-gray-600 text-sm">
                  By rescuing {impactData.foodSaved} kg of food, you've prevented perfectly good food from ending up in
                  landfills.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Lower Carbon Footprint</h3>
                <p className="text-gray-600 text-sm">
                  Your actions have prevented {impactData.co2Saved} kg of CO₂ emissions, equivalent to driving
                  approximately {Math.round(impactData.co2Saved * 4)} km in a car.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Community Support</h3>
                <p className="text-gray-600 text-sm">
                  You've supported local businesses while saving AED {impactData.moneySaved} on quality food for
                  yourself and your family.
                </p>
              </CardContent>
            </Card>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">Continue Making an Impact</Button>
        </div>
      </div>
    </div>
  )
}
