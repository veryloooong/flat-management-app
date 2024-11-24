import { DataTable } from "@/components/ui/data-table";
import { householdColumns } from "@/lib/columns";
import { HouseholdInfo } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function HomeManagementPage(): JSX.Element {
  const [households, setHouseholds] = useState<HouseholdInfo[]>([]);
  const router = useRouter();
  const [isAddFeeDialogOpen, setIsAddFeeDialogOpen] = useState(false);


  return (
    <div>
      <h1 className="text-center">Quản lý hộ dân</h1>
      <div className="w-4/5 mx-auto mt-8">
        <DataTable columns={householdColumns} data={households} className="bg-white" />
       
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/homes/")({
  component: HomeManagementPage,
});