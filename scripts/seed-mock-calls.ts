/**
 * 🧪 SCRIPT: seed-mock-calls.ts
 * Doel: Vullen van de database met realistische testdata voor Marc en Stephan.
 *
 * Usage: npx ts-node scripts/seed-mock-calls.ts
 */

import { PrismaClient, CallIntent, CallMode, CallPriority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Start seeding mock calls...');

  // 1. Zoek de tenants op
  const marc = await prisma.tenant.findFirst({
    where: {
      OR: [
        { name: { contains: 'Marc', mode: 'insensitive' } },
        { name: { contains: 'Zoetemeijer', mode: 'insensitive' } }
      ]
    }
  });

  const stephan = await prisma.tenant.findFirst({
    where: {
      OR: [
        { name: { contains: 'Stephan', mode: 'insensitive' } },
        { name: { contains: 'Meester', mode: 'insensitive' } }
      ]
    }
  });

  if (!marc && !stephan) {
    console.error("❌ Geen tenants gevonden. Draai eerst: npx ts-node prisma/seed.ts");
    process.exit(1);
  }

  console.log(`✅ Tenants gevonden:`);
  if (marc) console.log(`   - Marc: ${marc.name} (${marc.id})`);
  if (stephan) console.log(`   - Stephan: ${stephan.name} (${stephan.id})`);

  let totalCreated = 0;

  // 2. Mock Calls voor Marc (Budgetbeheer - Shield Mode focus)
  if (marc) {
    const marcCalls = [
      {
        vapiCallId: `call-marc-shield-1-${Date.now()}`,
        organizationId: marc.id,
        customerName: 'Incasso Bureau Amsterdam',
        summary: 'Agressieve beller eist direct contact over dossier INV-2024-001.',
        transcript: 'Luister goed, ik ben van het incassobureau en Marc moet nu betalen anders komen we langs.',
        priority: CallPriority.CRITICAL,
        mode: CallMode.DEFENSIVE,
        intent: CallIntent.FINANCIAL,  // ✅ FIXED: Was DEBT_COLLECTION
        companyName: 'Incasso Bureau Amsterdam',
        invoiceNumber: 'INV-2024-001',
        duration: 145,
        requiresReview: true
      },
      {
        vapiCallId: `call-marc-shield-2-${Date.now() + 1}`,
        organizationId: marc.id,
        customerName: 'Deurwaarder Smith & Partners',
        summary: 'Deurwaarder belt over openstaand bedrag factuur DW-2024-456.',
        transcript: 'Goedemiddag, u spreekt met deurwaarder Smith. We hebben een openstaande vordering van €2.450. U heeft 48 uur om te reageren.',
        priority: CallPriority.HIGH,
        mode: CallMode.DEFENSIVE,
        intent: CallIntent.FINANCIAL,  // ✅ FIXED
        companyName: 'Deurwaarder Smith & Partners',
        invoiceNumber: 'DW-2024-456',
        duration: 198,
        requiresReview: true
      },
      {
        vapiCallId: `call-marc-lead-1-${Date.now() + 2}`,
        organizationId: marc.id,
        customerName: 'Jan Pietersen',
        phoneNumber: '+31612345678',
        summary: 'Vriendelijke vraag over budgetoverzicht van deze maand.',
        transcript: 'Hoi Marc, ik wilde even vragen of mijn budgetoverzicht al klaar is voor januari. Bedankt voor je hulp!',
        priority: CallPriority.LOW,
        mode: CallMode.SALES,
        intent: CallIntent.FAQ,
        duration: 60,
        requiresReview: false
      },
      {
        vapiCallId: `call-marc-lead-2-${Date.now() + 3}`,
        organizationId: marc.id,
        customerName: 'Maria de Vries',
        phoneNumber: '+31687654321',
        email: 'maria@example.com',
        summary: 'Wil kennismaken en gesprek plannen over financieel advies.',
        transcript: 'Goedemorgen, ik hoorde van een bekende dat Marc heel goed is met budgetbeheer. Ik zou graag een afspraak maken om te bespreken hoe ik mijn financiën beter kan organiseren.',
        priority: CallPriority.MEDIUM,
        mode: CallMode.SALES,
        intent: CallIntent.LEAD,
        duration: 180,
        appointment: true,
        requiresReview: false
      },
      {
        vapiCallId: `call-marc-spam-1-${Date.now() + 4}`,
        organizationId: marc.id,
        customerName: 'Onbekend (Marketing)',
        summary: 'Telemarketing call over verzekeringen.',
        transcript: 'Goedemiddag, u spreekt met... *klik* [Opgehangen door AI]',
        priority: CallPriority.LOW,
        mode: CallMode.SALES,
        intent: CallIntent.SPAM,
        duration: 12,
        requiresReview: false
      }
    ];

    for (const call of marcCalls) {
      await prisma.call.create({ data: call });
      totalCreated++;
    }

    console.log(`✅ Mock data voor Marc aangemaakt: ${marcCalls.length} calls`);
  }

  // 3. Mock Calls voor Stephan (Bestratingen - Sales focus)
  if (stephan) {
    const stephanCalls = [
      {
        vapiCallId: `call-stephan-urgent-1-${Date.now() + 10}`,
        organizationId: stephan.id,
        customerName: 'Dirk van Dam',
        phoneNumber: '+31623456789',
        email: 'dirk@example.com',
        summary: 'Spoedaanvraag voor bestrating oprit (150m²).',
        transcript: 'Ik heb morgen iemand nodig voor mijn oprit. Het gaat om ongeveer 150 vierkante meter. Kan Stephan vandaag nog langskomen voor een offerte?',
        priority: CallPriority.HIGH,
        mode: CallMode.SALES,
        intent: CallIntent.LEAD,
        duration: 210,
        appointment: true,
        requiresReview: false
      },
      {
        vapiCallId: `call-stephan-lead-1-${Date.now() + 11}`,
        organizationId: stephan.id,
        customerName: 'Petra Jansen',
        phoneNumber: '+31698765432',
        summary: 'Vraag over kosten bestrating tuin (80m²).',
        transcript: 'Goedemiddag, ik wil graag mijn achtertuin laten bestraten. Het gaat om ongeveer 80 vierkante meter. Wat zijn jullie tarieven en hoe snel kunnen jullie beginnen?',
        priority: CallPriority.MEDIUM,
        mode: CallMode.SALES,
        intent: CallIntent.LEAD,
        duration: 156,
        appointment: false,
        requiresReview: false
      },
      {
        vapiCallId: `call-stephan-faq-1-${Date.now() + 12}`,
        organizationId: stephan.id,
        customerName: 'Kees Bakker',
        phoneNumber: '+31634567890',
        summary: 'Vraag over openingstijden en locatie.',
        transcript: 'Hallo, ik wilde even vragen wat jullie openingstijden zijn en waar jullie kantoor precies zit?',
        priority: CallPriority.LOW,
        mode: CallMode.SALES,
        intent: CallIntent.FAQ,
        duration: 45,
        requiresReview: false
      },
      {
        vapiCallId: `call-stephan-shield-1-${Date.now() + 13}`,
        organizationId: stephan.id,
        customerName: 'Incassobureau Zuid',
        summary: 'Beller claimt onbetaalde factuur voor eerdere klus.',
        transcript: 'U spreekt met Incassobureau Zuid. We bellen namens bouwmaterialenleverancier X over een openstaande factuur van €8.500.',
        priority: CallPriority.HIGH,
        mode: CallMode.DEFENSIVE,
        intent: CallIntent.FINANCIAL,  // ✅ FIXED
        companyName: 'Incassobureau Zuid',
        invoiceNumber: 'BML-2024-789',
        duration: 167,
        requiresReview: true
      },
      {
        vapiCallId: `call-stephan-lead-2-${Date.now() + 14}`,
        organizationId: stephan.id,
        customerName: 'Familie van der Berg',
        phoneNumber: '+31645678901',
        email: 'vandenberg@example.com',
        summary: 'Offerte aanvraag voor complete oprit (200m²) inclusief drainage.',
        transcript: 'We willen onze oprit volledig vernieuwen, inclusief drainage. Het gaat om 200 vierkante meter. We hebben gehoord dat S. Meester Bestratingen erg goed werk levert.',
        priority: CallPriority.MEDIUM,
        mode: CallMode.SALES,
        intent: CallIntent.LEAD,
        duration: 285,
        appointment: true,
        requiresReview: false
      }
    ];

    for (const call of stephanCalls) {
      await prisma.call.create({ data: call });
      totalCreated++;
    }

    console.log(`✅ Mock data voor Stephan aangemaakt: ${stephanCalls.length} calls`);
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Mock data succesvol geladen!`);
  console.log('═══════════════════════════════════════════════════');
  console.log(`📊 Totaal: ${totalCreated} calls aangemaakt`);
  if (marc) console.log(`   - Marc's Vault: 5 calls (2 Shield CRITICAL/HIGH, 2 Sales, 1 Spam)`);
  if (stephan) console.log(`   - Stephan's Vault: 5 calls (1 Shield HIGH, 4 Sales)`);
  console.log('');
  console.log('🔍 Verificatie URLs:');
  if (marc) console.log(`   Marc:    http://localhost:3001/api/get-calls?orgId=${marc.id}`);
  if (stephan) console.log(`   Stephan: http://localhost:3001/api/get-calls?orgId=${stephan.id}`);
  console.log('');
  console.log('🎨 Open Prisma Studio: http://localhost:5555');
  console.log('   → Klik op "Call" tabel om de data te zien');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
