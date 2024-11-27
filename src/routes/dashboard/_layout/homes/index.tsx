import { DataTable } from "@/components/ui/data-table";
import { householdColumns } from "@/lib/columns";
import { HouseholdInfo } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import { createFileRoute } from "@tanstack/react-router";

function HomeManagementPage(): JSX.Element {
  const { households } = Route.useLoaderData();

  return (
    <div>
      <h1 className="text-center">Quản lý hộ dân</h1>
      <div className="w-4/5 mx-auto mt-8">
        <DataTable
          columns={householdColumns}
          data={households}
          className="bg-white"
        />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/homes/")({
  component: HomeManagementPage,
  loader: async () => {
    try {
      const households = await invoke<HouseholdInfo[]>("get_rooms_detailed");
      return { households };
    } catch {
      return { households: [] };
    }
  },
});
