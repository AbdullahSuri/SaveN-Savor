"use client"

import { useState, useEffect } from "react"
import { Leaf, Share2, Award, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/hooks/useUser"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function ImpactPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "all-time">("all-time")
  const [impactData, setImpactData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user: originalUser } = useUser() // Rename to originalUser

  // DEVELOPMENT BYPASS - Add this right after the useUser hook
  const user = originalUser || { id: 'dev-user-123', name: 'Developer' } // Mock user for development
  
  useEffect(() => {
    async function loadImpact() {
      if (user?.id) {
        setLoading(true)
        try {
          // Mock data - replace with actual API call in production
          const mockData = {
            allTime: {
              ordersPlaced: 24,
              foodSaved: 18.5,
              co2Saved: 37.2,
              moneySaved: 620,
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
              foodSaved: 4.2,
              co2Saved: 8.4,
              moneySaved: 150,
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
              foodSaved: 1.5,
              co2Saved: 3.0,
              moneySaved: 45,
              badges: [
                { name: "Food Rescuer", level: 2, progress: 20 },
                { name: "Eco Warrior", level: 1, progress: 15 },
                { name: "Regular Saver", level: 3, progress: 25 },
              ],
              rank: 62,
              totalUsers: 1850,
            }
          };
          setImpactData(mockData)
        } catch (error) {
          setError(error as Error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadImpact()
  }, [user?.id])

  const handleShare = async () => {
    try {
      const currentData = impactData[selectedPeriod === "all-time" ? "allTime" : selectedPeriod]
      const shareData = {
        title: 'My Food Rescue Impact',
        text: `I've rescued ${currentData.foodSaved}kg of food and saved ${currentData.co2Saved}kg of CO₂ with Save N' Savor!`,
        url: window.location.href,
      }
      
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        alert('Copied to clipboard!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">We couldn't load your impact data</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-green-600 hover:bg-green-700"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Your Environmental Impact</h1>
        <p className="text-gray-600 mb-6">Please sign in to view your impact dashboard</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (loading || !impactData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  const currentData = impactData[selectedPeriod === "all-time" ? "allTime" : selectedPeriod]

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
              <div className="text-3xl font-bold text-green-600">{currentData.ordersPlaced}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">Food Rescued</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{currentData.foodSaved} kg</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">CO₂ Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{currentData.co2Saved} kg</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">Money Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">AED {currentData.moneySaved}</div>
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
                {currentData.badges.map((badge: any, index: number) => (
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
                  <div className="text-3xl font-bold text-green-600">#{currentData.rank}</div>
                  <div className="text-sm text-green-700">of {currentData.totalUsers}</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                You're in the top {Math.round((currentData.rank / currentData.totalUsers) * 100)}% of food rescuers!
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
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share My Impact
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
                  By rescuing {currentData.foodSaved} kg of food, you've prevented perfectly good food from ending up in
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
                  Your actions have prevented {currentData.co2Saved} kg of CO₂ emissions, equivalent to driving
                  approximately {Math.round(currentData.co2Saved * 4)} km in a car.
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
                  You've supported local businesses while saving AED {currentData.moneySaved} on quality food for
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