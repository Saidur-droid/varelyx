// Transport-injected persistence; no localStorage fallback or optimistic success.
export async function deadline(promise, ms = 30000) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error('Operation timed out; outcome is not confirmed')), ms); })]); }
  finally { clearTimeout(timer); }
}
export class VerifiedSession {
  constructor(transport) { this.transport = transport; this.revision = 0; this.blocked = false; this.busy = false; }
  async load() {
    const envelope = await this.transport.read();
    if (envelope && (!Number.isSafeInteger(envelope.revision) || envelope.revision < 1 || typeof envelope.payload !== 'string')) throw Error('Invalid remote envelope');
    this.revision = envelope?.revision ?? 0;
    this.blocked = false;
    return envelope?.payload ?? null;
  }
  async save(state) {
    if (this.blocked) throw Error('Reload to reconcile the previous unconfirmed write');
    if (this.busy) throw Error('Another save is in progress');
    this.busy = true;
    const envelope = {version: 2, revision: this.revision + 1, commitId: globalThis.crypto.randomUUID(), payload: JSON.stringify(state)};
    try {
      await this.transport.write(envelope, this.revision);
      const actual = await this.transport.read();
      if (!actual || actual.commitId !== envelope.commitId || actual.payload !== envelope.payload || actual.revision !== envelope.revision) throw Error('Remote read-back did not verify this write');
      this.revision = envelope.revision;
      return envelope;
    } catch (err) {
      this.blocked = true;
      throw Error('Firebase save NOT VERIFIED. Reload before retrying. ' + err.message);
    } finally { this.busy = false; }
  }
}
