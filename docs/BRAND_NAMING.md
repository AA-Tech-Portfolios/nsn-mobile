# Brand Naming

SoftHello is the umbrella product name. It describes the broader app direction: a calmer way for adults to reach out, reconnect, and find small gatherings with privacy, consent, and social comfort built in from the start.

SoftShore is the local Sydney North Shore pilot/community brand. It keeps the pilot grounded in place while moving public-facing language away from North Shore Nights and NSN.

North Shore Nights and NSN remain valid historical and internal terminology for now. They appear in the repository name, package name, folders, route names, docs, screenshots, and prototype data. Do not blindly rename every internal reference. Repository, package, folder, bundle identifier, and broad code-symbol renames should be planned as separate future tasks.

## Naming Model

| Name                     | Role                            | Use                                                                                                                                                           |
| ------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoftHello                | Umbrella/global product         | Long-term product strategy, shared principles, future global copy, neutral contributor context.                                                               |
| SoftShore                | Local Sydney North Shore pilot  | Public-facing pilot copy, tester-facing docs, local community language, gradual replacement for NSN wording where appropriate.                                |
| North Shore Nights / NSN | Historical/internal terminology | Existing repository, package, internal docs, prototype references, screenshots, legacy planning, and code identifiers until specific rename tasks are scoped. |

## Contributor Guidance

- Prefer **SoftHello** when discussing the broader product or reusable product principles.
- Prefer **SoftShore** when writing public-facing copy for the Sydney North Shore pilot.
- Keep **NSN** where changing it would imply a repo/package/code rename, break existing paths, or create unnecessary churn.
- Treat `nsn-mobile` as an acceptable temporary repo name.
- Treat package and bundle identifier renames as separate migration tasks that need planning, testing, and release coordination.
- Keep copy warm, calm, respectful, and practical.
- Describe small gatherings, reaching out, reconnecting, comfort, privacy, consent, and belonging.
- Avoid language that sounds like nightlife, dating, generic networking, performance, popularity, or loud social media.

## Prototype-Safe Copy

- "SoftShore is the local Sydney North Shore pilot for SoftHello."
- "Find small, low-pressure gatherings around the North Shore."
- "Reach out gently, reconnect at your own pace, and keep privacy choices visible."
- "A calm pilot for small local plans, clear expectations, and respectful connection."
- "SoftHello is the broader product direction; SoftShore is where we are learning locally first."

## Migration Rule

When adding or changing public-facing text, ask:

1. Is this broader product language? Use SoftHello.
2. Is this Sydney North Shore pilot language? Use SoftShore.
3. Is this an internal code path, repo/package identifier, historical doc, or screenshot label? Keep NSN unless a scoped rename task says otherwise.

This lets the brand evolve without creating accidental technical churn.
