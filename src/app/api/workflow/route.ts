// src/app/api/workflow/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const WorkflowTransitionSchema = z.object({
  currentStageIndex: z.number().min(0).max(3),
  transactionId: z.string().default('TXN-99482-NG'),
  amount: z.number().positive().default(25000000),
});

const STAGES = [
  { id: 'INITIATED', status: 'PENDING_COMPLIANCE', actor: 'Maker (Branch/Portal)' },
  { id: 'COMPLIANCE_CHECK', status: 'AML_CLEARED', actor: 'BPMN Rule Engine' },
  { id: 'CORE_API_SYNC', status: 'ISO8583_POSTED', actor: 'Core Banking Gateway' },
  { id: 'SETTLED', status: 'COMMITTED_IMMUTABLE', actor: 'Ledger Service' },
];

export async function POST(request: Request) {
  const startTime = performance.now();

  try {
    const body = await request.json();
    const parsed = WorkflowTransitionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid workflow state payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { currentStageIndex, transactionId } = parsed.data;
    const nextStageIndex = (currentStageIndex + 1) % STAGES.length;
    const nextStage = STAGES[nextStageIndex];

    const executionTimeMs = Math.round(performance.now() - startTime + 12); // Simulated core gateway roundtrip

    return NextResponse.json({
      success: true,
      transactionId,
      stageIndex: nextStageIndex,
      stage: nextStage,
      telemetry: {
        latencyMs: `${executionTimeMs}ms`,
        timestamp: new Date().toISOString(),
        idempotencyKey: `IDEMP-${Date.now().toString(36).toUpperCase()}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Workflow Engine Error' },
      { status: 500 }
    );
  }
}