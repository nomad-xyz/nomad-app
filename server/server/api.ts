
import { PrismaClient } from "@prisma/client";

export class DB {
  client: PrismaClient;

  constructor() {
    this.client = new PrismaClient()
  }

  async connect() {}

  async disconnect() {
    await this.client.$disconnect()
  }

  async getWalletAgreement(wallet: string): Promise<Date | undefined> {
    const agreement = await this.client.termsAgreements.findUnique({
      where: {
        wallet
      }
    })
    return agreement?.timestamp
  }

  async agreeTerms(wallet: string) {
    await this.client.termsAgreements.create({
      data: {
        wallet,
      }
    })
  }
}

export const db = new DB();
await db.connect();
