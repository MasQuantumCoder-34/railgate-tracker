import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { MONGODB_URI } from '../config/env.js';
import GateStatus from '../models/GateStatus.js';
import GateEvent from '../models/GateEvent.js';
import TrainSchedule from '../models/TrainSchedule.js';

const TRAINS = [
  { name: 'Yelagiri Express', number: '16181', direction: 'up', wait: 8 },
  { name: 'Yelagiri Express', number: '16182', direction: 'down', wait: 8 },
  { name: 'Jolarpettai Passenger', number: '56701', direction: 'up', wait: 5 },
  { name: 'Jolarpettai Passenger', number: '56702', direction: 'down', wait: 5 },
  { name: 'Bangalore Express', number: '16525', direction: 'up', wait: 10 },
  { name: 'Bangalore Express', number: '16526', direction: 'down', wait: 10 },
  { name: 'Chennai Mail', number: '12677', direction: 'up', wait: 12 },
  { name: 'Chennai Mail', number: '12678', direction: 'down', wait: 12 },
  { name: 'KSR Bengaluru Express', number: '12691', direction: 'up', wait: 10 },
  { name: 'KSR Bengaluru Express', number: '12692', direction: 'down', wait: 10 },
  { name: 'Tirupati Passenger', number: '57431', direction: 'up', wait: 6 },
  { name: 'Tirupati Passenger', number: '57432', direction: 'down', wait: 6 },
];

const scheduleTimes = [
  '05:30', '06:15', '07:00', '08:30', '09:45', '10:30',
  '11:15', '12:00', '13:30', '14:45', '15:30', '16:15',
  '17:00', '18:30', '19:45', '20:30', '21:15', '22:00',
];

const seedDemo = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for demo seed...');

    const existingSchedules = await TrainSchedule.countDocuments();
    if (existingSchedules > 0) {
      console.log(`Found ${existingSchedules} existing schedules. Skipping train seed.`);
    } else {
      await TrainSchedule.deleteMany({});
      for (let i = 0; i < TRAINS.length; i++) {
        const t = TRAINS[i];
        await TrainSchedule.create({
          trainName: t.name,
          trainNumber: t.number,
          direction: t.direction,
          scheduledTime: scheduleTimes[i % scheduleTimes.length],
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          estimatedWait: t.wait,
          active: true,
        });
        console.log(`  Added: ${t.name} (${t.number})`);
      }
      console.log(`Created ${TRAINS.length} train schedules.`);
    }

    const existingEvents = await GateEvent.countDocuments();
    if (existingEvents > 0) {
      console.log(`Found ${existingEvents} existing events. Skipping gate event seed.`);
    } else {
      await GateStatus.deleteMany({});
      await GateEvent.deleteMany({});

      const now = new Date();
      const events: { status: 'OPEN' | 'CLOSED'; minutesAgo: number; waitTime?: number; train?: typeof TRAINS[0] }[] = [];

      for (let i = 0; i < 12; i++) {
        const isOpen = i % 2 === 0;
        const train = TRAINS[i % TRAINS.length];
        events.push({
          status: isOpen ? 'OPEN' : 'CLOSED',
          minutesAgo: i * 6,
          waitTime: isOpen ? undefined : train.wait,
          train: isOpen ? undefined : train,
        });
      }

      events.reverse();

      for (const e of events) {
        const timestamp = new Date(now.getTime() - e.minutesAgo * 60 * 1000);

        await GateStatus.create({
          status: e.status,
          waitTime: e.status === 'CLOSED' ? (e.waitTime || 0) : 0,
          trainName: e.status === 'CLOSED' ? e.train?.name : undefined,
          trainNumber: e.status === 'CLOSED' ? e.train?.number : undefined,
          direction: e.status === 'CLOSED' ? e.train?.direction : undefined,
          notes: e.status === 'CLOSED' ? `Train ${e.train?.number}` : undefined,
          trainsInQueue: e.status === 'CLOSED' ? 1 : 0,
          updatedAt: timestamp,
        });

        await GateEvent.create({
          status: e.status,
          waitTime: e.status === 'CLOSED' ? (e.waitTime || 0) : 0,
          trainName: e.status === 'CLOSED' ? e.train?.name : undefined,
          trainNumber: e.status === 'CLOSED' ? e.train?.number : undefined,
          direction: e.status === 'CLOSED' ? e.train?.direction : undefined,
          notes: e.status === 'CLOSED' ? `Train ${e.train?.number}` : undefined,
          trainsInQueue: e.status === 'CLOSED' ? 1 : 0,
          timestamp,
        });
      }

      const latestEvent = events[events.length - 1];
      const latestStatus = latestEvent.status === 'OPEN' ? 'OPEN' : 'CLOSED';
      const latestTime = new Date(now.getTime() - (latestEvent.minutesAgo || 0) * 60 * 1000);

      await GateStatus.create({
        status: latestStatus,
        waitTime: 0,
        notes: latestStatus === 'OPEN' ? 'Gate open — no train' : undefined,
        trainsInQueue: 0,
        updatedAt: latestTime,
      });

      console.log(`Created ${events.length} gate events. Current status: ${latestStatus}`);
    }

    await mongoose.disconnect();
    console.log('Demo seed complete. System ready.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDemo();
