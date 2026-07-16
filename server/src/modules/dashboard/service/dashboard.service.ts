import { DashboardRepository } from '../repository';
import { PlanningRepository } from '../../planning/repository';
import { SessionRepository } from '../../session/repository';
import { AdaptiveRuntimeRepository } from '../../adaptive/repository';
import { AssessmentRepository } from '../../assessment/repository';
import { IntelligenceRepository } from '../../intelligence/repository';
import { generateUUID } from '../../../utils/uuid';
import { MESSAGES } from '../../../shared/messages';
import {
  DashboardPreferenceRecord,
  DashboardSnapshotRecord,
  DashboardWidgetRecord,
  DashboardExportRecord,
  UpdatePreferenceDTO,
  UpdateWidgetLayoutRequestDTO,
  GenerateExportRequestDTO,
  DashboardOverviewDTO,
  DashboardStatisticsDTO,
  DashboardTimelineDTO,
  ExportStatus
} from '../types';

export class DashboardService {
  private readonly dashboardRepo = new DashboardRepository();
  private readonly planningRepo = new PlanningRepository();
  private readonly sessionRepo = new SessionRepository();
  private readonly adaptiveRepo = new AdaptiveRuntimeRepository();
  private readonly assessmentRepo = new AssessmentRepository();
  private readonly intelligenceRepo = new IntelligenceRepository();

  // ====================================================
  // PRIVATE HELPERS
  // ====================================================

  private async getOwnedPreference(learnerId: string): Promise<DashboardPreferenceRecord> {
    const pref = await this.dashboardRepo.findPreference(learnerId);
    if (!pref) {
      return this.createDefaultPreference(learnerId);
    }
    return pref;
  }

  private async getOwnedExport(exportId: string, learnerId: string): Promise<DashboardExportRecord> {
    const exp = await this.dashboardRepo.findExport(exportId);
    if (!exp) throw new Error(MESSAGES.NOT_FOUND || 'Export not found');
    if (exp.learner_id !== learnerId) throw new Error(MESSAGES.FORBIDDEN || 'Not authorized to access this export');
    return exp;
  }

  private validateLearner(learnerId: string): void {
    if (!learnerId) throw new Error(MESSAGES.UNAUTHORIZED || 'Learner ID is required');
  }

  // ====================================================
  // BUSINESS METHODS
  // ====================================================

  // ---- Preferences ----

  public async createDefaultPreference(learnerId: string): Promise<DashboardPreferenceRecord> {
    return this.dashboardRepo.createPreference({
      preference_id: generateUUID(),
      learner_id: learnerId,
      default_view: 'overview',
      show_activity: true,
      show_mastery: true,
      show_recommendations: true,
      theme: 'system'
    });
  }

  public async getPreferences(learnerId: string): Promise<DashboardPreferenceRecord> {
    this.validateLearner(learnerId);
    return this.getOwnedPreference(learnerId);
  }

  public async updatePreferences(learnerId: string, version: number, dto: UpdatePreferenceDTO): Promise<DashboardPreferenceRecord> {
    this.validateLearner(learnerId);
    const pref = await this.getOwnedPreference(learnerId);
    return this.dashboardRepo.updatePreference(learnerId, pref.version || version, dto);
  }

  // ---- Dashboard Overview ----

  public async getDashboardOverview(learnerId: string): Promise<Record<string, unknown>> {
    this.validateLearner(learnerId);

    const analytics = await this.intelligenceRepo.findAnalytics(learnerId);
    const recommendations = await this.intelligenceRepo.listRecommendations(learnerId);
    const gaps = await this.intelligenceRepo.listKnowledgeGaps(learnerId);
    const activeSession = await this.sessionRepo.findActiveByLearner(learnerId);
    const plans = await this.planningRepo.findByLearner(learnerId);
    const activePlan = plans.find(p => p.status === 'active') || null;

    let runtimeState = null;
    if (activeSession) {
      runtimeState = await this.adaptiveRepo.findRuntimeBySession(activeSession.session_id);
    }

    // Compose strict read-only object
    return {
      currentLearningPlan: activePlan,
      currentSession: activeSession,
      runtimeState,
      analyticsSummary: analytics || null,
      assessmentSummary: {
        totalGaps: gaps.length,
        totalRecommendations: recommendations.length
      },
      recommendations: recommendations.slice(0, 5),
      knowledgeGaps: gaps.slice(0, 5),
      recentActivity: [] // Handled via timeline
    };
  }

  // ---- Statistics ----

