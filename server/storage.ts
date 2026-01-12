import { db } from "./db";
import {
  clients, invoices, deliveries,
  type InsertClient, type InsertInvoice, type InsertDelivery,
  type Client, type Invoice, type Delivery,
  type InvoiceWithClient, type DeliveryWithInvoice
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;

  // Invoices
  getInvoices(): Promise<InvoiceWithClient[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: number): Promise<void>;

  // Deliveries
  getDeliveries(): Promise<DeliveryWithInvoice[]>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDelivery(id: number, delivery: Partial<InsertDelivery>): Promise<Delivery>;

  // Stats
  getStats(): Promise<{
    totalSales: number;
    invoiceCount: number;
    pendingDeliveries: number;
    topClients: { id: number; name: string; totalAmount: number }[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: number, updates: Partial<InsertClient>): Promise<Client> {
    const [client] = await db
      .update(clients)
      .set(updates)
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  async getInvoices(): Promise<InvoiceWithClient[]> {
    return await db.query.invoices.findMany({
      with: { client: true },
      orderBy: desc(invoices.date),
    });
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  async updateInvoice(id: number, updates: Partial<InsertInvoice>): Promise<Invoice> {
    const [invoice] = await db
      .update(invoices)
      .set(updates)
      .where(eq(invoices.id, id))
      .returning();
    return invoice;
  }

  async deleteInvoice(id: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  async getDeliveries(): Promise<DeliveryWithInvoice[]> {
    return await db.query.deliveries.findMany({
      with: {
        invoice: {
          with: { client: true },
        },
      },
      orderBy: desc(deliveries.deliveryDate),
    });
  }

  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const [delivery] = await db.insert(deliveries).values(insertDelivery).returning();
    return delivery;
  }

  async updateDelivery(id: number, updates: Partial<InsertDelivery>): Promise<Delivery> {
    const [delivery] = await db
      .update(deliveries)
      .set(updates)
      .where(eq(deliveries.id, id))
      .returning();
    return delivery;
  }

  async getStats() {
    // Total Sales
    const [salesResult] = await db
      .select({ total: sql<string>`sum(${invoices.amount})` })
      .from(invoices)
      .where(eq(invoices.status, "paid"));
    
    // Invoice Count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices);

    // Pending Deliveries
    const [pendingResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(deliveries)
      .where(eq(deliveries.status, "pending"));

    // Top Clients
    const topClients = await db
      .select({
        id: clients.id,
        name: clients.name,
        totalAmount: sql<number>`sum(${invoices.amount})`,
      })
      .from(clients)
      .innerJoin(invoices, eq(clients.id, invoices.clientId))
      .where(eq(invoices.status, "paid"))
      .groupBy(clients.id, clients.name)
      .orderBy(desc(sql`sum(${invoices.amount})`))
      .limit(5);

    return {
      totalSales: parseFloat(salesResult?.total || "0"),
      invoiceCount: Number(countResult?.count || 0),
      pendingDeliveries: Number(pendingResult?.count || 0),
      topClients: topClients.map(c => ({...c, totalAmount: Number(c.totalAmount)})),
    };
  }
}

export const storage = new DatabaseStorage();
