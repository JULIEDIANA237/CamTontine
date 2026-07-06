# Phase 2 – Modélisation métier

## 1️⃣ Entités du domaine (préliminaires)
| Entité | Attributs majeurs (type) | Description |
|--------|--------------------------|-------------|
| **User** | id (String) PK, email (String, unique), passwordHash (String), fullName (String), role (enum: ADMIN, MANAGER, MEMBER), locale (enum: FR, EN), createdAt (DateTime), updatedAt (DateTime) | Représente un compte d’accès à la plateforme. |
| **Tontine** | id (String) PK, name (String), description (String?), targetAmount (Decimal), frequency (enum: MONTHLY, BIMONTHLY, QUARTERLY), startDate (DateTime), endDate (DateTime?), status (enum: DRAFT, ACTIVE, SUSPENDED, CLOSED), managerId (FK → User), createdAt (DateTime), updatedAt (DateTime) | Regroupe les membres autour d’un objectif d’épargne collective. |
| **Member** | id (String) PK, userId (FK → User), tontineId (FK → Tontine), status (enum: ACTIVE, INACTIVE, LEFT), joinedAt (DateTime), leftAt (DateTime?) | Lien entre un **User** et une **Tontine** (adhésion). |
| **Invitation** | id (String) PK, email (String), token (String, unique), tontineId (FK → Tontine), expiresAt (DateTime), createdAt (DateTime) | Invitation à rejoindre une tontine, valide 7 jours. |
| **ContributionCycle** | id (String) PK, tontineId (FK → Tontine), cycleNumber (Int), dueDate (DateTime), status (enum: PENDING, CLOSED) | Représente une échéance de cotisation (ex. : mois 1). |
| **Contribution** | id (String) PK, memberId (FK → Member), cycleId (FK → ContributionCycle), amount (Decimal), paymentStatus (enum: PENDING, PAID, FAILED), paidAt (DateTime?), penaltyAmount (Decimal?) | Paiement effectif d’un membre pour une échéance. |
| **Payout** | id (String) PK, tontineId (FK → Tontine), cycleId (FK → ContributionCycle), beneficiaryMemberId (FK → Member), amount (Decimal), status (enum: PENDING, SUCCESS, FAILED), processedAt (DateTime?) | Paiement du bénéficiaire du cycle. |
| **Notification** | id (String) PK, userId (FK → User), type (enum: EMAIL, SMS, WHATSAPP), payload (Json), sentAt (DateTime), status (enum: SENT, FAILED) | Message envoyé aux utilisateurs. |
| **AuditLog** | id (String) PK, actorId (FK → User), action (String), entity (String), entityId (String), beforeJson (Json?), afterJson (Json?), timestamp (DateTime) | Historisation immuable des actions. |
| **Report** | id (String) PK, tontineId (FK → Tontine), type (enum: PDF, EXCEL), generatedAt (DateTime), fileUrl (String) | Documents exportés (rapports, états). |
| **Setting** | key (String) PK, value (String), description (String?) | Paramètres globaux configurables. |
| **PayoutOrder** | id (String) PK, tontineId (FK → Tontine), membershipId (FK → Membership), sequence (Int), status (enum: SCHEDULED, COMPLETED, SKIPPED, CANCELLED), exchangedWithOrderId (String?, FK → PayoutOrder), createdAt (DateTime) | Gestion du calendrier de bénéficiaires, permet les échanges et le suivi du statut de chaque tour. |
## 2️⃣ Relations (UML/ER)
- **User** 1 — * **Member** (un utilisateur peut appartenir à plusieurs tontines).  
- **User** 1 — * **Invitation** (un utilisateur peut envoyer plusieurs invitations).  
- **Tontine** 1 — * **Member**.  
- **Tontine** 1 — * **ContributionCycle**.  
- **ContributionCycle** 1 — * **Contribution**.  
- **Contribution** * — 1 **Member** (le cotisant).  
- **Payout** * — 1 **Member** (le bénéficiaire).  
- **Notification** * — 1 **User**.  
- **AuditLog** * — 1 **User** (acteur).  

## 3️⃣ Diagrammes Mermaid (fichiers séparés)
- **UML class diagram** → `docs/uml_class_diagram.mmd`
- **ER diagram** → `docs/erd_diagram.mmd`

