import GateStatus from '../models/GateStatus';
import GateEvent from '../models/GateEvent';

export const checkAndAutoOpen = async (): Promise<void> => {
  try {
    const latestStatus = await GateStatus.findOne().sort({ updatedAt: -1 });

    if (!latestStatus || latestStatus.status === 'OPEN') return;

    const waitMs = (latestStatus.waitTime || 0) * 60 * 1000;
    const elapsed = Date.now() - new Date(latestStatus.updatedAt).getTime();

    if (elapsed >= waitMs) {
      // Overdue — auto-open
      await GateStatus.create({
        status: 'OPEN',
        waitTime: 0,
        notes: 'Auto-opened after wait time expired',
        updatedAt: new Date(),
      });

      await GateEvent.create({
        status: 'OPEN',
        waitTime: 0,
        notes: 'Auto-opened after wait time expired',
        timestamp: new Date(),
      });

      console.log(`Gate auto-opened at ${new Date().toISOString()}`);
    } else {
      // Schedule auto-open at the right time
      const remainingMs = waitMs - elapsed;
      setTimeout(async () => {
        await GateStatus.create({
          status: 'OPEN',
          waitTime: 0,
          notes: 'Scheduled auto-open',
          updatedAt: new Date(),
        });

        await GateEvent.create({
          status: 'OPEN',
          waitTime: 0,
          notes: 'Scheduled auto-open',
          timestamp: new Date(),
        });

        console.log(`Gate auto-opened (scheduled) at ${new Date().toISOString()}`);
      }, remainingMs);
    }
  } catch (err) {
    console.error('Auto-gate check failed:', err);
  }
};
