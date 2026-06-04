import { prisma as prismaClient } from './prisma';
import fs from 'fs';
import path from 'path';
import net from 'net';

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

// A helper flag to cache if postgres is down. Default to true until checked.
let isPostgresOffline = true;

// Helper to check if PostgreSQL port is open
function checkPostgresPort(): Promise<boolean> {
  return new Promise((resolve) => {
    let host = 'localhost';
    let port = 5432;
    
    const dbUrl = process.env.DATABASE_URL || '';
    const match = dbUrl.match(/@([^/:]+)(?::(\d+))?/);
    if (match) {
      host = match[1];
      if (match[2]) {
        port = parseInt(match[2], 10);
      }
    }
    
    const socket = new net.Socket();
    socket.setTimeout(1000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

// Check connection to Postgres once on boot
async function checkDbConnection() {
  const portOpen = await checkPostgresPort();
  if (!portOpen) {
    isPostgresOffline = true;
    console.warn("⚠️ [NeuroVision DB] PostgreSQL port is closed. Falling back to JSON file-based database.");
    return;
  }

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
