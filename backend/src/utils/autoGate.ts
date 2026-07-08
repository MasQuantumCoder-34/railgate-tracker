import GateStatus from '../models/GateStatus.js';
import GateEvent from '../models/GateEvent.js';

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
      await openGate('Auto-opened after wait time expired');
      return;
    }

    const remainingMs = waitMs - elapsed;
    autoOpenTimeout = setTimeout(async () => {
      try {
        const current = await GateStatus.findOne().sort({ updatedAt: -1 });
        if (!current || current.status === 'OPEN') return;
        if (current._id.toString() !== latestClosureId) return;
        await openGate('Scheduled auto-open');
      } catch (err) {
        console.error('Scheduled auto-open failed:', err);
      }
    }, remainingMs);
  } catch (err) {
    console.error('Auto-gate check failed:', err);
  }
};

const openGate = async (notes: string): Promise<void> => {
  await GateStatus.create({
    status: 'OPEN',
    waitTime: 0,
    notes,
    updatedAt: new Date(),
  });

  await GateEvent.create({
    status: 'OPEN',
    waitTime: 0,
    notes,
    timestamp: new Date(),
  });

  console.log(`Gate auto-opened at ${new Date().toISOString()}: ${notes}`);
  autoOpenTimeout = null;
  latestClosureId = null;
};
