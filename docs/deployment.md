# Deployment

The application is trunk-based: `main` is the only long-lived branch, and
production deploys are a deliberate, manual action.

## Environments

| Environment | Git ref | Worker | Domain |
| --- | --- | --- | --- |
| PR preview | per pull request | `spanish-gustar-quiz-pr-<number>` | `*.workers.dev` |
| Production | `main` | `spanish-gustar-quiz` | `spanish-quizz.es` |

## Development flow

1. Create a feature branch from `main`.
2. Open a pull request into `main`.
3. CI runs lint, tests, and a verified build.
4. `pr-preview.yml` deploys the PR to its own Worker and comments the
   preview URL on the PR; it redeploys on every push and is torn down
   when the PR closes.
5. Merge into `main` once reviewed. Merging does **not** deploy production.
6. `branch-cleanup.yml` deletes the merged head branch automatically.
7. When you're ready to release, manually run the `Deploy Production`
   GitHub Actions workflow (`workflow_dispatch`) against `main`.

Direct deployment from a developer workstation should not be the normal release process. GitHub Actions is the deployment authority.

## GitHub configuration

Create a GitHub environment named `production`.

Configure these Actions secrets, either at repository level or on the `production` environment:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token must have permission to deploy the Workers used by this repository, including creating/deleting per-PR preview Workers.

For stronger production control, configure the `production` GitHub environment with required reviewers, in addition to the `workflow_dispatch`-only trigger.

## Cloudflare configuration

Keep the production Worker `spanish-gustar-quiz` attached to:

`spanish-quizz.es`

PR preview Workers deploy to their default `*.workers.dev` subdomain and don't need a custom domain; they're deleted automatically when their PR closes.

## Workflows

- `.github/workflows/ci.yml` validates pull requests and pushes affecting `main`.
- `.github/workflows/pr-preview.yml` deploys/updates a preview Worker on every PR push, comments the URL, and deletes the preview Worker when the PR closes.
- `.github/workflows/branch-cleanup.yml` deletes a PR's head branch once it's merged.
- `.github/workflows/deploy-production.yml` deploys `main` to production with `wrangler deploy --env production`, but only when manually triggered via GitHub Actions `workflow_dispatch` — never automatically on push.

## Wrangler

`wrangler.jsonc` defines an explicit `production` environment. PR preview deploys override the Worker name with `--name` instead of using a named environment, so they can never collide with or overwrite the production Worker.
