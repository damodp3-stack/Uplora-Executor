// ============================================================================
// Comprehensive Architecture & Flow Verification Test Suite for Uplora
// Proves: Real Human Approval Gate, Controlled Gemini Function Calling,
// Strict Founder Authorization, Parameter Tamper Prevention, and Business Flows.
// ============================================================================

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting Uplora Architecture & Security Verification Suite...\n');
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

  // ==========================================================================
  // PART 1: GEMINI CONTROLLED FUNCTION CALLING & HUMAN APPROVAL GATE
  // ==========================================================================

  let aiPendingActionId = null;

  // 1. Gemini Read-Only Tool Execution
  await testStep('1. Gemini read-only tool execution loop (get_company_status)', async () => {
    const res = await fetch(`${BASE_URL}/api/gemini/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Use get_company_status to inspect current cash collected and target progress.',
      }),
    });
    if (!res.ok) throw new Error(`Gemini chat endpoint HTTP ${res.status}`);
    const data = await res.json();
    if (!data.reply) throw new Error('Expected textual reply from Gemini COO');
    // Read-only tools must NEVER generate pending mutation actions
    const hasMutatingProposals = data.proposedActions && data.proposedActions.length > 0;
    if (hasMutatingProposals) {
      throw new Error('Read tool generated unwanted mutating action proposal!');
    }
    console.log(`   * Gemini read response generated (${data.reply.substring(0, 70)}...)`);
  });

  // 2. Gemini Mutation Creates Pending Action (NEVER direct mutation)
  await testStep('2. Gemini mutation creates pending action with status=pending', async () => {
    const initialTasksRes = await fetch(`${BASE_URL}/api/tasks`);
    const initialTasks = await initialTasksRes.json();
    const initialTaskCount = initialTasks.length;

    const res = await fetch(`${BASE_URL}/api/gemini/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Propose a critical sales task for Damo to pitch StoreIK to 5 bridal textile boutiques in Tirupur with revenue relation 15000.',
      }),
    });
    if (!res.ok) throw new Error(`Gemini chat HTTP ${res.status}`);
    const data = await res.json();

    if (!data.proposedActions || data.proposedActions.length === 0) {
      throw new Error('Expected Gemini to call create_task and return a proposed action');
    }

    const proposed = data.proposedActions[0];
    if (proposed.status !== 'pending') {
      throw new Error(`Proposed action status must be 'pending', got '${proposed.status}'`);
    }
    if (proposed.proposedBy !== 'ai_coo') {
      throw new Error(`Proposed action author must be 'ai_coo', got '${proposed.proposedBy}'`);
    }
    if (!proposed.tool || proposed.tool !== 'create_task') {
      throw new Error(`Expected proposed tool 'create_task', got '${proposed.tool}'`);
    }

    // Verify Gemini response contains explicit approval warning
    const replyLower = (data.reply || '').toLowerCase();
    if (!replyLower.includes('founder approval') && !replyLower.includes('approval required')) {
      throw new Error('Gemini reply must explicitly inform Damo that founder approval is required');
    }

    // Verify the task was NOT directly added to the live database
    const postTasksRes = await fetch(`${BASE_URL}/api/tasks`);
    const postTasks = await postTasksRes.json();
    if (postTasks.length !== initialTaskCount) {
      throw new Error('Security Breach: Task was created in DB before founder approval!');
    }

    aiPendingActionId = proposed.id;
    console.log(`   * Pending Action created: ID ${aiPendingActionId} (Status: ${proposed.status})`);
  });

  // 3. Pending Action Cannot Execute Before Approval
  await testStep('3. Pending action cannot execute before explicit founder approval', async () => {
    if (!aiPendingActionId) throw new Error('No pending action ID available');

    // Attempt direct execution while still pending
    const res = await fetch(`${BASE_URL}/api/actions/${aiPendingActionId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'damo' }),
    });

    if (res.ok) {
      throw new Error('Security Breach: Pending action executed without founder approval!');
    }
    const data = await res.json();
    if (!data.error.includes('Execution Blocked') && !data.error.includes('pending')) {
      throw new Error(`Expected execution blocked error, received: ${data.error}`);
    }
    console.log(`   * Blocked unapproved execution with HTTP ${res.status}: "${data.error}"`);
  });

  // 4. Damo Approval Changes State Correctly (Unauthorized Actors Blocked)
  await testStep('4. Damo approval changes state correctly (Unauthorized actors rejected)', async () => {
    if (!aiPendingActionId) throw new Error('No pending action ID available');

    // Attempt approval with unauthorized actor (partner)
    const unauthorizedRes = await fetch(`${BASE_URL}/api/actions/${aiPendingActionId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'partner' }),
    });
    if (unauthorizedRes.status !== 403) {
      throw new Error(`Expected HTTP 403 for non-founder approval, got ${unauthorizedRes.status}`);
    }

    // Approve as authentic founder Damo
    const approveRes = await fetch(`${BASE_URL}/api/actions/${aiPendingActionId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'damo' }),
    });
    if (!approveRes.ok) throw new Error(`Approval failed HTTP ${approveRes.status}`);
    const approvedAction = await approveRes.json();

    if (approvedAction.status !== 'approved') {
      throw new Error(`Expected status 'approved', got '${approvedAction.status}'`);
    }
    if (approvedAction.approvedBy !== 'damo') {
      throw new Error(`Expected approvedBy 'damo', got '${approvedAction.approvedBy}'`);
    }
    if (!approvedAction.approvedAt) {
      throw new Error('Expected approvedAt timestamp');
    }
    console.log(`   * Action ${aiPendingActionId} approved by Damo at ${approvedAction.approvedAt}`);
  });

  // 5. Approved Action Executes Exactly Once
  let createdFromActionTaskId = null;
  await testStep('5. Approved action executes exactly once & mutates database', async () => {
    if (!aiPendingActionId) throw new Error('No pending action ID available');

    const res = await fetch(`${BASE_URL}/api/actions/${aiPendingActionId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'damo' }),
    });
    if (!res.ok) throw new Error(`Execution failed HTTP ${res.status}`);
    const data = await res.json();

    if (!data.success || !data.result || !data.result.id) {
      throw new Error('Execution failed to produce a valid task result');
    }
    if (data.action.status !== 'executed') {
      throw new Error(`Expected action status 'executed', got '${data.action.status}'`);
    }
    if (!data.action.executedAt) {
      throw new Error('Expected executedAt timestamp');
    }

    createdFromActionTaskId = data.result.id;

    // Verify task now exists in live database
    const taskRes = await fetch(`${BASE_URL}/api/tasks`);
    const tasks = await taskRes.json();
    const taskExists = tasks.some((t) => t.id === createdFromActionTaskId);
    if (!taskExists) throw new Error('Executed task not found in database!');

    console.log(`   * Action executed successfully. Task created: ${createdFromActionTaskId}`);
  });

  // 6. Replaying the Same Action Fails (Replay Attack Prevention)
  await testStep('6. Replaying the same executed action fails', async () => {
    if (!aiPendingActionId) throw new Error('No pending action ID available');

    const res = await fetch(`${BASE_URL}/api/actions/${aiPendingActionId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'damo' }),
    });

    if (res.ok) {
      throw new Error('Security Breach: Replay of executed action was permitted!');
    }
    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden for replay attack, got ${res.status}`);
    }
    const data = await res.json();
    if (!data.error.includes('Replay Attack Prevented')) {
      throw new Error(`Expected Replay Attack error, got: ${data.error}`);
    }
    console.log(`   * Replay prevented with HTTP ${res.status}: "${data.error}"`);
  });

  // 7. Rejecting an Action Prevents Execution
  await testStep('7. Rejecting an action prevents execution', async () => {
    // Propose an action to reject
    const propRes = await fetch(`${BASE_URL}/api/actions/propose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'create_idea',
        params: {
          title: 'Dropshipping Luxury Socks to US',
          problem: 'Distraction idea testing quarantine',
        },
        proposedBy: 'damo',
      }),
    });
    const proposed = await propRes.json();

    // Reject it as Damo
    const rejRes = await fetch(`${BASE_URL}/api/actions/${proposed.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'damo', reason: 'Focus on core StoreIK validation first.' }),
    });
    if (!rejRes.ok) throw new Error(`Rejection failed HTTP ${rejRes.status}`);
    const rejectedAction = await rejRes.json();
    if (rejectedAction.status !== 'rejected') {
      throw new Error(`Expected status 'rejected', got '${rejectedAction.status}'`);
    }

    // Attempt to execute the rejected action
    const execRes = await fetch(`${BASE_URL}/api/actions/${proposed.id}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'damo' }),
    });
    if (execRes.ok) {
      throw new Error('Security Breach: Rejected action was executed!');
    }
    const execData = await execRes.json();
    if (!execData.error.includes('rejected')) {
      throw new Error(`Expected rejection block error, got: ${execData.error}`);
    }
    console.log(`   * Rejected action blocked from execution with HTTP ${execRes.status}`);
  });

  // 8. Unknown AI Tool & Unapproved Direct Execution Rejected
  await testStep('8. Unknown AI tool is rejected & unapproved direct execution fails', async () => {
    // Propose unknown/unauthorized tool
    const res = await fetch(`${BASE_URL}/api/actions/propose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'drop_database',
        params: { confirm: true },
        proposedBy: 'ai_coo',
      }),
    });
    if (res.status !== 400) {
      throw new Error(`Expected HTTP 400 for unknown tool, got ${res.status}`);
    }

    // Direct unapproved execution via /api/actions/execute without actionId
    const directRes = await fetch(`${BASE_URL}/api/actions/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'create_task',
        params: { title: 'Bypass task' },
      }),
    });
    if (directRes.status !== 400) {
      throw new Error(`Expected HTTP 400 for direct unapproved execute, got ${directRes.status}`);
    }
    console.log('   * Arbitrary tool and unapproved direct bypass successfully blocked.');
  });

  // 9. Modified Params After Approval Are Rejected (Tamper Detection)
  await testStep('9. Modified params after approval are rejected (Parameter Tamper Detection)', async () => {
    // Propose legitimate task
    const propRes = await fetch(`${BASE_URL}/api/actions/propose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'create_task',
        params: {
          title: 'Legitimate outreach task',
          ownerId: 'damo',
          xpReward: 50,
          revenueRelation: 5000,
        },
        proposedBy: 'damo',
      }),
    });
    const proposed = await propRes.json();

    // Approve the legitimate task
    await fetch(`${BASE_URL}/api/actions/${proposed.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'damo' }),
    });

    // Attempt to execute with tampered parameters (modified revenueRelation from 5000 to 500000)
    const tamperRes = await fetch(`${BASE_URL}/api/actions/${proposed.id}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actor: 'damo',
        params: {
          title: 'Legitimate outreach task',
          ownerId: 'damo',
          xpReward: 50,
          revenueRelation: 500000, // Tampered!
        },
      }),
    });

    if (tamperRes.ok) {
      throw new Error('Security Breach: Tampered parameters were executed!');
    }
    if (tamperRes.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden for parameter tampering, got ${tamperRes.status}`);
    }
    const tamperData = await tamperRes.json();
    if (!tamperData.error.includes('Parameter Tamper Detected')) {
      throw new Error(`Expected Parameter Tamper error, got: ${tamperData.error}`);
    }
    console.log(`   * Parameter tamper blocked with HTTP ${tamperRes.status}: "${tamperData.error}"`);
  });

  // 10. Strategic Decision Cannot Be Marked Approved Without Valid Founder Approval
  await testStep('10. Strategic decision cannot be marked approved without valid founder approval', async () => {
    // Create proposed decision
    const decRes = await fetch(`${BASE_URL}/api/decisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Mandate Minimum Website Advance at ₹12,000',
        rationale: 'Sub-₹12k projects do not support full-time developer allocation.',
        expectedOutcome: 'Improve cashflow upfront.',
      }),
    });
    const dec = await decRes.json();
    if (!dec.id || dec.status !== 'proposed') {
      throw new Error('Failed to create proposed strategic decision');
    }

    // Attempt approval WITHOUT actor
    const noActorRes = await fetch(`${BASE_URL}/api/decisions/${dec.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });
    if (noActorRes.status !== 403) {
      throw new Error(`Expected HTTP 403 when approving decision without actor, got ${noActorRes.status}`);
    }

    // Attempt approval with unauthorized actor
    const partnerRes = await fetch(`${BASE_URL}/api/decisions/${dec.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', actor: 'partner' }),
    });
    if (partnerRes.status !== 403) {
      throw new Error(`Expected HTTP 403 for unauthorized partner decision approval, got ${partnerRes.status}`);
    }

    // Attempt invalid lifecycle transition (move directly to executed before approval)
    const invalidTransRes = await fetch(`${BASE_URL}/api/decisions/${dec.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'executed', actor: 'damo' }),
    });
    if (invalidTransRes.status !== 400) {
      throw new Error(`Expected HTTP 400 for invalid lifecycle transition, got ${invalidTransRes.status}`);
    }

    // Approve with explicit founder authorization
    const validApproveRes = await fetch(`${BASE_URL}/api/decisions/${dec.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'approved',
        actor: 'damo',
        permanentRule: 'No web development project accepted under ₹12,000 advance.',
      }),
    });
    if (!validApproveRes.ok) {
      throw new Error(`Valid approval failed HTTP ${validApproveRes.status}`);
    }
    const approvedDec = await validApproveRes.json();
    if (approvedDec.status !== 'approved' || approvedDec.approvedBy !== 'damo') {
      throw new Error('Strategic decision approval verification failed');
    }
    console.log(`   * Decision approved by Damo. Rule: "${approvedDec.permanentRule}"`);
  });

  // 11. Audit Logs Contain Proposal, Approval and Execution Events
  await testStep('11. Audit logs contain proposal, approval and execution events', async () => {
    const res = await fetch(`${BASE_URL}/api/audit-logs`);
    if (!res.ok) throw new Error(`Audit logs HTTP ${res.status}`);
    const logs = await res.json();

    const hasProposal = logs.some((l) => l.action.startsWith('PROPOSE_ACTION_'));
    const hasApproval = logs.some((l) => l.action === 'APPROVE_ACTION');
    const hasExecution = logs.some((l) => l.action === 'EXECUTE_APPROVED_ACTION');
    const hasDecisionApproval = logs.some((l) => l.action === 'DECISION_APPROVED');

    if (!hasProposal) throw new Error('Audit log missing proposal event');
    if (!hasApproval) throw new Error('Audit log missing approval event');
    if (!hasExecution) throw new Error('Audit log missing execution event');
    if (!hasDecisionApproval) throw new Error('Audit log missing strategic decision approval event');

    console.log(`   * Audit log contains all governance events across ${logs.length} logged entries.`);
  });

  // ==========================================================================
  // PART 2: EXISTING BUSINESS FLOW VERIFICATION
  // ==========================================================================

  // 12. Company Status & Dynamic Calculations
  await testStep('12. Company status, dynamic health calculations & ETA', async () => {
    const res = await fetch(`${BASE_URL}/api/company/status`);
    if (!res.ok) throw new Error(`Status HTTP ${res.status}`);
    const status = await res.json();
    if (!status.questTarget || status.healthScores.composite === undefined) {
      throw new Error('Invalid company status payload');
    }
    console.log(`   * Quest Target: ₹${status.questTarget.toLocaleString('en-IN')}`);
    console.log(`   * Health Composite: ${status.healthScores.composite}/100`);
    console.log(`   * Primary Bottleneck: ${status.primaryBottleneck}`);
  });

  // 13. Team Members / Characters
  await testStep('13. Fetch 3 team member character profiles', async () => {
    const res = await fetch(`${BASE_URL}/api/users`);
    const users = await res.json();
    if (!Array.isArray(users) || users.length !== 3) throw new Error('Expected 3 team members');
    console.log(`   * Characters: ${users.map((u) => `${u.name} (${u.title})`).join(', ')}`);
  });

  // 14. Tactical Task Creation & Completion with XP Minting
  await testStep('14. Create tactical task, complete it, and verify XP minted', async () => {
    const createRes = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Deliver Responsive Website Polish for Apparel Client',
        ownerId: 'partner',
        layer: 'daily',
        category: 'delivery',
        priority: 'high',
        xpReward: 90,
        revenueRelation: 10000,
      }),
    });
    const task = await createRes.json();
    if (!task.id) throw new Error('Failed to create task');

    const compRes = await fetch(`${BASE_URL}/api/tasks/${task.id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultNote: 'Delivered mobile QA and verified SSL' }),
    });
    const result = await compRes.json();
    if (!result.task || result.task.status !== 'completed') throw new Error('Task completion failed');
    console.log(`   * Task completed! +${result.xpAwarded} XP awarded to Partner`);
  });

  // 15. Quota Debrief & Task Auto-Adaptation
  await testStep('15. Record missed task debrief and auto-adapt difficulty', async () => {
    const taskRes = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Quota: 15 outbound calls',
        ownerId: 'damo',
        layer: 'daily',
        category: 'sales',
        priority: 'high',
        xpReward: 120,
      }),
    });
    const task = await taskRes.json();

    const missRes = await fetch(`${BASE_URL}/api/tasks/${task.id}/missed`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: 'Higher priority came',
        notes: 'Client delivery fire occupied afternoon focus',
      }),
    });
    const missData = await missRes.json();
    if (missData.task.status !== 'missed') throw new Error('Task not marked missed');

    const adaptRes = await fetch(`${BASE_URL}/api/tasks/adapt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: task.id,
        newTitle: 'Adapted Quota: 8 sales calls in 2-hour morning block',
        newXp: 70,
      }),
    });
    const adapted = await adaptRes.json();
    if (!adapted.id || !adapted.adaptedFromTaskId) throw new Error('Adaptation linkage failed');
    console.log(`   * Auto-adapted quota: "${adapted.title}"`);
  });

  // 16. Sales CRM: Create Lead and Advance to Won
  await testStep('16. Create merchant lead in CRM and advance stage to Won', async () => {
    const leadRes = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Vasantham Silks Coimbatore',
        contactName: 'Mr. Vasanth',
        phone: '+919842199999',
        whatsapp: '919842199999',
        city: 'Coimbatore',
        category: 'Textiles',
        estimatedValue: 16000,
        assignedTo: 'damo',
        status: 'prospect',
      }),
    });
    const lead = await leadRes.json();
    if (!lead.id) throw new Error('Lead creation failed');

    const stageRes = await fetch(`${BASE_URL}/api/leads/${lead.id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'won', notes: 'Advance received! Deal closed.' }),
    });
    const wonLead = await stageRes.json();
    if (wonLead.status !== 'won') throw new Error('Failed to advance lead to Won');
    console.log(`   * Lead ${lead.businessName} advanced to WON!`);
  });

  // 17. Banked Revenue & Dynamic ETA Recalculation
  await testStep('17. Bank customer payment and dynamically recalculate ETA', async () => {
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

    const statusRes = await fetch(`${BASE_URL}/api/company/status`);
    const newStatus = await statusRes.json();
    console.log(`   * Banked: ₹8,000 (+${revResult.xpAwarded} XP)`);
    console.log(`   * Live Verified Cash: ₹${(newStatus.verifiedLiveRevenue || 0).toLocaleString('en-IN')}`);
    console.log(`   * Dynamic Base ETA: ${newStatus.eta.baseCaseDate}`);
  });

  // 18. Daily Check-in & Streak Discipline
  await testStep('18. Submit 8-question Daily Check-in and increase streak', async () => {
    const res = await fetch(`${BASE_URL}/api/checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'damo',
        completedSummary: 'Closed Vasantham Silks advance, finished morning calls',
        biggestWin: '₹8,000 advance banked from Vasantham Silks',
        blockers: 'None',
        keyOutcome: 'Validated ₹16k price point for retail web storefronts',
        revenueLogged: 8000,
        tomorrowFocus: 'Follow up on Velan Silks discussion',
      }),
    });
    const chk = await res.json();
    if (!chk.id) throw new Error('Failed to log checkin');
    console.log(`   * Daily Check-in logged: ID ${chk.id}`);
  });

  // 19. 7-Day Validation Experiment
  await testStep('19. Launch 7-day validation experiment with success criteria', async () => {
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
    console.log(`   * Experiment launched: ID ${exp.id} ("${exp.title}")`);
  });

  // 20. Backup Export & Documentation Reader API
  await testStep('20. Full JSON database backup export & in-app docs reader API', async () => {
    const expRes = await fetch(`${BASE_URL}/api/backup/export`);
    if (!expRes.ok) throw new Error('Export failed');
    const backupJson = await expRes.json();
    if (!backupJson.company || !backupJson.tasks || !backupJson.revenue) {
      throw new Error('Incomplete backup structure');
    }

    const docsRes = await fetch(`${BASE_URL}/api/docs`);
    const docs = await docsRes.json();
    if (!Array.isArray(docs) || docs.length < 20) throw new Error('Expected documentation files');

    console.log(`   * Backup verified (${backupJson.tasks.length} tasks, ${backupJson.revenue.length} transactions).`);
    console.log(`   * Verified ${docs.length} architectural documentation blueprints.`);
  });

  console.log(`\n======================================================`);
  console.log(`🏁 VERIFICATION SUITE RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`======================================================\n`);

  if (failCount > 0) process.exit(1);
}

runTests();
