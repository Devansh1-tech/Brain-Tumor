import { prisma as prismaClient } from './prisma';
import fs from 'fs';
import path from 'path';

const FALLBACK_FILE_PATH = path.join(process.cwd(), 'db-fallback.json');

// Interface structures to match database
interface LocalDb {
  users: any[];
  predictions: any[];
}

// Ensure the local JSON file database exists
function getLocalDb(): LocalDb {
  if (!fs.existsSync(FALLBACK_FILE_PATH)) {
    const initialDb: LocalDb = { users: [], predictions: [] };
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  try {
    const content = fs.readFileSync(FALLBACK_FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    const initialDb: LocalDb = { users: [], predictions: [] };
    return initialDb;
  }
}

function saveLocalDb(data: LocalDb) {
  fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(data, null, 2));
}

// A helper flag to cache if postgres is down
let isPostgresOffline = false;

// Check connection to Postgres once on boot
async function checkDbConnection() {
  try {
    await prismaClient.$connect();
    isPostgresOffline = false;
  } catch (error) {
    isPostgresOffline = true;
    console.warn("⚠️ [NeuroVision DB] PostgreSQL connection failed. Falling back to JSON file-based database.");
  }
}

// Run connection check
checkDbConnection();

// Expose matching database methods
export const db = {
  user: {
    findUnique: async (args: { where: { email: string } }) => {
      const email = args.where.email.toLowerCase();
      if (!isPostgresOffline) {
        try {
          return await prismaClient.user.findUnique(args);
        } catch (e) {
          isPostgresOffline = true;
        }
      }
      
      // Fallback
      const local = getLocalDb();
      const user = local.users.find(u => u.email.toLowerCase() === email);
      return user || null;
    },
    create: async (args: { data: any }) => {
      if (!isPostgresOffline) {
        try {
          return await prismaClient.user.create(args);
        } catch (e) {
          isPostgresOffline = true;
        }
      }

      // Fallback
      const local = getLocalDb();
      const newUser = {
        id: `usr_${Math.random().toString(36).substring(2, 15)}`,
        createdAt: new Date().toISOString(),
        ...args.data
      };
      local.users.push(newUser);
      saveLocalDb(local);
      return newUser;
    }
  },
  predictionHistory: {
    findMany: async (args: { where: { userId: string }, orderBy?: { timestamp: 'asc' | 'desc' } }) => {
      const userId = args.where.userId;
      if (!isPostgresOffline) {
        try {
          return await prismaClient.predictionHistory.findMany(args);
        } catch (e) {
          isPostgresOffline = true;
        }
      }

      // Fallback
      const local = getLocalDb();
      let list = local.predictions.filter(p => p.userId === userId);
      
      // Sort
      const order = args.orderBy?.timestamp || 'desc';
      list.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return order === 'desc' ? timeB - timeA : timeA - timeB;
      });

      return list;
    },
    create: async (args: { data: any }) => {
      if (!isPostgresOffline) {
        try {
          return await prismaClient.predictionHistory.create(args);
        } catch (e) {
          isPostgresOffline = true;
        }
      }

      // Fallback
      const local = getLocalDb();
      const newPrediction = {
        id: `scan_${Math.random().toString(36).substring(2, 15)}`,
        timestamp: new Date().toISOString(),
        ...args.data
      };
      local.predictions.push(newPrediction);
      saveLocalDb(local);
      return newPrediction;
    }
  }
};
