# Deployment

The application uses two persistent Cloudflare Worker environments.

## Environments

| Environment | Git branch | Worker | Domain |
| --- | --- | --- | --- |
| Staging | `staging` | `spanish-quiz-studio-staging` | `staging.spanish-quizz.es` |
| Production | `main` | `spanish-quiz-studio` | `spanish-quizz.es` |

## Development flow

1. Create a feature branch from `staging`.
2. Open a pull request into `staging`.
3. CI runs lint, tests, and a verified build.
4. Merge into `staging` to deploy automatically to the staging Worker.
5. Verify the release at `staging.spanish-quizz.es`.
6. Open a pull request from `staging` into `main`.
7. Merge after staging verification. A successful push to `main` deploys production automatically.

Direct deployment from a developer workstation should not be the normal release process. GitHub Actions is the deployment authority.

## GitHub configuration

Create GitHub environments named `staging` and `production`.

Configure these Actions secrets, either at repository level or separately on both GitHub environments:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token must have permission to deploy the Workers used by this repository.

For stronger production control, configure the `production` GitHub environment with required reviewers.

## Cloudflare configuration

Create or deploy the Worker `spanish-quiz-studio-staging` and attach the custom domain:

`staging.spanish-quizz.es`

Keep the production Worker `spanish-quiz-studio` attached to:

`spanish-quizz.es`

Staging and production must not share environment-specific secrets or data stores unless explicitly intended.

If staging should not be public, protect `staging.spanish-quizz.es` with Cloudflare Access.

## Workflows

- `.github/workflows/ci.yml` validates pull requests and pushes affecting `staging` and `main`.
- `.github/workflows/deploy-staging.yml` deploys every push to `staging` with `wrangler deploy --env staging`.
- `.github/workflows/deploy-production.yml` deploys every push to `main` with `wrangler deploy --env production`.

Both deployment workflows can also be started manually with GitHub Actions `workflow_dispatch`.

## Wrangler

`wrangler.jsonc` defines explicit `staging` and `production` environments so staging can never overwrite the production Worker simply by using the staging deployment command.
