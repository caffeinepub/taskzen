# Task Completed Flash Animation - Integration Guide

## Overview

The Task Completed Flash Animation displays a beautiful white-gold flash effect followed by a random Hindi inspirational quote when a user completes a task. The animation auto-hides after 60 seconds (1 minute) and can be dismissed immediately via a close button. It requires no external dependencies.

---

## TaskZen Integration

### How It Works in TaskZen

The animation is integrated into the Tasks page and triggers automatically when a user successfully completes a task.

**Integration Point:**
- **File:** `frontend/src/components/tasks/TaskList.tsx`
- **Trigger:** After the `completeTask` mutation succeeds
- **Mechanism:** Uses a local state counter (`animationTriggerId`) that increments on each successful completion

**Features:**
- **Auto-hide:** Popup automatically disappears after 60 seconds
- **Manual dismiss:** Users can click the close (X) button to dismiss immediately
- **Re-triggerable:** Each task completion shows a new random quote

**Code Flow:**

1. User clicks checkbox to complete a task
2. `completeTask` mutation executes
3. On success, `animationTriggerId` increments
4. `TaskCompletedFlashAnimation` detects the change and:
   - Selects a random Hindi quote
   - Shows the flash/glow overlay
   - Displays the popup with the quote
   - Starts a 60-second auto-hide timer
5. User can either:
   - Wait for auto-hide (60 seconds)
   - Click the close (X) button to dismiss immediately

**Example Implementation:**

