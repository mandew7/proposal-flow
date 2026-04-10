import bcrypt from "bcryptjs";
import { PrismaClient, ProposalStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();
const demoPassword = process.env.DEMO_PASSWORD ?? "DemoPass123!";

type SeedProposal = {
  title: string;
  description: string;
  amount: number;
  status: ProposalStatus;
  dueOffsetDays: number;
};

type SeedClient = {
  name: string;
  company: string;
  email: string;
  proposals: SeedProposal[];
};

type SeedUser = {
  name: string;
  email: string;
  role: UserRole;
  clients: SeedClient[];
};

function addDays(offset: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

async function upsertUser(name: string, email: string, role: UserRole, passwordHash: string) {
  return prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      name,
      role,
      passwordHash,
    },
    create: {
      name,
      email: email.toLowerCase(),
      role,
      passwordHash,
    },
  });
}

async function resetDemoWorkspace(userId: string) {
  await prisma.activityLog.deleteMany({
    where: {
      OR: [{ actorUserId: userId }, { targetUserId: userId }],
    },
  });
  await prisma.proposal.deleteMany({ where: { userId } });
  await prisma.client.deleteMany({ where: { userId } });
  await prisma.session.deleteMany({ where: { userId } });
}

async function seedUserWorkspace(user: SeedUser, passwordHash: string) {
  const savedUser = await upsertUser(user.name, user.email, user.role, passwordHash);

  if (user.role !== "ADMIN") {
    await resetDemoWorkspace(savedUser.id);
  }

  const createdProposals: Array<{ id: string; title: string; status: ProposalStatus }> = [];

  for (const client of user.clients) {
    const savedClient = await prisma.client.create({
      data: {
        userId: savedUser.id,
        name: client.name,
        company: client.company,
        email: client.email.toLowerCase(),
      },
    });

    await prisma.activityLog.create({
      data: {
        actorUserId: savedUser.id,
        targetUserId: savedUser.id,
        action: "CLIENT_CREATED",
        entityType: "Client",
        entityId: savedClient.id,
        metadata: JSON.stringify({ company: savedClient.company, email: savedClient.email }),
      },
    });

    for (const proposal of client.proposals) {
      const savedProposal = await prisma.proposal.create({
        data: {
          userId: savedUser.id,
          clientId: savedClient.id,
          title: proposal.title,
          description: proposal.description,
          amount: proposal.amount,
          status: proposal.status,
          dueDate: addDays(proposal.dueOffsetDays),
        },
      });

      createdProposals.push({
        id: savedProposal.id,
        title: savedProposal.title,
        status: savedProposal.status,
      });

      await prisma.activityLog.create({
        data: {
          actorUserId: savedUser.id,
          targetUserId: savedUser.id,
          action: "PROPOSAL_CREATED",
          entityType: "Proposal",
          entityId: savedProposal.id,
          metadata: JSON.stringify({ title: savedProposal.title, status: savedProposal.status }),
        },
      });

      if (proposal.status !== ProposalStatus.DRAFT) {
        await prisma.activityLog.create({
          data: {
            actorUserId: savedUser.id,
            targetUserId: savedUser.id,
            action: "PROPOSAL_STATUS_CHANGED",
            entityType: "Proposal",
            entityId: savedProposal.id,
            metadata: JSON.stringify({ title: savedProposal.title, status: savedProposal.status }),
          },
        });
      }
    }
  }

  await prisma.activityLog.create({
    data: {
      actorUserId: savedUser.id,
      targetUserId: savedUser.id,
      action: user.role === "ADMIN" ? "ADMIN_SEEDED" : "USER_SEEDED",
      entityType: "User",
      entityId: savedUser.id,
      metadata: JSON.stringify({ email: savedUser.email, proposals: createdProposals.length }),
    },
  });

  return savedUser;
}

