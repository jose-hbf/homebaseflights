# Scripts

## Update Deals Script

Updates flight deals with fresh dates and randomized prices.

### Manual Execution

```bash
npm run update-deals
```

### Automated Weekly Updates (Cron Job)

#### Option 1: System Cron (Linux/macOS)

Add to crontab (`crontab -e`):

```bash
# Run every Sunday at midnight
0 0 * * 0 cd /path/to/hbf && npm run update-deals
```

#### Option 2: GitHub Actions

Create `.github/workflows/update-deals.yml`:

```yaml
name: Update Flight Deals

on:
  schedule:
    # Every Sunday at midnight UTC
    - cron: '0 0 * * 0'
  workflow_dispatch: # Allow manual trigger

jobs:
  update-deals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Update deals
        run: npm run update-deals

      - name: Commit and push changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add src/data/deals.ts
          git diff --staged --quiet || git commit -m "chore: update weekly deals"
          git push
```

#### Option 3: Vercel Cron Jobs

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/update-deals",
      "schedule": "0 0 * * 0"
    }
  ]
}
```

Then create `/app/api/update-deals/route.ts` to trigger the update.

### What the Script Does

1. Generates new deals for all 20 airports
2. Randomizes prices within ±15% of base price
3. Updates date ranges to upcoming months
4. Updates the `lastUpdated` timestamp
5. Overwrites `src/data/deals.ts`
