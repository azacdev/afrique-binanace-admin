import { config } from "dotenv";
import { db } from "../db/drizzle";
import { user, account } from "../db/schema";
import { scryptSync, randomBytes } from "crypto";

config({ path: ".env" });

// Better Auth's password hashing format: salt:hash (both hex, using scrypt)
// From source: N=16384, r=16, p=1, dkLen=64
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  // scrypt params: password, salt, keylen, options
  // Better Auth uses: N=16384, r=16, p=1, dkLen=64
  const hash = scryptSync(password.normalize("NFKC"), salt, 64, {
    N: 16384,
    r: 16,
    p: 1,
    maxmem: 128 * 16384 * 16 * 2,
  }).toString("hex");
  // Format: salt:hash (not hash.salt!)
  return `${salt}:${hash}`;
}

async function seed() {
  const email = "admin@afriquebitcoin.com";
  const password = "Admin123!";
  const name = "Admin";

  console.log("Creating first admin user...");

  // First, clean up any existing user with this email
  const { eq } = await import("drizzle-orm");

  const existingUsers = await db
    .select()
    .from(user)
    .where(eq(user.email, email));

  if (existingUsers.length > 0) {
    console.log("Deleting existing user with same email...");
    await db.delete(account).where(eq(account.userId, existingUsers[0].id));
    await db.delete(user).where(eq(user.email, email));
  }

  const userId = crypto.randomUUID();
  const hashedPassword = hashPassword(password);

  console.log(
    "Hash format (salt:hash):",
    hashedPassword.substring(0, 50) + "..."
  );

  // Create user
  await db.insert(user).values({
    id: userId,
    email,
    name,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create credential account
  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`✅ Admin created!`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`\n⚠️  Change the password after first login!`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding:", err);
  process.exit(1);
});
