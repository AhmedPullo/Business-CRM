import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // Stats
  app.get(api.stats.get.path, isAuthenticated, async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Clients
  app.get(api.clients.list.path, isAuthenticated, async (req, res) => {
    const clients = await storage.getClients();
    res.json(clients);
  });

  app.get(api.clients.get.path, isAuthenticated, async (req, res) => {
    const client = await storage.getClient(Number(req.params.id));
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  });

  app.post(api.clients.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.clients.create.input.parse(req.body);
      const client = await storage.createClient(input);
      res.status(201).json(client);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.clients.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.clients.update.input.parse(req.body);
      const client = await storage.updateClient(Number(req.params.id), input);
      if (!client) return res.status(404).json({ message: "Client not found" });
      res.json(client);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.clients.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteClient(Number(req.params.id));
    res.status(204).send();
  });

  // Invoices
  app.get(api.invoices.list.path, isAuthenticated, async (req, res) => {
    const invoices = await storage.getInvoices();
    res.json(invoices);
  });

  app.post(api.invoices.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.invoices.create.input.parse(req.body);
      const invoice = await storage.createInvoice(input);
      res.status(201).json(invoice);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.invoices.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.invoices.update.input.parse(req.body);
      const invoice = await storage.updateInvoice(Number(req.params.id), input);
      if (!invoice) return res.status(404).json({ message: "Invoice not found" });
      res.json(invoice);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.invoices.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteInvoice(Number(req.params.id));
    res.status(204).send();
  });

  // Deliveries
  app.get(api.deliveries.list.path, isAuthenticated, async (req, res) => {
    const deliveries = await storage.getDeliveries();
    res.json(deliveries);
  });

  app.post(api.deliveries.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.deliveries.create.input.parse(req.body);
      const delivery = await storage.createDelivery(input);
      res.status(201).json(delivery);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.deliveries.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.deliveries.update.input.parse(req.body);
      const delivery = await storage.updateDelivery(Number(req.params.id), input);
      if (!delivery) return res.status(404).json({ message: "Delivery not found" });
      res.json(delivery);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const clients = await storage.getClients();
  if (clients.length === 0) {
    const c1 = await storage.createClient({
      name: "Downtown Café",
      cafeName: "The Beanery",
      address: "123 Main St",
      phone: "555-0101",
      email: "beanery@example.com"
    });
    const c2 = await storage.createClient({
      name: "Riverside Bistro",
      cafeName: "Riverside",
      address: "456 River Rd",
      phone: "555-0102",
      email: "riverside@example.com"
    });

    const i1 = await storage.createInvoice({
      clientId: c1.id,
      invoiceNumber: "INV-001",
      amount: "150.00",
      date: new Date().toISOString().split('T')[0],
      status: "paid"
    });
    
    await storage.createInvoice({
      clientId: c2.id,
      invoiceNumber: "INV-002",
      amount: "200.50",
      date: new Date().toISOString().split('T')[0],
      status: "pending"
    });

    await storage.createDelivery({
      invoiceId: i1.id,
      deliveryDate: new Date().toISOString().split('T')[0],
      status: "delivered",
      notes: "Left at back door"
    });
  }
}
