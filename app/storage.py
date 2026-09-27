from __future__ import annotations

import json
import os
import threading
from copy import deepcopy
from pathlib import Path

class StateStore:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.path = Path(os.getenv("STATE_FILE", "/tmp/varelyx/state.json"))
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._firestore = None
        if os.getenv("FIRESTORE_ENABLED", "false").lower() == "true":
            try:
                from google.cloud import firestore
                self._firestore = firestore.Client()
            except Exception:
                self._firestore = None

    def get(self) -> dict:
        if self._firestore:
            doc = self._firestore.collection("varelyx_demo").document("state").get()
            return deepcopy(doc.to_dict() or {})
        with self._lock:
            if not self.path.exists():
                return {}
            return json.loads(self.path.read_text())

    def set(self, state: dict) -> dict:
        state = deepcopy(state)
        if self._firestore:
            self._firestore.collection("varelyx_demo").document("state").set(state)
            return state
        with self._lock:
            self.path.write_text(json.dumps(state, indent=2, sort_keys=True))
        return state
