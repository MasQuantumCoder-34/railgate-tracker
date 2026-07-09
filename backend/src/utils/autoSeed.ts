import GateStatus from '../models/GateStatus.js';
import GateClosure from '../models/GateClosure.js';
import TrainSchedule from '../models/TrainSchedule.js';

const DEMO_TRAINS = [
  { name: 'Yelagiri Express', number: '16181', direction: 'up', wait: 8 },
  { name: 'Yelagiri Express', number: '16182', direction: 'down', wait: 8 },
  { name: 'Jolarpettai Passenger', number: '56701', direction: 'up', wait: 5 },
  { name: 'Jolarpettai Passenger', number: '56702', direction: 'down', wait: 5 },
  { name: 'Bangalore Express', number: '16525', direction: 'up', wait: 10 },
  { name: 'Chennai Mail', number: '12677', direction: 'up', wait: 12 },
  { name: 'Goods Train', number: 'G-001', direction: 'up', wait: 15 },
  { name: 'Goods Train', number: 'G-002', direction: 'down', wait: 12 },
];

const scheduleTimes = [
  '05:30', '06:15', '07:00', '08:30', '09:45', '10:30',
  '11:15', '12:00', '13:30', '14:45', '15:30', '16:15',
  '17:00', '18:30', '19:45', '20:30', '21:15', '22:00',
];

export const seedIfEmpty = async (): Promise<void> => {
  try {
    const count = await GateClosure.countDocuments();
    if (count > 0) return;

    console.log('Empty database detected — seeding demo data...');

    for (let i = 0; i < DEMO_TRAINS.length; i++) {
      const t = DEMO_TRAINS[i];
      await TrainSchedule.create({
        trainName: t.name,
        trainNumber: t.number,
        direction: t.direction,
        scheduledTime: scheduleTimes[i % scheduleTimes.length],
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        estimatedWait: t.wait,
        active: true,
      });
    }

    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const train = DEMO_TRAINS[i % DEMO_TRAINS.length];
      const closedAt = new Date(now.getTime() - i * 12 * 60 * 1000 - 5 * 60 * 1000);
      const openedAt = new Date(now.getTime() - i * 12 * 60 * 1000);
      const duration = Math.round((openedAt.getTime() - closedAt.getTime()) / 60000);

      await GateStatus.create({
        status: 'OPEN',
        waitTime: 0,
        updatedAt: openedAt,
      });

      await GateClosure.create({
        trainName: train.name,
        trainNumber: train.number,
        direction: train.direction,
        closedAt,
        openedAt,
        durationMinutes: duration,
        isActive: false,
      });
    }

    await GateStatus.create({
      status: 'OPEN',
      waitTime: 0,
      notes: 'Gate open — no train',
      trainsInQueue: 0,
      updatedAt: new Date(),
    });

    console.log('Demo data seeded successfully.');
  } catch (err) {
    console.error('Auto-seed failed:', err);
  }
};