  public async getStatistics(learnerId: string): Promise<DashboardStatisticsDTO[]> {
    this.validateLearner(learnerId);

    const analytics = await this.intelligenceRepo.findAnalytics(learnerId);
    if (!analytics) return [];

    return [
      { metric_name: 'completed_plans', metric_value: analytics.completed_plans, trend: 'up' },
      { metric_name: 'completed_modules', metric_value: analytics.completed_modules, trend: 'up' },
      { metric_name: 'completed_objectives', metric_value: analytics.completed_objectives, trend: 'up' },
      { metric_name: 'learning_minutes', metric_value: analytics.total_learning_minutes, trend: 'up' },
      { metric_name: 'mastery', metric_value: analytics.mastery_percentage, trend: 'up' },
      { metric_name: 'average_assessment', metric_value: analytics.average_assessment_score, trend: 'flat' }
    ];
  }

  // ---- Timeline ----

  public async getTimeline(learnerId: string): Promise<DashboardTimelineDTO[]> {
    this.validateLearner(learnerId);

    // Mock representation of timeline fetching from session events
    const session = await this.sessionRepo.findActiveByLearner(learnerId);
    if (!session) return [];

    const events = await this.sessionRepo.listEvents(session.session_id);
    return events.map(e => ({
      event_date: e.createdAt.toISOString(),
      event_type: e.event_type,
      description: e.payload ? JSON.stringify(e.payload) : 'Activity recorded'
    }));
  }

  // ---- Widget Layout ----

  public async listWidgets(learnerId: string): Promise<DashboardWidgetRecord[]> {
    this.validateLearner(learnerId);
    const widgets = await this.dashboardRepo.listWidgets(learnerId);
    if (widgets.length === 0) {
      // Auto-initialize defaults if none exist
      await this.dashboardRepo.createWidget({ widget_state_id: generateUUID(), learner_id: learnerId, widget_name: 'overview', position_no: 1, visible: true });
      await this.dashboardRepo.createWidget({ widget_state_id: generateUUID(), learner_id: learnerId, widget_name: 'progress', position_no: 2, visible: true });
      return this.dashboardRepo.listWidgets(learnerId);
    }
    return widgets;
  }

  public async updateWidgetLayout(learnerId: string, dto: UpdateWidgetLayoutRequestDTO): Promise<DashboardWidgetRecord[]> {
    this.validateLearner(learnerId);
    const existingWidgets = await this.listWidgets(learnerId);

    for (const widgetData of dto.widgets) {
      const widget = existingWidgets.find(w => w.widget_name === widgetData.widget_name);
      if (widget) {
        await this.dashboardRepo.updateWidget(widget.widget_state_id, {
          position_no: widgetData.position_no,
          visible: widgetData.visible
        });
      } else {
        await this.dashboardRepo.createWidget({
          widget_state_id: generateUUID(),
          learner_id: learnerId,
          widget_name: widgetData.widget_name,
          position_no: widgetData.position_no,
          visible: widgetData.visible
        });
      }
    }

    return this.dashboardRepo.listWidgets(learnerId);
  }

  // ---- Snapshot ----

  public async generateSnapshot(learnerId: string): Promise<DashboardSnapshotRecord> {
    this.validateLearner(learnerId);

    const overview = await this.getDashboardOverview(learnerId);
    const stats = await this.getStatistics(learnerId);

    const summary_json = {
      overview,
      stats,
      generatedAt: new Date().toISOString()
    };

    return this.dashboardRepo.createSnapshot({
      snapshot_id: generateUUID(),
      learner_id: learnerId,
      generated_at: new Date(),
      summary_json
    });
  }

  public async listSnapshots(learnerId: string): Promise<DashboardSnapshotRecord[]> {
    this.validateLearner(learnerId);
    return this.dashboardRepo.listSnapshots(learnerId);
  }

  // ---- Export ----

  public async createExport(learnerId: string, dto: GenerateExportRequestDTO): Promise<DashboardExportRecord> {
    this.validateLearner(learnerId);

    const record = await this.dashboardRepo.createExport({
      export_id: generateUUID(),
      learner_id: learnerId,
      export_type: dto.export_type,
      status: 'pending' as ExportStatus
    });

    // Fire & Forget background worker mock simulation
    // A real system would use Redis queue or pub/sub here.
    setTimeout(async () => {
      try {
        await this.dashboardRepo.updateExport(record.export_id, {
          status: 'completed' as ExportStatus,
          generated_at: new Date(),
          file_name: 'export_' + record.export_id + '.' + dto.export_type
        });
      } catch (err) {
        await this.dashboardRepo.updateExport(record.export_id, {
          status: 'failed' as ExportStatus
        });
      }
    }, 1000);

    return record;
  }

  public async listExports(learnerId: string): Promise<DashboardExportRecord[]> {
    this.validateLearner(learnerId);
    return this.dashboardRepo.listExports(learnerId);
  }
}
