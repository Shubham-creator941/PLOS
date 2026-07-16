import { AuditRepository } from '../repository';
import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import {
  AuditLogRecord,
  ActivityRecord,
  LoginHistoryRecord,
  SystemActivityRecord,
  ResourceType,
  AuditStatus,
  ActivityType,
  LoginStatus,
  Severity,
  AuditMetadata
} from '../types';

export class AuditService {
  private readonly auditRepo = new AuditRepository();

  // ====================================================
  // PRIVATE HELPERS
  // ====================================================

  private validateLearner(learnerId: string): void {
    if (!learnerId) throw new Error(MESSAGES.UNAUTHORIZED || 'Learner ID is required');
  }

  // ====================================================
  // AUDIT LOGS
  // ====================================================

  public async recordAuditLog(
    action: string,
    resourceType: ResourceType,
    status: AuditStatus,
    learnerId?: string | null,
    resourceId?: string | null,
    ipAddress?: string | null,
    userAgent?: string | null,
    metadata?: AuditMetadata | null
  ): Promise<AuditLogRecord> {
    return this.auditRepo.createAuditLog({
      audit_id: generateUUID(),
      learner_id: learnerId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      status,
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata
    });
  }

  public async listAuditLogs(limit: number = 100): Promise<AuditLogRecord[]> {
    return this.auditRepo.listAuditLogs(limit);
  }

  // ====================================================
  // LEARNER ACTIVITY
  // ====================================================

  public async recordActivity(
    learnerId: string,
    activityType: ActivityType,
    title: string,
    description: string,
    referenceId?: string | null
  ): Promise<ActivityRecord> {
    this.validateLearner(learnerId);

    return this.auditRepo.createActivity({
      activity_id: generateUUID(),
      learner_id: learnerId,
      activity_type: activityType,
      title,
      description,
      reference_id: referenceId
    });
  }

  public async listActivities(learnerId: string, limit: number = 50): Promise<ActivityRecord[]> {
    this.validateLearner(learnerId);
    return this.auditRepo.listActivities(learnerId, limit);
  }

  // ====================================================
  // LOGIN HISTORY
  // ====================================================

  public async recordLogin(
    learnerId: string,
    status: LoginStatus,
    ipAddress?: string | null,
    userAgent?: string | null
  ): Promise<LoginHistoryRecord> {
    this.validateLearner(learnerId);

    return this.auditRepo.createLoginHistory({
      login_id: generateUUID(),
      learner_id: learnerId,
      login_at: new Date(),
      ip_address: ipAddress,
      user_agent: userAgent,
      status
    });
  }

  public async closeLoginSession(
    learnerId: string,
    loginId: string,
    ipAddress?: string | null,
    userAgent?: string | null
  ): Promise<AuditLogRecord> {
    this.validateLearner(learnerId);
    
    // Audit records are immutable. We log the session close via the immutable audit trail.
    return this.recordAuditLog(
      'logout',
      'auth',
      'success',
      learnerId,
      loginId,
      ipAddress,
      userAgent,
      { closed_login_id: loginId }
    );
  }

  public async listLoginHistory(learnerId: string, limit: number = 50): Promise<LoginHistoryRecord[]> {
    this.validateLearner(learnerId);
    return this.auditRepo.listLoginHistory(learnerId, limit);
  }

  // ====================================================
  // SYSTEM ACTIVITY
  // ====================================================

  public async recordSystemActivity(
    moduleName: ResourceType,
    activity: string,
    severity: Severity,
    metadata?: AuditMetadata | null
  ): Promise<SystemActivityRecord> {
    return this.auditRepo.createSystemActivity({
      system_activity_id: generateUUID(),
      module_name: moduleName,
      activity,
      severity,
      metadata
    });
  }

  public async listSystemActivity(limit: number = 100): Promise<SystemActivityRecord[]> {
    return this.auditRepo.listSystemActivity(limit);
  }
}
