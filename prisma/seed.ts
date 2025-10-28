import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
const email = process.env.ADMIN_EMAIL || "admin@rapchai.com";
const password = process.env.ADMIN_PASSWORD || "admin123";
const passwordHash = await hash(password, 10);

await prisma.user.upsert({
where: { email },
update: { role: "ADMIN" as Role, passwordHash },
create: { email, name: "Rapchai Admin", role: "ADMIN" as Role, passwordHash },
});
}

main()
.then(async () => {
await prisma.$disconnect();
})
.catch(async (e) => {
console.error(e);
await prisma.$disconnect();
process.exit(1);
});
