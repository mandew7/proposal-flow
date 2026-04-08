import { prisma } from "@/lib/prisma";

export async function logActivity({
  actorUserId,
  targetUserId,
  action,
  entityType,
  entityId,
  metadata,
}: {
  actorUserId?: string | null;
  targetUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, string | number | boolean | null> | null;
}) {
  await prisma.activityLog.create({
    data: {
      actorUserId,
      targetUserId,
      action,
      entityType,
      entityId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}
