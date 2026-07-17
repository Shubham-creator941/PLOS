import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import { SessionRepository } from '../repository';
import { PlanningRepository } from '../../planning/repository';
import { PlanningService } from '../../planning/service';
import type {
  StartSessionRequestDTO,
  PauseSessionRequestDTO,
  ResumeSessionRequestDTO,
  CompleteObjectiveRequestDTO,
  SaveCheckpointRequestDTO,
  SessionSummaryRecord,
  LearningSessionRecord
} from '../types';

export class SessionService {
  private readonly sessionRepo = new SessionRepository();
  private readonly planningRepo = new PlanningRepository();
  private readonly planningService = new PlanningService();

  private async getOwnedSession(learnerId: string, sessionId: string): Promise<LearningSessionRecord> {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) {
      throw new Error(MESSAGES.NOT_FOUND);
    }
    if (session.learner_id !== learnerId) {
      throw new Error(MESSAGES.FORBIDDEN);
    }
    return session;
  }

  // ---- Public Methods ----

  public async startSession(learnerId: string, dto: Readonly<StartSessionRequestDTO>): Promise<SessionSummaryRecord> {
    const plan = await this.planningRepo.findById(dto.plan_id);
    if (!plan) throw new Error(MESSAGES.NOT_FOUND);
    if (plan.learner_id !== learnerId) throw new Error(MESSAGES.FORBIDDEN);
    if (plan.status !== 'active') throw new Error(MESSAGES.BAD_REQUEST);

    const activeSession = await this.sessionRepo.findActiveByLearner(learnerId);
    if (activeSession && activeSession.plan_id !== dto.plan_id) {
      throw new Error(MESSAGES.BAD_REQUEST);
    }

    const planSession = await this.sessionRepo.findByPlan(dto.plan_id);
    if (planSession) {
      if (planSession.status === 'completed') {
        throw new Error(MESSAGES.BAD_REQUEST);
      }
      if (planSession.status === 'active' || planSession.status === 'paused') {
        throw new Error(MESSAGES.BAD_REQUEST);
      }
    }

    let sessionId: string;
    let version = 1;
    let current_phase_id: string | null = null;
    let current_module_id: string | null = null;
    let current_objective_id: string | null = null;
    const now = new Date();

    if (planSession && (planSession.status === 'abandoned' || planSession.status === 'not_started')) {
      sessionId = planSession.session_id;
      version = planSession.version;
    } else {
      sessionId = generateUUID();
    }

    const phases = await this.planningRepo.listPhases(dto.plan_id);
    if (!phases.length) throw new Error(MESSAGES.BAD_REQUEST);
    const firstPhase = phases[0];

    const modules = await this.planningRepo.listModules(firstPhase.phase_id);
    if (!modules.length) throw new Error(MESSAGES.BAD_REQUEST);
    const firstModule = modules[0];

    const objectives = await this.planningRepo.listObjectives(firstModule.module_id);
    if (!objectives.length) throw new Error(MESSAGES.BAD_REQUEST);
    const firstObjective = objectives[0];

    current_phase_id = firstPhase.phase_id;
    current_module_id = firstModule.module_id;
    current_objective_id = firstObjective.objective_id;

    if (planSession) {
      await this.sessionRepo.updateSession({
        session_id: sessionId,
        current_phase_id,
        current_module_id,
        current_objective_id,
        status: 'active',
        started_at: now,
        last_activity_at: now,
        completed_at: null,
        total_minutes: 0,
        version
      });
    } else {
      await this.sessionRepo.createSession({
        session_id: sessionId,
        plan_id: dto.plan_id,
        learner_id: learnerId,
        current_phase_id,
        current_module_id,
        current_objective_id,
        status: 'active'
      });
      // createSession doesn't natively insert started_at/last_activity_at, so we immediately update
      await this.sessionRepo.updateSession({
        session_id: sessionId,
        current_phase_id,
        current_module_id,
        current_objective_id,
        status: 'active',
        started_at: now,
        last_activity_at: now,
        completed_at: null,
        total_minutes: 0,
        version: 1
      });
    }

    await this.sessionRepo.createEvent({
      event_id: generateUUID(),
      session_id: sessionId,
      event_type: 'session_started',
      payload: null
    });

    await this.sessionRepo.createEvent({
      event_id: generateUUID(),
      session_id: sessionId,
      event_type: 'objective_started',
      payload: null
    });

    const summary = await this.sessionRepo.getSessionSummary(sessionId);
    return summary!;
  }

  public async pauseSession(learnerId: string, sessionId: string, dto?: Readonly<PauseSessionRequestDTO>): Promise<SessionSummaryRecord> {
    const session = await this.getOwnedSession(learnerId, sessionId);
    if (session.status !== 'active') throw new Error(MESSAGES.BAD_REQUEST);

    await this.sessionRepo.updateSession({
      session_id: sessionId,
      current_phase_id: session.current_phase_id,
      current_module_id: session.current_module_id,
      current_objective_id: session.current_objective_id,
      status: 'paused',
      started_at: session.started_at,
      last_activity_at: new Date(),
      completed_at: session.completed_at,
      total_minutes: session.total_minutes,
      version: session.version
    });

    await this.sessionRepo.createEvent({
      event_id: generateUUID(),
      session_id: sessionId,
      event_type: 'session_paused',
      payload: null
    });

    const summary = await this.sessionRepo.getSessionSummary(sessionId);
    return summary!;
  }

  public async resumeSession(learnerId: string, sessionId: string, dto?: Readonly<ResumeSessionRequestDTO>): Promise<SessionSummaryRecord> {
    const session = await this.getOwnedSession(learnerId, sessionId);
    if (session.status !== 'paused') throw new Error(MESSAGES.BAD_REQUEST);

    const checkpoint = await this.sessionRepo.getLatestCheckpoint(sessionId);
    let current_phase_id = session.current_phase_id;
    let current_module_id = session.current_module_id;
    let current_objective_id = session.current_objective_id;

    if (checkpoint) {
      current_phase_id = checkpoint.phase_id;
      current_module_id = checkpoint.module_id;
      current_objective_id = checkpoint.objective_id;
    }

    await this.sessionRepo.updateSession({
      session_id: sessionId,
      current_phase_id,
      current_module_id,
      current_objective_id,
      status: 'active',
      started_at: session.started_at,
      last_activity_at: new Date(),
      completed_at: session.completed_at,
      total_minutes: session.total_minutes,
      version: session.version
    });

    await this.sessionRepo.createEvent({
      event_id: generateUUID(),
      session_id: sessionId,
      event_type: 'session_resumed',
      payload: null
    });

    const summary = await this.sessionRepo.getSessionSummary(sessionId);
    return summary!;
  }

  public async completeObjective(learnerId: string, sessionId: string, dto: Readonly<CompleteObjectiveRequestDTO>): Promise<SessionSummaryRecord> {
    const session = await this.getOwnedSession(learnerId, sessionId);
    if (session.status !== 'active') throw new Error(MESSAGES.BAD_REQUEST);
    if (session.current_objective_id !== dto.objective_id) throw new Error(MESSAGES.BAD_REQUEST);

    await this.sessionRepo.createEvent({
      event_id: generateUUID(),
      session_id: sessionId,
      event_type: 'objective_completed',
      payload: null
    });

    if (session.current_objective_id) {
      await this.planningService.completeObjective(learnerId, session.current_objective_id);
    }

    let next_phase_id: string | null = session.current_phase_id;
    let next_module_id: string | null = session.current_module_id;
    let next_objective_id: string | null = null;
    let next_status: import('../types').SessionStatus = session.status;
    let next_completed_at = session.completed_at;

    const objectives = await this.planningRepo.listObjectives(session.current_module_id!);
    const currentObjIndex = objectives.findIndex(o => o.objective_id === session.current_objective_id);

    if (currentObjIndex !== -1 && currentObjIndex < objectives.length - 1) {
      next_objective_id = objectives[currentObjIndex + 1].objective_id;
      await this.sessionRepo.createEvent({
        event_id: generateUUID(),
        session_id: sessionId,
        event_type: 'objective_started',
        payload: null
      });
    } else {
      if (session.current_module_id) {
        await this.planningService.completeModule(learnerId, session.current_module_id);
      }
      
      await this.sessionRepo.createEvent({
        event_id: generateUUID(),
        session_id: sessionId,
        event_type: 'module_completed',
        payload: null
      });

      const modules = await this.planningRepo.listModules(session.current_phase_id!);
      const currentModIndex = modules.findIndex(m => m.module_id === session.current_module_id);

      if (currentModIndex !== -1 && currentModIndex < modules.length - 1) {
        next_module_id = modules[currentModIndex + 1].module_id;
        const nextObjectives = await this.planningRepo.listObjectives(next_module_id);
        next_objective_id = nextObjectives[0]?.objective_id || null;
        if (next_objective_id) {
          await this.sessionRepo.createEvent({
            event_id: generateUUID(),
            session_id: sessionId,
            event_type: 'objective_started',
            payload: null
          });
        }
      } else {
        if (session.current_phase_id) {
          await this.planningService.completePhase(learnerId, session.current_phase_id);
        }

        await this.sessionRepo.createEvent({
          event_id: generateUUID(),
          session_id: sessionId,
          event_type: 'phase_completed',
          payload: null
        });

        const phases = await this.planningRepo.listPhases(session.plan_id);
        const currentPhaseIndex = phases.findIndex(p => p.phase_id === session.current_phase_id);

        if (currentPhaseIndex !== -1 && currentPhaseIndex < phases.length - 1) {
          next_phase_id = phases[currentPhaseIndex + 1].phase_id;
          const nextModules = await this.planningRepo.listModules(next_phase_id);
          next_module_id = nextModules[0]?.module_id || null;
          if (next_module_id) {
             const nextObjectives = await this.planningRepo.listObjectives(next_module_id);
             next_objective_id = nextObjectives[0]?.objective_id || null;
             if (next_objective_id) {
               await this.sessionRepo.createEvent({
                 event_id: generateUUID(),
                 session_id: sessionId,
                 event_type: 'objective_started',
                 payload: null
               });
             }
          }
        } else {
          next_phase_id = null;
          next_module_id = null;
          next_objective_id = null;
          next_status = 'completed';
          next_completed_at = new Date();

          await this.sessionRepo.createEvent({
            event_id: generateUUID(),
            session_id: sessionId,
            event_type: 'session_completed',
            payload: null
          });

          await this.planningService.completePlan(learnerId, session.plan_id);
        }
      }
    }

    await this.sessionRepo.updateSession({
      session_id: sessionId,
      current_phase_id: next_phase_id,
      current_module_id: next_module_id,
      current_objective_id: next_objective_id,
      status: next_status,
      started_at: session.started_at,
      last_activity_at: new Date(),
      completed_at: next_completed_at,
      total_minutes: session.total_minutes,
      version: session.version
    });

    const summary = await this.sessionRepo.getSessionSummary(sessionId);
    return summary!;
  }

  public async saveCheckpoint(learnerId: string, sessionId: string, dto: Readonly<SaveCheckpointRequestDTO>) {
    const session = await this.getOwnedSession(learnerId, sessionId);
    if (session.status !== 'active') throw new Error(MESSAGES.BAD_REQUEST);

    await this.sessionRepo.saveCheckpoint({
      checkpoint_id: generateUUID(),
      session_id: sessionId,
      phase_id: dto.phase_id,
      module_id: dto.module_id,
      objective_id: dto.objective_id,
      elapsed_minutes: dto.elapsed_minutes
    });

    await this.sessionRepo.updateSession({
      session_id: sessionId,
      current_phase_id: session.current_phase_id,
      current_module_id: session.current_module_id,
      current_objective_id: session.current_objective_id,
      status: session.status,
      started_at: session.started_at,
      last_activity_at: new Date(),
      completed_at: session.completed_at,
      total_minutes: session.total_minutes,
      version: session.version
    });

    return this.sessionRepo.getLatestCheckpoint(sessionId);
  }

  public async getSessionSummary(learnerId: string, sessionId: string): Promise<SessionSummaryRecord> {
    await this.getOwnedSession(learnerId, sessionId);
    const summary = await this.sessionRepo.getSessionSummary(sessionId);
    return summary!;
  }
}
