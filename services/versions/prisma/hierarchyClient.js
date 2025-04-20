// services/hierarchy/prismaClient.js
import { PrismaClient as HierarchyClient } from './generated/hierarchy/index.js';

export const hierarchyPrisma = new HierarchyClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL_HIERARCHY,
        },
    },
});
