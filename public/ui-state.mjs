import {issues, plansFor, nextQuestion} from './core.mjs';

export function buildViewModel(state, draftSource = '', connected = false, saveState = null) {
  const stale = Boolean(state.source && draftSource.trim() !== state.source);
  const holds = issues(state);
  if (stale) holds.push('Analyze the edited message before approving');
  const proofStatus = stale ? 'STALE' : (state.proof?.status ?? 'NOT_RUN');
  const decisionStatus = holds.length ? 'HOLD' : (state.proof?.status === 'PASS' ? 'PROVEN' : 'READY');
  const question = nextQuestion(state);
  const unresolvedEvidenceCount = question.candidates.length + (!state.liveVerified ? 1 : 0) + (!state.evidenceReviewed ? 1 : 0);
  const proofFreshness = stale ? 'STALE' : state.proof ? 'CURRENT' : 'NOT_RUN';
  const decisionState = stale ? 'STALE_PROOF'
    : !state.liveVerified ? 'WAITING_FOR_ANALYSIS'
    : !state.evidenceReviewed ? 'WAITING_FOR_EVIDENCE_REVIEW'
    : state.proof?.status === 'PASS' ? 'READY_FOR_HUMAN_APPROVAL'
    : state.proof?.status === 'BLOCK' ? 'BLOCKED_BY_PROOF'
    : state.proof?.status === 'HOLD' ? 'HELD_BY_PROOF'
    : 'READY_FOR_PROOF';
  const incident = {
    status: state.liveVerified ? (state.evidenceReviewed ? 'REVIEWED' : 'ANALYZED') : 'UNANALYZED',
    supplier: state.extraction?.supplier ?? 'Supplier B',
    delayHours: state.extraction?.delay_hours ?? null,
    affectedRoutes: state.extraction?.affected_routes ?? null
  };
  const base = {
    state,
    stale,
    holds,
    plans: plansFor(state),
    question,
    saveState,
    system: {
      firebase: connected ? 'VERIFIED' : 'NOT_VERIFIED',
      gemini: state.liveVerified ? 'VERIFIED' : 'NOT_RUN',
      evidence: state.evidenceReviewed ? 'REVIEWED' : 'REVIEW_REQUIRED',
      proof: proofStatus,
      save: saveState?.verified ? 'VERIFIED' : 'NOT_VERIFIED'
    },
    decision: {status: decisionStatus, stale},
    incident,
    unresolvedEvidenceCount,
    decisionState,
    proofFreshness
  };
  base.nextAction = getPrimaryAction(base);
  return base;
}

export function getStageState(vm) {
  if (!vm.state.liveVerified) return {signal:'active', evidence:'waiting', decision:'waiting', proof:'waiting', action:'waiting'};
  if (!vm.state.evidenceReviewed || vm.stale) return {signal:'complete', evidence:'active', decision:'waiting', proof:vm.stale?'stale':'waiting', action:'waiting'};
  if (!vm.state.proof) return {signal:'complete', evidence:'complete', decision:'active', proof:'waiting', action:'waiting'};
  if (vm.state.proof.status === 'PASS') return {signal:'complete', evidence:'complete', decision:'complete', proof:'complete', action:'active'};
  return {signal:'complete', evidence:'complete', decision:'complete', proof:'active', action:'waiting'};
}

export function getPrimaryAction(vm) {
  if (!vm.state.liveVerified || vm.stale) return {id:'analyze', label:'Analyze disruption', disabled:vm.system.firebase !== 'VERIFIED'};
  if (!vm.state.evidenceReviewed) return {id:'review-evidence', label:'Review evidence & confirm capacity', disabled:false};
  if (!vm.state.proof || vm.state.proof.status !== 'PASS') return {id:'prove-balanced', label:'Send balanced candidate to Proof Gate', disabled:false};
  return {id:'approve', label:'Approve sandbox actions', disabled:false};
}
