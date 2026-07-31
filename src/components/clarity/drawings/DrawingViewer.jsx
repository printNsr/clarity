import React, { useState } from "react";
import { ZoomIn, ZoomOut, Maximize, Eye, EyeOff, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plan } from "./DrawingCompare";

export default function DrawingViewer({ open, onOpenChange, elements, zone, markupLabel }) {
  const [zoom, setZoom] = useState(1);
  const [markup, setMarkup] = useState(true);

  const Btn = ({ onClick, title, children }) => (
    <button onClick={onClick} title={title} className="rounded-md border border-[#E5E7EB] bg-white p-2 hover:bg-[#F8FAFC]">{children}</button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <div className="flex items-center gap-2">
          <Btn onClick={() => setZoom((z) => Math.min(z + 0.25, 3))} title="Zoom in"><ZoomIn className="h-4 w-4" /></Btn>
          <Btn onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))} title="Zoom out"><ZoomOut className="h-4 w-4" /></Btn>
          <Btn onClick={() => setZoom(1)} title="Fit to screen"><Maximize className="h-4 w-4" /></Btn>
          <Btn onClick={() => setMarkup((m) => !m)} title="Toggle markup">{markup ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Btn>
          <Btn onClick={() => onOpenChange(false)} title="Close viewer"><X className="h-4 w-4" /></Btn>
        </div>
        <div className="mt-2 max-h-[70vh] overflow-auto rounded-[10px] border border-[#E5E7EB] bg-[#F8FAFC] p-3">
          <div style={{ width: `${zoom * 100}%` }}>
            <Plan elements={elements} zone={zone} markup={markup} markupLabel={markupLabel} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}