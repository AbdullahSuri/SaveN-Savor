"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context" // Importing the useAuth hook to get user data

export function ProfileSettings() {
  const { user } = useAuth() // Get the current user from AuthContext
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.location || "",
  })

  // Update editedUser state when user data from AuthContext changes
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name,
        email: user.email,
        location: user.location,
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Handle Save changes (this would be the function to update the data)
  const handleSaveChanges = async () => {
    // Implement your API call to save updated user details here
    // For example: updateUser(editedUser);
    console.log("Saving changes:", editedUser)
    setIsEditing(false) // After saving, you can switch back to view mode
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your personal information and account settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/cozy-italian-restaurant.png" alt="Restaurant" />
            <AvatarFallback>RS</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Profile Picture</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Upload
              </Button>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editedUser.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={editedUser.location}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
        {isEditing && <Button onClick={handleSaveChanges}>Save Changes</Button>}
      </CardFooter>
    </Card>
  )
}