const demoUsers: SeedUser[] = [
  {
    name: "ProposalFlow Admin",
    email: "admin@proposalflow.demo",
    role: UserRole.ADMIN,
    clients: [],
  },
  {
    name: "Maya Chen",
    email: "maya@proposalflow.demo",
    role: UserRole.USER,
    clients: [
      {
        name: "Taylor Morgan",
        company: "Northstar Studio",
        email: "taylor@northstar.studio",
        proposals: [
          {
            title: "Northstar rebrand rollout",
            description: "Brand refresh, launch assets, and implementation support across marketing channels.",
            amount: 18000,
            status: ProposalStatus.ACCEPTED,
            dueOffsetDays: -18,
          },
          {
            title: "Northstar campaign landing page",
            description: "Design and build a conversion-focused landing page for the spring acquisition campaign.",
            amount: 9600,
            status: ProposalStatus.VIEWED,
            dueOffsetDays: 7,
          },
        ],
      },
      {
        name: "Jordan Ellis",
        company: "Riverline Health",
        email: "jordan@riverlinehealth.com",
        proposals: [
          {
            title: "Patient onboarding portal refresh",
            description: "UX update for intake flows, appointment conversion, and support content structure.",
            amount: 24500,
            status: ProposalStatus.SENT,
            dueOffsetDays: 10,
          },
          {
            title: "Content strategy workshop",
            description: "Stakeholder workshop and content model recommendations for the care navigation experience.",
            amount: 6800,
            status: ProposalStatus.DRAFT,
            dueOffsetDays: 16,
          },
        ],
      },
      {
        name: "Priya Nair",
        company: "Atlas Ops",
        email: "priya@atlasops.io",
        proposals: [
          {
            title: "Operations dashboard modernization",
            description: "Data-dense dashboard redesign for reporting, alerts, and executive summaries.",
            amount: 32000,
            status: ProposalStatus.REJECTED,
            dueOffsetDays: -9,
          },
        ],
      },
    ],
  },
  {
    name: "Ethan Walker",
    email: "ethan@proposalflow.demo",
    role: UserRole.USER,
    clients: [
      {
        name: "Avery Brooks",
        company: "Summit Labs",
        email: "avery@summitlabs.ai",
        proposals: [
          {
            title: "Summit Labs investor microsite",
            description: "Messaging architecture, design system extension, and launch-ready investor microsite build.",
            amount: 14000,
            status: ProposalStatus.ACCEPTED,
            dueOffsetDays: -4,
          },
          {
            title: "Quarterly product storytelling package",
            description: "Monthly narrative support for product updates, release pages, and internal launch kits.",
            amount: 5200,
            status: ProposalStatus.VIEWED,
            dueOffsetDays: 5,
          },
        ],
      },
      {
        name: "Morgan Patel",
        company: "Cinder Commerce",
        email: "morgan@cindercommerce.com",
        proposals: [
          {
            title: "Retention email system overhaul",
            description: "Lifecycle strategy, modular email templates, and reporting improvements for retention campaigns.",
            amount: 11800,
            status: ProposalStatus.SENT,
            dueOffsetDays: 12,
          },
          {
            title: "Holiday promotion creative support",
            description: "Rapid-turn campaign design support for paid, email, and on-site creative placements.",
            amount: 7600,
            status: ProposalStatus.REJECTED,
            dueOffsetDays: -13,
          },
        ],
      },
      {
        name: "Lena Ortiz",
        company: "Harbor Advisory",
        email: "lena@harboradvisory.co",
        proposals: [
          {
            title: "Client portal experience audit",
            description: "Usability review, improvement backlog, and delivery roadmap for the advisory client portal.",
            amount: 8900,
            status: ProposalStatus.DRAFT,
            dueOffsetDays: 21,
          },
        ],
      },
    ],
  },
];

async function main() {
  if (demoPassword.length < 8) {
    throw new Error("DEMO_PASSWORD must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(demoPassword, 12);

  for (const user of demoUsers) {
    await seedUserWorkspace(user, passwordHash);
  }

  console.log("Seed complete.");
  console.log(`Admin: admin@proposalflow.demo / ${demoPassword}`);
  console.log(`Demo users: maya@proposalflow.demo / ${demoPassword}, ethan@proposalflow.demo / ${demoPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
