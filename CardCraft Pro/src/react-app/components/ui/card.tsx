import * as React from "react"

import { cn } from "@/react-app/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { size?: "default" | "sm" }
>(({ className, size = "default", ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card"
    data-size={size}
    className={cn("ring-foreground/10 bg-card text-card-foreground gap-6 overflow-hidden rounded-2xl py-6 text-sm ring-1 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 [&>img:first-child]:rounded-t-xl [&>img:last-child]:rounded-b-xl group/card flex flex-col", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn(
      "gap-2 rounded-t-xl px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4 group/card-header @container/card-header grid auto-rows-min items-start has-[[data-slot=card-action]]:grid-cols-[1fr_auto] has-[[data-slot=card-description]]:grid-rows-[auto_auto]",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-title"
    className={cn("text-base font-medium", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-action"
    className={cn(
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      className
    )}
    {...props}
  />
))
CardAction.displayName = "CardAction"

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn("px-6 group-data-[size=sm]/card:px-4", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn("rounded-b-xl px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4 flex items-center", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
