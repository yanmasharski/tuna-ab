# A/B Testing Backend with Firebase Cloud Functions and Realtime Database

## Overview
This repository contains the backend system for A/B testing built on Firebase Cloud Functions and Firebase Realtime Database. The system enables the execution of multiple concurrent experiments, facilitates event tracking for user entry and exit from tests, and supports sophisticated conditions for user segmentation.

## Features
- **Multiple Concurrent Experiments:** Conduct multiple A/B tests simultaneously.
- **User Segmentation:** Configure advanced conditions for precise user segmentation.
- **Consistent User Assignment:** Ensure consistent user assignment to AB-groups throughout the experiment duration.
- **Robust Configuration Management:** Manage A/B test configurations effectively, specifying parameters like test duration, variant proportions, and experimental conditions.
- **Pause, Resume, and Stop:** Control the experiment lifecycle with the ability to pause, resume, and stop tests at any time.

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/yanmasharski/tuna-ab.git
   cd tuna-ab
   ```

2. Set up Firebase project:
   - Create a Firebase project on the [Firebase Console](https://console.firebase.google.com/).
   - Configure Firebase credentials and update `.firebaserc`.

3. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

4. Deploy Cloud Functions:
   ```bash
   firebase deploy --only functions
   ```

5. Set up Realtime Database rules:
   - Configure database rules according to your experiment requirements.

## Usage
- Define experiments, conditions, and parameters in the Realtime Database.
- Use provided API endpoints for controlling experiments.

## API Endpoints
1. **Start an Experiment:**
   - Endpoint: `/startExperiment`
   - Method: `POST`
   - Payload: `{ experimentId, conditions, duration, variants }`

2. **Pause/Resume/Stop an Experiment:**
   - Endpoint: `/controlExperiment`
   - Method: `POST`
   - Payload: `{ experimentId, action }` (actions: "pause", "resume", "stop")

3. **Get Experiment Results:**
   - Endpoint: `/getExperimentResults`
   - Method: `GET`
   - Parameters: `experimentId`

## Configuration Management
Update the Realtime Database with experiment configurations:
```json
{
  "experiments": {
    "experimentId": {
      "conditions": {
        "segment": "conditionA"
      },
      "duration": 7, // in days
      "variants": {
        "control": 0.5,
        "variantA": 0.25,
        "variantB": 0.25
      }
    }
  }
}
```

Feel free to explore additional features and customize the system as needed. Happy testing!
