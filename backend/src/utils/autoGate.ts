import GateStatus from '../models/GateStatus.js';
import GateClosure from '../models/GateClosure.js';

let autoOpenTimeout: NodeJS.Timeout | null = null;
let latestClosureId: string | null = null;

export const cancelAutoOpen = (): void => {
  if (autoOpenTimeout) {
    clearTimeout(autoOpenTimeout);
    autoOpenTimeout = null;
    latestClosureId = null;
  }
};

export const checkAndAutoOpen = async (): Promise<void> => {
  try {
    cancelAutoOpen();

    const latestStatus = await GateStatus.findOne().sort({ updatedAt: -1 });
    if (!latestStatus || latestStatus.status === 'OPEN') return;

    latestClosureId = latestStatus._id.toString();

    const waitMs = (latestStatus.waitTime || 0) * 60 * 1000;
    const elapsed = Date.now() - new Date(latestStatus.updatedAt).getTime();

    if (elapsed >= waitMs) {
      await openGate();
      return;
    }

    const remainingMs = waitMs - elapsed;
    autoOpenTimeout = setTimeout(async () => {
      try {
        const current = await GateStatus.findOne().sort({ updatedAt: -1 });
        if (!current || current.status === 'OPEN') return;
        if (current._id.toString() !== latestClosureId) return;
        await openGate();
      } catch (err) {
        console.error('Scheduled auto-open failed:', err);
      }
    }, remainingMs);
  } catch (err) {
    console.error('Auto-gate check failed:', err);
  }
};

const openGate = async (): Promise<void> => {
  const now = new Date();

  await GateStatus.create({
    status: 'OPEN',
    waitTime: 0,
    notes: 'Auto-opened',
    updatedAt: now,
  });

  const activeClosure = await GateClosure.findOneAndUpdate(
    { isActive: true },
    { openedAt: now, isActive: false },
    { sort: { closedAt: -1 } }
  );

  if (activeClosure) {
    const duration = Math.round((now.getTime() - new Date(activeClosure.closedAt).getTime()) / 60000);
    await GateClosure.findByIdAndUpdate(activeClosure._id, { durationMinutes: duration });
    console.log(`Gate auto-opened — closure #${activeClosure._id} lasted ${duration} min`);
  }

  autoOpenTimeout = null;
  latestClosureId = null;
};