## 4️⃣ Aperçu du schéma Prisma (preview only)
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  passwordHash String
  fullName    String?
  role        Role
  locale      Locale   @default(FR)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  members     Member[]
  invitations Invitation[]
  notifications Notification[]
  auditLogs   AuditLog[]
}

enum Role { ADMIN MANAGER MEMBER }
enum Locale { FR EN }

model Tontine {
  id          String   @id @default(cuid())
  name        String
  description String?
  targetAmount Decimal
  frequency   Frequency
  startDate   DateTime
  endDate     DateTime?
  status      TontineStatus @default(DRAFT)
  managerId   String
  manager     User    @relation(fields: [managerId], references: [id])
  members     Member[]
  cycles      ContributionCycle[]
  payouts     Payout[]
  reports     Report[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Frequency { MONTHLY BIMONTHLY QUARTERLY }
enum TontineStatus { DRAFT ACTIVE SUSPENDED CLOSED }

model Member {
  id         String   @id @default(cuid())
  userId     String
  tontineId  String
  status     MemberStatus @default(ACTIVE)
  joinedAt   DateTime @default(now())
  leftAt     DateTime?
  user       User     @relation(fields: [userId], references: [id])
  tontine    Tontine  @relation(fields: [tontineId], references: [id])
  contributions Contribution[]
  payouts    Payout[] // as beneficiary
}

enum MemberStatus { ACTIVE INACTIVE LEFT }

model Invitation {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  tontineId String
  expiresAt DateTime
  createdAt DateTime @default(now())
  tontine   Tontine @relation(fields: [tontineId], references: [id])
}

model ContributionCycle {
  id          String   @id @default(cuid())
  tontineId   String
  cycleNumber Int
  dueDate     DateTime
  status      CycleStatus @default(PENDING)
  tontine     Tontine @relation(fields: [tontineId], references: [id])
  contributions Contribution[]
  payouts      Payout[]
}

enum CycleStatus { PENDING CLOSED }

model Contribution {
  id            String   @id @default(cuid())
  memberId      String
  cycleId       String
  amount        Decimal
  paymentStatus PaymentStatus @default(PENDING)
  paidAt        DateTime?
  penaltyAmount Decimal?  @default(0)
  member        Member   @relation(fields: [memberId], references: [id])
  cycle         ContributionCycle @relation(fields: [cycleId], references: [id])
}

enum PaymentStatus { PENDING PAID FAILED }

model Payout {
  id                 String   @id @default(cuid())
  tontineId          String
  cycleId            String
  beneficiaryMemberId String
  amount             Decimal
  status             PayoutStatus @default(PENDING)
  processedAt        DateTime?
  tontine            Tontine @relation(fields: [tontineId], references: [id])
  cycle              ContributionCycle @relation(fields: [cycleId], references: [id])
  beneficiaryMember  Member @relation(fields: [beneficiaryMemberId], references: [id])
}

enum PayoutStatus { PENDING SUCCESS FAILED }

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      NotificationType
  payload   Json
  sentAt    DateTime @default(now())
  status    NotificationStatus @default(SENT)
  user      User @relation(fields: [userId], references: [id])
}

enum NotificationType { EMAIL SMS WHATSAPP }
enum NotificationStatus { SENT FAILED }

model AuditLog {
  id          String   @id @default(cuid())
  actorId     String
  action      String
  entity      String
  entityId    String
  beforeJson  Json?
  afterJson   Json?
  timestamp   DateTime @default(now())
  actor       User @relation(fields: [actorId], references: [id])
}

model Report {
  id          String   @id @default(cuid())
  tontineId   String
  type        ReportType
  generatedAt DateTime @default(now())
  fileUrl     String
  tontine     Tontine @relation(fields: [tontineId], references: [id])
}

enum ReportType { PDF EXCEL }

model Setting {
  key   String @id
  value String
  description String?
}
```
### Nouvel enum `BeneficiaryTurnStatus`

| Valeur | Signification |
|--------|----------------|
| `SCHEDULED` | Le tour est prévu mais pas encore exécuté. |
| `COMPLETED` | Le bénéficiaire a reçu son paiement. |
| `SKIPPED`   | Le tour a été sauté (membre absent). |
| `CANCELLED` | Le tour a été annulé (membre a quitté la tontine). |

Ce champ est utilisé dans le modèle **PayoutOrder** pour suivre le statut du tour et permettre les échanges de tours via les champs `exchangedWithOrderId`, `exchangedWithOrder` et `exchangedOrders`.
