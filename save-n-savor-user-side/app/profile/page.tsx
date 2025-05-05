"use client"

import { useEffect, useState } from "react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { user, setUser, hydrated } = useUser()
  const [newAddress, setNewAddress] = useState({ line1: "", city: "", state: "", zip: "" })
  const [openAddress, setOpenAddress] = useState(false)
  const [newPayment, setNewPayment] = useState({ nameOnCard: "", cardNumberLast4: "", expiry: "" })
  const [openPayment, setOpenPayment] = useState(false)
  const [tab, setTab] = useState("profile")

  // Sync tab state from URL hash on load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash === "profile" || hash === "orders") {
        setTab(hash)
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    handleHashChange() // run once on mount
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleTabChange = (value: string) => {
    setTab(value)
    window.history.replaceState(null, "", `#${value}`)
  }


  if (!user) return null
  const router = useRouter()

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    })
  }

  const handleAddAddress = async () => {
    const res = await fetch("/api/user/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, address: newAddress }),
    })

    if (res.ok) {
      const updated = await res.json()
      setUser(updated.user) // updates UI immediately
      console.log("Updated user from API:", updated.user)
      localStorage.setItem("user", JSON.stringify(updated.user))
      setNewAddress({ line1: "", city: "", state: "", zip: "" })
      setOpenAddress(false)
      toast({ title: "Address Added", description: "Your address was saved successfully" })
    } else {
      toast({ title: "Error", description: "Failed to save address", variant: "destructive" })
    }
  }

  const handleAddPayment = async () => {
    const res = await fetch("/api/user/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, payment: newPayment }),
    })

    if (res.ok) {
      const updated = await res.json()
      setUser(updated.user)
      localStorage.setItem("user", JSON.stringify(updated.user))
      setNewPayment({ nameOnCard: "", cardNumberLast4: "", expiry: "" })
      setOpenPayment(false)
      toast({ title: "Payment Method Added", description: "Saved successfully" })
    } else {
      toast({ title: "Error", description: "Failed to save payment", variant: "destructive" })
    }
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
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-100 text-green-600">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.name}</h2>

                <div className="w-full mt-6 space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/profile#profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/impact">
                      <Leaf className="mr-2 h-4 w-4" />
                      Impact
                    </Link>
                  </Button>
                  <Separator className="my-2" />
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      localStorage.removeItem("user")
                      setUser(null)
                      window.location.href = "/"
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

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

              {/* Addresses */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Saved Addresses</CardTitle>
                  <CardDescription>Manage your delivery addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  {Array.isArray(user.addresses) && user.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {user.addresses.map((addr: { line1: string; city: string; state: string; zip: string }, idx: number) => (
                        <div key={idx} className="p-3 border rounded-md">
                          <p className="font-medium">{addr.line1}, {addr.city}, {addr.state} {addr.zip}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No addresses added yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Dialog open={openAddress} onOpenChange={setOpenAddress}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Address</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Street Address" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
                        <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                        <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                        <Input placeholder="ZIP Code" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} />
                        <Button onClick={handleAddAddress} className="bg-green-600 hover:bg-green-700 w-full">
                          Save Address
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>


              {/* Payment */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  {Array.isArray(user.paymentMethods) && user.paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {user.paymentMethods.map((method: { nameOnCard: string; cardNumberLast4: string; expiry: string }, index: number) => (
                        <div key={index} className="p-3 border rounded-md">
                          <p className="font-medium">{method.nameOnCard} •••• {method.cardNumberLast4}</p>
                          <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No payment methods added yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Dialog open={openPayment} onOpenChange={setOpenPayment}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Payment Method</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Name on Card"
                          value={newPayment.nameOnCard}
                          onChange={(e) => setNewPayment({ ...newPayment, nameOnCard: e.target.value })}
                        />
                        <Input
                          placeholder="Last 4 Digits"
                          maxLength={4}
                          value={newPayment.cardNumberLast4}
                          onChange={(e) => setNewPayment({ ...newPayment, cardNumberLast4: e.target.value })}
                        />
                        <Input
                          placeholder="Expiry (MM/YY)"
                          value={newPayment.expiry}
                          onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })}
                        />
                        <Button onClick={handleAddPayment} className="bg-green-600 hover:bg-green-700 w-full">
                          Save Payment Method
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </TabsContent>



            {/* Orders */}
            <TabsContent value="orders" className="mt-6"></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


