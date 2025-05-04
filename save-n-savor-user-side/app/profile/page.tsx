"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Mail, Phone, MapPin, CreditCard, Bell, Settings, LogOut, Edit, Leaf, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const user = {
    name: "Ahmed Mohammed",
    email: "ahmed.m@example.com",
    phone: "+971 50 123 4567",
    address: "Downtown Dubai, Dubai, UAE",
    avatar: "/placeholder.svg?height=200&width=200&query=person+profile+avatar",
    joinDate: "January 2023",
    impact: {
      ordersPlaced: 24,
      foodSaved: 18.5, // in kg
      co2Saved: 37.2, // in kg
      moneySaved: 620, // in AED
    },
    paymentMethods: [
      {
        id: 1,
        type: "Visa",
        last4: "4242",
        expiry: "05/26",
        isDefault: true,
      },
    ],
    orders: [
      {
        id: "ORD-12345",
        date: "May 3, 2025",
        status: "Ready for pickup",
        total: 82,
        items: [
          { name: "Assorted Pastry Box", quantity: 1 },
          { name: "Mediterranean Lunch Box", quantity: 2 },
        ],
      },
      {
        id: "ORD-12344",
        date: "April 28, 2025",
        status: "Completed",
        total: 45,
        items: [{ name: "Sushi Platter", quantity: 1 }],
      },
      {
        id: "ORD-12343",
        date: "April 20, 2025",
        status: "Completed",
        total: 38,
        items: [{ name: "Pizza Combo", quantity: 1 }],
      },
    ],
    notifications: {
      newDeals: true,
      orderUpdates: true,
      marketingEmails: false,
    },
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    })
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    // Update notification preferences logic would go here
    toast({
      title: "Preferences updated",
      description: "Your notification preferences have been updated",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-green-600">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-500 text-sm">Member since {user.joinDate}</p>

                <div className="w-full mt-6 space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/orders">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/impact">
                      <Leaf className="mr-2 h-4 w-4" />
                      My Impact
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/payment-methods">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                  <Separator className="my-2" />
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user.email} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue={user.phone} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" defaultValue={user.address} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{user.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                {isEditing && (
                  <CardFooter>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {user.paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">
                                {method.type} •••• {method.last4}
                              </p>
                              <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                            </div>
                          </div>
                          {method.isDefault && (
                            <Badge variant="outline" className="bg-green-50 text-green-600">
                              Default
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No payment methods added yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Add Payment Method</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.map((order) => (
                        <div key={order.id} className="p-4 border rounded-md">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <Badge
                              className={
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-600 hover:bg-green-100"
                                  : "bg-amber-100 text-amber-600 hover:bg-amber-100"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Items:</p>
                            <ul className="text-sm">
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.quantity}x {item.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <p className="font-medium">Total: AED {order.total.toFixed(2)}</p>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/orders/${order.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/browse">Browse Food</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Impact Tab */}
            <TabsContent value="impact" className="mt-6">
              <Card className="bg-green-50 border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-700">Your Environmental Impact</CardTitle>
                  <CardDescription className="text-green-600">See the difference you're making</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600 mb-1">{user.impact.ordersPlaced}</div>
                      <p className="text-green-700">Orders Placed</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600 mb-1">{user.impact.foodSaved} kg</div>
                      <p className="text-green-700">Food Rescued</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600 mb-1">{user.impact.co2Saved} kg</div>
                      <p className="text-green-700">CO₂ Saved</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600 mb-1">AED {user.impact.moneySaved}</div>
                      <p className="text-green-700">Money Saved</p>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <h3 className="text-lg font-medium text-green-700 mb-2">Your Impact Badges</h3>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <Leaf className="h-8 w-8 text-green-600" />
                        </div>
                        <span className="mt-2 text-sm text-green-700">Food Rescuer</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <Leaf className="h-8 w-8 text-green-600" />
                        </div>
                        <span className="mt-2 text-sm text-green-700">Eco Warrior</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <Leaf className="h-8 w-8 text-green-600" />
                        </div>
                        <span className="mt-2 text-sm text-green-700">Regular Saver</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button className="bg-green-600 hover:bg-green-700">Share Your Impact</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-deals">New Deals Alerts</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications about new surplus food deals near you
                        </p>
                      </div>
                      <Switch
                        id="new-deals"
                        checked={user.notifications.newDeals}
                        onCheckedChange={(checked) => handleNotificationChange("newDeals", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="order-updates">Order Updates</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications about your order status and pickup reminders
                        </p>
                      </div>
                      <Switch
                        id="order-updates"
                        checked={user.notifications.orderUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing">Marketing Emails</Label>
                        <p className="text-sm text-gray-500">Receive promotional emails and newsletters</p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={user.notifications.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Language Preferences
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
