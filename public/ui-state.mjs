import {issues, plansFor, nextQuestion} from './core.mjs';

export function buildViewModel(state, draftSource = '', connected = false, saveState = null) {
  const stale = Boolean(state.source && draftSource.trim() !== state.source);
  const holds = issues(state);
  if (stale) holds.push('Analyze the edited message before approving');
  const proofStatus = stale ? 'STALE' : (state.proof?.status ?? 'NOT_RUN');
  const decisionStatus = holds.length ? 'HOLD' : (state.proof?.status === 'PASS' ? 'PROVEN' : 'READY');
  return {
    state,
    stale,
    holds,
    plans: plansFor(state),
    question: nextQuestion(state),
    saveState,
    system: {
      firebase: connected ? 'VERIFIED' : 'NOT_VERIFIED',
      gemini: state.liveVerified ? 'VERIFIED' : 'NOT_RUN',
      evidence: state.evidenceReviewed ? 'REVIEWED' : 'REVIEW_REQUIRED',
      proof: proofStatus,
      save: saveState?.verified ? 'VERIFIED' : 'NOT_VERIFIED'
    },
    decision: {status: decisionStatus, stale}
  };
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
