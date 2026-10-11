# TinyURL Architecture

A serverless URL shortener on AWS (eu-west-1). A single Lambda function sits behind API Gateway. DynamoDB is the source of truth, and an ElastiCache Valkey cluster acts as a read-through cache on the redirect path.

> Infrastructure (API Gateway, VPC, ElastiCache, DynamoDB table, IAM) is not defined in this repo. Dashed nodes below are inferred from AWS constraints.

## System overview

```mermaid
flowchart LR
    client([Client<br/>browser / curl])

    subgraph aws["AWS · eu-west-1"]
        apigw["API Gateway (REST, stage /dev)<br/>POST /shorten<br/>GET /{shortCode}<br/>GET /redis"]

        subgraph vpc["VPC"]
            lambda["Lambda: tinyurl-service<br/>Node 20 · dist/handler.js"]
            valkey[("ElastiCache Valkey<br/>key url:{shortCode}<br/>TTL 3600 s")]
        end

        endpoint["Gateway endpoint / NAT"]
        ddb[("DynamoDB<br/>table UrlMappings<br/>PK shortCode")]
    end

    subgraph ci["GitHub"]
        gha["GitHub Actions<br/>deploy.yml"]
    end

    client -- HTTPS --> apigw
    apigw -- "Lambda proxy integration" --> lambda
    lambda -- "rediss:// TLS 6379" --> valkey
    lambda --> endpoint --> ddb
    gha -. "aws lambda update-function-code" .-> lambda
    apigw -. "201 JSON / 302 redirect" .-> client

    classDef inferred stroke-dasharray: 5 5
    class vpc,endpoint inferred
```

## Code structure inside the Lambda

The bundle uses a layered structure: router → handler → service → repository or cache client.

```mermaid
flowchart TD
    router["handler/handler.ts<br/>routes on httpMethod + resource"]

    router -- "POST /shorten" --> createH["handler/createUrl.ts"]
    router -- "GET /{shortCode}" --> redirectH["handler/redirectUrl.ts"]
    router -- "GET /redis" --> redisH["handler/redisConnect.ts"]

    createH --> urlSvc["services/urlService.ts<br/>createURLService · RedirectURLService"]
    redirectH --> urlSvc
    redisH --> redisSvc["services/redisService.ts<br/>connectivity check"]

    urlSvc --> utils["common/utils/url.utils.ts<br/>random base62 code · input validation"]
    urlSvc --> repo["repository/urlMapping.repository.ts<br/>addURL · findByURLCode"]
    urlSvc --> cacheClient["common/cache/velkeyClient.ts<br/>getValkeyClient"]
    redisSvc --> cacheClient

    repo --> ddb[("DynamoDB UrlMappings")]
    cacheClient --> valkey[("Valkey")]
```

## Create short URL: `POST /shorten`

```mermaid
sequenceDiagram
    autonumber
    actor C as Client
    participant G as API Gateway
    participant L as Lambda (createUrl → urlService)
    participant D as DynamoDB

    C->>G: POST /shorten {"url": "https://..."}
    G->>L: proxy event
    alt body is not JSON, or url is not absolute http(s) / over 2048 chars
        L-->>G: 400 {"message"}
        G-->>C: 400 Bad Request
    else valid url
        loop up to 3 attempts
            L->>L: generateShortCode() (7 random base62 chars)
            L->>D: PutItem shortCode, originalUrl, createdAt<br/>condition attribute_not_exists(shortCode)
            D-->>L: OK, or ConditionalCheckFailedException (retry with a new code)
        end
        L-->>G: 201 {"shortCode", "originalUrl"}
        G-->>C: 201 Created
    end
```

## Redirect: `GET /{shortCode}`

```mermaid
sequenceDiagram
    autonumber
    actor C as Client
    participant G as API Gateway
    participant L as Lambda (redirectUrl → urlService)
    participant V as Valkey
    participant D as DynamoDB

    C->>G: GET /abc1234
    G->>L: proxy event (pathParameters.shortCode)
    alt code is not 7 base62 chars (e.g. favicon.ico)
        L-->>G: 404
    else valid code
        L->>V: connect (TLS) + GET url:abc1234
        alt cache hit
            V-->>L: originalUrl
        else cache miss
            V-->>L: null
            L->>D: GetItem shortCode = abc1234
            alt item found
                D-->>L: item
                L->>V: SET url:abc1234 originalUrl EX 3600
            else no item
                D-->>L: nothing
                L-->>G: 404 {"message"}
            end
        end
        L-->>G: 302 Location: originalUrl
    end
    G-->>C: 302 redirect or 404
```

## Data model

```mermaid
erDiagram
    UrlMappings {
        string shortCode PK "7-char base62 code"
        string originalUrl "long URL"
        string createdAt "ISO-8601 timestamp"
    }
```

| Store | Key | Value | Written | Expiry |
|---|---|---|---|---|
| DynamoDB `UrlMappings` | `shortCode` | `originalUrl`, `createdAt` | On create (conditional put, retried on conflict) | None |
| Valkey | `url:{shortCode}` | original URL string (unknown codes are not cached) | On redirect cache miss | 3600 s |

## Deployment pipeline

```mermaid
flowchart LR
    push["push to main"] --> checkout["Checkout"] --> install["npm install"]
    install --> build["npm run build<br/>esbuild bundle → dist/handler.js"]
    build --> zip["zip lambda.zip"]
    zip --> creds["Configure AWS credentials<br/>(repo secrets)"]
    creds --> deploy["aws lambda update-function-code<br/>tinyurl-service"]
```
