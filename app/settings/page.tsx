"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronRight, User, KeyRound, Download, Heart, CreditCard, Bell, Palette, HelpCircle, Star, Users, Lock, Shield, BookOpen } from "lucide-react"
import { useClerk } from "@clerk/nextjs"

const settingsOptions = [
  { name: "Your account", icon: User },
  // { name: "Monetization", icon: CreditCard },
  // { name: "Premium", icon: Star },
  // { name: "Creator Subscriptions", icon: Users },
  // { name: "Security and account access", icon: Lock },
  // { name: "Privacy and safety", icon: Shield },
  // { name: "Notifications", icon: Bell },
  { name: "Accessibility, display, and languages", icon: Palette },
  { name: "Additional resources", icon: BookOpen },
]

export default function SettingsPage() {
  const [selectedSetting, setSelectedSetting] = useState("Your account")
  const { signOut } = useClerk()

  return (
    <div className="flex min-h-screen bg-background">
      <div className="max-w-[580px] w-full border-x border-border">
        <div className="p-4 mt-4">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <nav className="space-y-2">
            {settingsOptions.map((option) => (
              <Button
                key={option.name}
                variant={selectedSetting === option.name ? "secondary" : "ghost"}
                className="w-full justify-between"
                onClick={() => setSelectedSetting(option.name)}
              >
                <span className="flex items-center">
                  <option.icon className="mr-2 h-4 w-4" />
                  {option.name}
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ))}
            <Button variant="outline" className="w-full justify-between" onClick={() => signOut({ redirectUrl: '/sign-in' })}>
              <span className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                Logout
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
      <div className="flex-1 p-6">
        {selectedSetting === "Your account" && <AccountSettings />}
        {/* {selectedSetting === "Monetization" && <MonetizationSettings />} */}
        {/* {selectedSetting === "Premium" && <PremiumSettings />} */}
        {/* {selectedSetting === "Creator Subscriptions" && <CreatorSubscriptionsSettings />} */}
        {/* {selectedSetting === "Security and account access" && <SecuritySettings />}
        {selectedSetting === "Privacy and safety" && <PrivacySettings />} */}
        {/* {selectedSetting === "Notifications" && <NotificationSettings />} */}
        {selectedSetting === "Accessibility, display, and languages" && <AccessibilitySettings />}
        {selectedSetting === "Additional resources" && <AdditionalResourcesSettings />}
      </div>
    </div>
  )
}

function AccountSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Account</h2>
      <p className="text-muted-foreground mb-6">
        See information about your account, download an archive of your data, or learn about your
        account deactivation options
      </p>
      <div className="space-y-4">
        {[
          {
            icon: User,
            title: "Account information",
            description: "See your account information like your phone number and email address."
          },
          {
            icon: KeyRound,
            title: "Change your password",
            description: "Change your password at any time."
          },
          {
            icon: Download,
            title: "Download an archive of your data",
            description: "Get insights into the type of information stored for your account."
          },
          {
            icon: Heart,
            title: "Deactivate your account",
            description: "Find out how you can deactivate your account."
          }
        ].map((item) => (
          <Button key={item.title} variant="outline" className="w-full justify-between p-4 h-auto">
            <div className="flex items-start">
              <item.icon className="h-5 w-5 mr-4 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 flex-shrink-0" />
          </Button>
        ))}
      </div>
    </div>
  )
}

function MonetizationSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Monetization</h2>
      <p className="text-muted-foreground mb-6">Manage your monetization settings and revenue streams.</p>
      {/* Add monetization-specific content here */}
    </div>
  )
}

function PremiumSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Premium</h2>
      <p className="text-muted-foreground mb-6">Manage your premium subscription and features.</p>
      {/* Add premium-specific content here */}
    </div>
  )
}

function CreatorSubscriptionsSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Creator Subscriptions</h2>
      <p className="text-muted-foreground mb-6">Manage your creator subscriptions and content.</p>
      {/* Add creator subscriptions-specific content here */}
    </div>
  )
}

function SecuritySettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Security and Account Access</h2>
      <p className="text-muted-foreground mb-6">Manage your account&apos;s security and access settings.</p>
      {/* Add security-specific content here */}
    </div>
  )
}

function PrivacySettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Privacy and Safety</h2>
      <p className="text-muted-foreground mb-6">Manage your privacy settings and safety features.</p>
      {/* Add privacy-specific content here */}
    </div>
  )
}

function NotificationSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <p className="text-muted-foreground mb-6">Manage your notification preferences.</p>
      {/* Add notification-specific content here */}
    </div>
  )
}

function AccessibilitySettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Accessibility, Display, and Languages</h2>
      <p className="text-muted-foreground mb-6">Customize your accessibility, display, and language settings.</p>
      {/* Add accessibility-specific content here */}
    </div>
  )
}

function AdditionalResourcesSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
      <p className="text-muted-foreground mb-6">Find additional resources and information.</p>
      {/* Add additional resources-specific content here */}
    </div>
  )
}