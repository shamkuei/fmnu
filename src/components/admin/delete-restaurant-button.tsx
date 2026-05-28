"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteRestaurantAction } from "@/actions/restaurants";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Button } from "@/components/ui/button";

export function DeleteRestaurantButton({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string;
  restaurantName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteRestaurantAction(restaurantId);
      router.push("/admin");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="size-4" />
        حذف رستوران
      </Button>
      <DeleteConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`حذف ${restaurantName}`}
        description="آیا مطمئن هستید؟ تمام اطلاعات رستوران و منو حذف خواهد شد و قابل بازگشت نیست."
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}
