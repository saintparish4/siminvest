"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { randomBytes } from "crypto"; // purely to fake a hash
import { Dialog, DialogContent } from "@/ui/Dialog";

interface Entity {
  id: string;
}

interface CryptoModalProps {
  open: boolean;
  onClose: () => void;
  entity: Entity;
}

export default function CryptoModal({ open, onClose, entity }: CryptoModalProps) {
  const [amount, setAmount] = useState(500);

  const buy = async () => {
    const fakeHash = "0x" + randomBytes(32).toString("hex");
    await fetch("/api/invest/crypto", {
      method: "POST",
      body: JSON.stringify({
        entityId: entity.id,
        txHash: fakeHash,
        amount,
      }),
    });
    toast.success("DEMO: Fake on-chain tx recorded");
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="modal-box space-y-4">
        <h3 className="font-bold text-lg">Invest with Demo Tokens</h3>
        <input
          type="number"
          value={amount}
          min={100}
          step={100}
          onChange={(e) => setAmount(+e.target.value)}
          className="input w-full"
        />
        <button type="button" className="btn-primary w-full" onClick={buy}>
          Confirm Investment (${amount})
        </button>
      </DialogContent>
    </Dialog>
  );
}

//Use wagmi + Polygon Mumbai instead of the fake hash—just remember to label it "TEST-NET ONLY – NO REAL VALUE".
