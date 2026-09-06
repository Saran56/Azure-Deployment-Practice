# Azure Production Architecture Demo Project

Intha repository unga Azure Enterprise Architecture practice-kaga ready panniyachu.

## Structure:
- **`backend/`**: Node.js + Express REST API (Azure Email Service & MySQL integration) with Dockerfile for ACR & Azure DevOps CI/CD.
- **`frontend/`**: React (Vite) App optimized for Azure Static Web Apps (SWA).
- **`pipelines/`**: `azure-pipelines-backend.yml` (Azure DevOps CI/CD pipeline template).

## Quick Setup:
1. **Frontend**:
   - Azure Static Web App create pannum pothu:
     - App location: `frontend`
     - Output location: `dist`
2. **Backend**:
   - ACR-ku push panna Dockerfile `backend/Dockerfile`.
   - Port `8080` expose aagum.
   - App Service settings-la `COMMUNICATION_SERVICES_CONNECTION_STRING` & `SENDER_EMAIL_ADDRESS` config pannunga.
