"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Payment } from "@/lib/types"

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
