"use client";

import * as React from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionButton, ConnectionState } from "@/components/community/connection-button";
import { RequestReferralModal } from "@/components/referrals/request-referral-modal";

interface ProfileActionsProps {
  targetUserId: string;
  targetName: string;
  targetCompany?: string | null;
  initialConnectionState: ConnectionState;
  initialConnectionId?: string;
  canRequestReferral: boolean;
  email?: string;
}

export function ProfileActions({
  targetUserId,
  targetName,
  targetCompany,
  initialConnectionState,
  initialConnectionId,
  canRequestReferral,
  email,
}: ProfileActionsProps) {
  const [isReferralOpen, setIsReferralOpen] = React.useState(false);
  const [connectionState, setConnectionState] = React.useState<ConnectionState>(initialConnectionState);

  const isSelf = initialConnectionState === "SELF";

  if (isSelf) {
    return null;
  }

  return (
    <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0 flex-wrap">
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <Mail className="size-3.5" />
          <span>Send Email</span>
        </a>
      )}

      <ConnectionButton
        userId={targetUserId}
        initialState={connectionState}
        connectionId={initialConnectionId}
        size="sm"
        onStateChange={(newState) => setConnectionState(newState)}
      />
    </div>
  );
}

