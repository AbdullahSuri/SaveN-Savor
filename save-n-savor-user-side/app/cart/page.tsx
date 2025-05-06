"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Clock, CreditCard, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"

export default function CartPage() {
  const router = useRouter()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Form state for credit card
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [nameOnCard, setNameOnCard] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log("User loaded from localStorage:", parsedUser)
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const handleRemoveItem = (id: number | string) => {
    removeFromCart(id)
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    })
  }

  const handleQuantityChange = (id: number | string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some items before checking out.",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "credit-card" && (!cardNumber || !expiry || !cvv || !nameOnCard)) {
      toast({
        title: "Missing payment information",
        description: "Please fill in all payment details",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)

      console.log("User data:", user)
      console.log("Cart items:", cartItems)

      // Calculate totals
      const subtotal = getCartTotal()
      const serviceFee = 2.0
      const total = subtotal + serviceFee

      // Get the first vendor's address as pickup address (simplified)
      const pickupAddress = cartItems[0]?.vendor ? `${cartItems[0].vendor}, Dubai, UAE` : "Dubai, UAE"

      // Get the pickup time from the first item (simplified)
      const pickupTime = cartItems[0]?.pickupTime || "Today, 5-7 PM"

      // Create order object
      const orderData = {
        userId: user._id,
        items: cartItems.map((item) => ({
          foodItemId: item.id.toString(), // Convert to string to avoid ObjectId issues
          name: item.name,
          vendor: item.vendor,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        serviceFee,
        total,
        pickupAddress,
        pickupTime,
        paymentMethod,
      }

      console.log("Order data being sent:", orderData)

      // Send order to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const responseText = await response.text()
      console.log("API response text:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse response as JSON:", e)
        throw new Error("Invalid response from server")
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order")
      }

      // Clear the cart
      clearCart()

      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed. You will receive a confirmation shortly.",
      })

      // Navigate to confirmation page with the order ID
      console.log("Redirecting to order confirmation with ID:", data.order.orderId)

      // Add a small delay to ensure the order is saved before redirecting
      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${data.order.orderId}`)
      }, 1000)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Failed to place order",
        description: (error as Error).message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Calculate totals
  const subtotal = getCartTotal()
  const serviceFee = 2.0
  const total = subtotal + serviceFee

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/browse">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8 text-green-600">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                <CardDescription>Review your items before checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.vendor}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{item.pickupTime}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">AED {(item.price * item.quantity).toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Alert className="mt-6 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-600">Important Reminder</AlertTitle>
              <AlertDescription>
                Please arrive during your selected pickup time. Items not picked up may be donated or discarded, and
                refunds are not available for missed pickups.
              </AlertDescription>
            </Alert>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>AED {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>AED {serviceFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>AED {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card" className="flex-grow">
                            Credit/Debit Card
                          </Label>
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex-grow">
                            Cash on Pickup
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name on Card</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={nameOnCard}
                          onChange={(e) => setNameOnCard(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/browse">Browse Available Food</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
