import os
os.environ["STATE_FILE"] = "/tmp/varelyx-test-state.json"
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_hero_flow():
    client.post('/api/reset')
    assert client.get('/api/state').json()['phase'] == 'EVIDENCE_REQUIRED'
    assert client.post('/api/proof/balanced').json()['status'] == 'HOLD'
    s = client.post('/api/evidence/answer', json={'supplier_b_thursday_capacity': 120}).json()
    assert s['phase'] == 'PLAN_READY'
    assert client.post('/api/proof/balanced').json()['status'] == 'PASS'
    dispatched = client.post('/api/approve/balanced').json()
    assert dispatched['actions']
    assert client.post('/api/approve/balanced').json()['idempotent'] is True
