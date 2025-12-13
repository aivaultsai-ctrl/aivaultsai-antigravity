"use client";
import * as React from "react"
import { cn } from "@/lib/utils"

const Dialog = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DialogContent = ({ children }: { children: React.ReactNode }) => <div className="p-4">{children}</div>
const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>
const DialogTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>
const DialogDescription = ({ children }: { children: React.ReactNode }) => <p className="text-muted-foreground">{children}</p>

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };
