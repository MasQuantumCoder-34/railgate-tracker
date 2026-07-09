import TrainSchedule from '../models/TrainSchedule.js';
import GateStatus from '../models/GateStatus.js';
import GateClosure from '../models/GateClosure.js';
import { checkAndAutoOpen } from '../utils/autoGate.js';
import { fetchApproachingTrains } from './railTracker.js';

const CHECK_INTERVAL = 30_000;
const CLOSE_AHEAD_MINUTES = 3;
const DEMO_INTERVAL_MIN = 1;
const DEMO_INTERVAL_MAX = 3;

const DEMO_TRAINS = [
  { name: 'Yelagiri Express', number: '16181', wait: 8 },
  { name: 'Yelagiri Express', number: '16182', wait: 8 },
  { name: 'Jolarpettai Passenger', number: '56701', wait: 5 },
  { name: 'Jolarpettai Passenger', number: '56702', wait: 5 },
  { name: 'Bangalore Express', number: '16525', wait: 10 },
  { name: 'Chennai Mail', number: '12677', wait: 12 },
  { name: 'Goods Train', number: 'G-001', wait: 15 },
  { name: 'Goods Train', number: 'G-002', wait: 12 },
];

let intervalHandle: ReturnType<typeof setInterval> | null = null;
let lastDemoClose: Date | null = null;

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const startAutoPilot = (): void => {
  console.log('AutoPilot started — monitoring train schedules every 30s');
  runCheck();
  intervalHandle = setInterval(runCheck, CHECK_INTERVAL);
};

export const stopAutoPilot = (): void => {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
};

const runCheck = async (): Promise<void> => {
  try {
    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const latestStatus = await GateStatus.findOne().sort({ updatedAt: -1 });
    const isCurrentlyOpen = !latestStatus || latestStatus.status === 'OPEN';

    if (isCurrentlyOpen) {
      const approaching = await fetchApproachingTrains();
      if (approaching.length > 0) {
        const closest = approaching[0];
        await closeGate(closest.trainName, closest.trainNumber, closest.direction, 10);
        checkAndAutoOpen();
        return;
      }
    }

    const currentDayAlt = currentDay === 0 ? 7 : currentDay;
    const todaySchedules = await TrainSchedule.find({
      active: true,
      daysOfWeek: { $in: [currentDay, currentDayAlt] },
    }).sort({ scheduledTime: 1 });

    if (todaySchedules.length > 0) {
      for (const schedule of todaySchedules) {
        const [hours, minutes] = schedule.scheduledTime.split(':').map(Number);
        const scheduledMinutes = hours * 60 + minutes;
        const diffMinutes = scheduledMinutes - currentMinutes;

        if (diffMinutes > 0 && diffMinutes <= CLOSE_AHEAD_MINUTES && isCurrentlyOpen) {
          await closeGate(schedule.trainName, schedule.trainNumber, schedule.direction, schedule.estimatedWait);
          checkAndAutoOpen();
          break;
        }
      }
    } else if (isCurrentlyOpen) {
      const minutesSinceLastClose = lastDemoClose
        ? (now.getTime() - lastDemoClose.getTime()) / 60_000
        : DEMO_INTERVAL_MAX + 1;

      if (minutesSinceLastClose >= DEMO_INTERVAL_MAX) {
        const train = DEMO_TRAINS[randInt(0, DEMO_TRAINS.length - 1)];
        const direction = Math.random() > 0.5 ? 'up' : 'down';
        await closeGate(train.name, train.number, direction, train.wait);
        checkAndAutoOpen();
      }
    }
  } catch (err) {
    console.error('AutoPilot check failed:', err);
  }
};

const closeGate = async (trainName: string, trainNumber: string, direction: string, waitTime: number): Promise<void> => {
  const now = new Date();
  lastDemoClose = now;

  await GateStatus.create({
    status: 'CLOSED',
    waitTime,
    trainName,
    trainNumber,
    direction,
    notes: `Auto-closed for ${trainName}`,
    trainsInQueue: 1,
    updatedAt: now,
  });

  await GateClosure.create({
    trainName,
    trainNumber,
    direction,
    closedAt: now,
    durationMinutes: waitTime,
    isActive: true,
  });

  console.log(`AutoPilot: Gate closed for ${trainName} (${trainNumber})`);
};