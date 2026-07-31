import React, { useState } from "react";
import { Scale } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MediatorCard from "./MediatorCard";

export default function MediatorDialog({ issue }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-7 items-center gap-1 rounded-md border border-[#7C3AED] px-2 text-[11px] font-medium text-[#7C3AED] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7C3AED] hover:text-white hover:shadow-md hover:shadow-[#7C3AED]/30"
      >
        <Scale className="h-3 w-3" /> Mediate
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[15px]">{issue.title}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[65vh] overflow-y-auto">
            <MediatorCard issue={issue} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}