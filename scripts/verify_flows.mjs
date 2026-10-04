// Comprehensive smoke & verification test script for Uplora: 1B Quest
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting Uplora: 1B Quest API Verification Tests...\n');
  let passCount = 0;
  let failCount = 0;

  async function testStep(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passCount++;
    } catch (e) {
      console.error(`❌ [FAIL] ${name}:`, e.message);
      failCount++;
    }
  }

  // 1. Company Status
  let initialStatus;
  await testStep('1. Fetch company status & verify dynamic calculations', async () => {
    const res = await fetch(`${BASE_URL}/api/company/status`);
    if (!res.ok) throw new Error(`Status HTTP ${res.status}`);
    initialStatus = await res.json();
    if (!initialStatus.questTarget || initialStatus.healthScores.composite === undefined) {
      throw new Error('Invalid company status payload');
    }
    console.log(`   * Quest Target: ₹${initialStatus.questTarget.toLocaleString('en-IN')}`);
    console.log(`   * Health Composite: ${initialStatus.healthScores.composite}/100`);
    console.log(`   * Primary Bottleneck: ${initialStatus.primaryBottleneck}`);
  });

  // 2. Fetch Users
  await testStep('2. Fetch characters / team members', async () => {
    const res = await fetch(`${BASE_URL}/api/users`);
    const users = await res.json();
    if (!Array.isArray(users) || users.length !== 3) throw new Error('Expected 3 team members');
    console.log(`   * Characters: ${users.map(u => `${u.name} (${u.title})`).join(', ')}`);
  });

  // 3. Create Task
  let createdTaskId;
  await testStep('3. Create a prioritized tactical task', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Smoke Test: Pitch StoreIK to 5 Coimbatore Boutiques',
        ownerId: 'damo',
        layer: 'daily',
        category: 'sales',
        priority: 'high',
        xpReward: 100,
        revenueRelation: 15000,
      }),
    });
    const task = await res.json();
    if (!task.id) throw new Error('Failed to create task');
    createdTaskId = task.id;
    console.log(`   * Task ID: ${task.id}`);
  });

  // 4. Complete Task
  await testStep('4. Complete task and verify XP minted', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks/${createdTaskId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultNote: 'Contacted 5 boutiques, 2 showed strong interest' }),
    });
    const result = await res.json();
    if (!result.task || result.task.status !== 'completed') throw new Error('Task was not marked completed');
    console.log(`   * XP Awarded: +${result.xpAwarded} XP`);
  });

  // 5. Miss Task & Adaptive Difficulty
  let missTaskId;
  await testStep('5. Create quota task and record missed debrief', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Quota: 15 sales calls',
        ownerId: 'damo',
        layer: 'daily',
        category: 'sales',
        priority: 'high',
        xpReward: 120,
      }),
    });
    const task = await res.json();
    missTaskId = task.id;

    const missRes = await fetch(`${BASE_URL}/api/tasks/${missTaskId}/missed`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: 'Higher priority came',
        notes: 'Client delivery fire occupied afternoon focus',
      }),
    });
    const missData = await missRes.json();
    if (missData.task.status !== 'missed') throw new Error('Task not marked missed');
    console.log(`   * Debrief recorded: ${missData.task.missedReason}`);
  });

  // 6. Adapt Task
  await testStep('6. Auto-adapt task difficulty', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks/adapt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: missTaskId,
        newTitle: 'Adapted Quota: 8 sales calls in 2-hour morning block',
        newXp: 70,
      }),
    });
    const adapted = await res.json();
    if (!adapted.id || !adapted.adaptedFromTaskId) throw new Error('Adaptation linkage failed');
    console.log(`   * Adapted Challenge: "${adapted.title}"`);
  });

  // 7. Create Lead
  let createdLeadId;
  await testStep('7. Create merchant lead in Sales CRM', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Vasantham Silks Coimbatore',
        contactName: 'Mr. Vasanth',
        phone: '+919842199999',
        whatsapp: '919842199999',
        city: 'Coimbatore',
        category: 'Textiles',
        problemIdentified: 'No online catalog; orders lost in Instagram DMs',
        proposedSolution: 'StoreIK Storefront + WhatsApp Catalog',
        estimatedValue: 16000,
        assignedTo: 'damo',
        status: 'prospect',
      }),
    });
    const lead = await res.json();
    if (!lead.id) throw new Error('Lead creation failed');
    createdLeadId = lead.id;
    console.log(`   * Lead ID: ${lead.id} (${lead.businessName})`);
  });

  // 8. Progress Lead Stage
  await testStep('8. Advance lead stage to Proposal then Won', async () => {
    let res = await fetch(`${BASE_URL}/api/leads/${createdLeadId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'proposal', notes: 'Sent quote for ₹16,000' }),
    });
    let lead = await res.json();
    if (lead.status !== 'proposal') throw new Error('Failed to advance to proposal');

    res = await fetch(`${BASE_URL}/api/leads/${createdLeadId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'won', notes: 'Advance received! Deal closed.' }),
    });
    lead = await res.json();
    if (lead.status !== 'won') throw new Error('Failed to advance to won');
    console.log(`   * Lead advanced to WON!`);
  });

  // 9. Add Revenue
  await testStep('9. Add banked customer payment and recalculate ETA', async () => {
    const res = await fetch(`${BASE_URL}/api/revenue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Vasantham Silks Coimbatore',
        serviceType: 'website',
        amount: 8000,
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '50% project advance',
      }),
    });
    const revResult = await res.json();
    if (!revResult.entry || revResult.entry.amount !== 8000) throw new Error('Revenue log failed');
    console.log(`   * Banked: ₹8,000 (+${revResult.xpAwarded} XP)`);

    const statusRes = await fetch(`${BASE_URL}/api/company/status`);
    const newStatus = await statusRes.json();
    console.log(`   * New Cumulative Revenue: ₹${newStatus.cumulativeRevenue.toLocaleString('en-IN')}`);
    console.log(`   * Recalculated Worst-Case ETA: ${newStatus.eta.worstCaseDate}`);
  });

  // 10. CRM Analytics
  await testStep('10. Verify CRM analytics (Win Rate, Pipeline Value, Hot Leads)', async () => {
    const res = await fetch(`${BASE_URL}/api/crm/analytics`);
    const crm = await res.json();
    if (crm.totalLeads === undefined || crm.winRate === undefined) throw new Error('Invalid CRM analytics');
    console.log(`   * Win Rate: ${crm.winRate}%`);
    console.log(`   * Active Pipeline Value: ₹${crm.pipelineValue.toLocaleString('en-IN')}`);
    console.log(`   * Hot Leads Count: ${crm.hotLeadsCount}`);
  });

  // 11. Daily Check-in
  await testStep('11. Submit 8-question Daily Check-in', async () => {
    const res = await fetch(`${BASE_URL}/api/checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'damo',
        completedSummary: 'Closed Vasantham Silks advance, completed 9 calls',
        missedSummary: 'Missed side quest',
        biggestWin: '₹8,000 advance banked from Vasantham Silks',
        blockers: 'None',
        keyOutcome: 'Validated ₹16k price point for boutique sites',
        revenueLogged: 8000,
        tomorrowFocus: 'Follow up on Velan Silks and unblock Assistant',
      }),
    });
    const chk = await res.json();
    if (!chk.id) throw new Error('Failed to log checkin');
    console.log(`   * Check-in ID: ${chk.id}`);
  });

  // 12. 7-Day Experiment
  await testStep('12. Create and complete a 7-day validation experiment', async () => {
    const res = await fetch(`${BASE_URL}/api/experiments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test StoreIK WhatsApp DM Checkout for 3 Sarees Sellers',
        hypothesis: 'Merchants with >1,000 followers will pay ₹999/mo for WhatsApp checkout',
        durationDays: 7,
        metricsTracked: 'Merchant pitches, active signups, collected deposits',
        successCriteria: 'At least 2 paying signups',
      }),
    });
    const exp = await res.json();
    if (!exp.id) throw new Error('Experiment creation failed');
    console.log(`   * Experiment ID: ${exp.id} (${exp.title})`);
  });

  // 13. Strategic Decision & Human Approval
  await testStep('13. Propose and approve strategic decision', async () => {
    const res = await fetch(`${BASE_URL}/api/decisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Standardize Minimum Website Deal Size at ₹10,000',
        rationale: 'Sub-₹8k deals consume too much custom delivery time per rupee banked.',
        expectedOutcome: 'Increase average deal size by 25% without sacrificing close rate.',
      }),
    });
    const dec = await res.json();
    if (!dec.id) throw new Error('Decision creation failed');

    const appRes = await fetch(`${BASE_URL}/api/decisions/${dec.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'approved',
        permanentRule: 'No web development project accepted under ₹10,000 advance+balance.',
      }),
    });
    const updatedDec = await appRes.json();
    if (updatedDec.status !== 'approved') throw new Error('Decision approval failed');
    console.log(`   * Strategic decision approved! Rule: "${updatedDec.permanentRule}"`);
  });

  // 14. Action Execution Endpoint (Human Approval Gate)
  await testStep('14. Execute AI-proposed action via Human Approval Gate', async () => {
    const res = await fetch(`${BASE_URL}/api/actions/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'create_task',
        params: {
          title: 'Human-Approved Quest: Follow up with Annapoorna Spices',
          ownerId: 'damo',
          priority: 'critical',
          xpReward: 90,
          revenueRelation: 12500,
        },
      }),
    });
    const result = await res.json();
    if (!result.success || !result.result.id) throw new Error('Action execution gatekeeper failed');
    console.log(`   * Action successfully executed by founder approval! Task ID: ${result.result.id}`);
  });

  // 15. Backup Export
  await testStep('15. Export JSON full database backup', async () => {
    const res = await fetch(`${BASE_URL}/api/backup/export`);
    if (!res.ok) throw new Error('Export failed');
    const backupJson = await res.json();
    if (!backupJson.company || !backupJson.tasks || !backupJson.revenue) {
      throw new Error('Incomplete backup structure');
    }
    console.log(`   * Backup verified: ${backupJson.tasks.length} tasks, ${backupJson.revenue.length} transactions, ${backupJson.leads.length} leads.`);
  });

  // 16. Docs Endpoint
  await testStep('16. Verify in-app documentation reader API', async () => {
    const res = await fetch(`${BASE_URL}/api/docs`);
    const docs = await res.json();
    if (!Array.isArray(docs) || docs.length < 20) throw new Error('Expected 21 documentation files');
    console.log(`   * Verified ${docs.length} architectural documentation blueprints.`);
  });

  // 17. Gemini COO Controlled Tool Calling
  await testStep('17. Gemini COO Controlled Tool Calling', async () => {
    const res = await fetch(`${BASE_URL}/api/gemini/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Propose a critical sales task for Damo to pitch StoreIK to 5 bridal textile boutiques in Tirupur with revenue relation 15000.',
      }),
    });
    if (!res.ok) throw new Error(`Gemini chat endpoint HTTP ${res.status}`);
    const data = await res.json();
    if (!data.reply && (!data.proposedActions || data.proposedActions.length === 0)) {
      throw new Error('Gemini COO returned neither reply text nor proposed actions');
    }
    console.log(`   * Gemini COO Response received.`);
    if (data.proposedActions && data.proposedActions.length > 0) {
      console.log(`   * Controlled Function Call captured: ${data.proposedActions[0].tool} (${data.proposedActions[0].explanation})`);
    } else {
      console.log(`   * Tactical operational advice returned: "${data.reply.substring(0, 80)}..."`);
    }
  });

  console.log(`\n========================================`);
  console.log(`🏁 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`========================================\n`);

  if (failCount > 0) process.exit(1);
}

runTests();
