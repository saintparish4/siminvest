"use client";
import { Dialog, DialogContent, DialogHeader } from "@/ui/Dialog";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Entity {
  id: string;
  synbol?: string;
}

interface FiatModalProps {
  open: boolean;
  onClose: () => void;
  entity: Entity;
}

export default function FiatModal({ open, onClose, entity }: FiatModalProps) {
    const [amount, setAmount] = useState(100);

    const invest = async () => {
        const res = await fetch("/api/invest/fiat", {
            method: "POST",
            body: JSON.stringify({
                entityId: entity.id,
                entityType: entity.synbol ? "TOKEN" : "STARTUP",
                amount,
            }),
        });
        if (res.ok) {
            toast.success("DEMO: Investment confirmed");
            onClose();
        } else {
            toast.error("Something went wrong");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>Invest  with Demo Dollars </DialogHeader>
                    <input 
                        type="number"
                        min={100}
                        step={100}
                        value={amount}
                        onChange={(e) => setAmount(+e.target.value)}
                        className="input w-full my-4"
                    />
                    <button className="btn-primary w-full" onClick={invest}>
                        Confirm Investment (${amount})
                    </button>
            </DialogContent>
        </Dialog>
    )
}