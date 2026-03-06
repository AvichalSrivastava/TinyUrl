<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
</head>

<body>

<h1>TinyURL – Serverless URL Shortener</h1>

<p>
A scalable <b>URL Shortener service</b> built using a <b>Serverless AWS architecture</b>.
This project demonstrates how services like <b>TinyURL</b> or <b>Bitly</b> can be designed
using modern cloud-native components.
</p>

<p>
Users can submit a long URL and receive a short unique code which later redirects
to the original URL.
</p>

<div class="section">
<h2>Architecture</h2>

<div class="arch">
<pre>
Client
  │
  ▼
API Gateway
  │
  ▼
AWS Lambda
  │
  ├── Redis Cache (planned)
  │
  ▼
DynamoDB
</pre>
</div>

<h3>Redirect Flow</h3>

<pre>
User → short URL
      ↓
API Gateway
      ↓
Lambda
      ↓
Redis Cache
      ↓ (hit)
302 Redirect

Cache miss
      ↓
DynamoDB
      ↓
Store in Redis
      ↓
Redirect
</pre>

</div>

<div class="section">
<h2>Features</h2>

<ul>
<li>URL shortening API</li>
<li>Fast HTTP 302 redirection</li>
<li>Unique short code generation</li>
<li>Serverless AWS architecture</li>
<li>DynamoDB scalable storage</li>
<li>GitHub Actions CI/CD pipeline</li>
<li>Extensible caching layer (Redis / Valkey)</li>
</ul>

</div>

<div class="section">

<h2>API Endpoints</h2>

<div class="api">

<h3>Create Short URL</h3>

<code>POST /shorten</code>

<h4>Request</h4>

<pre>
{
  "url": "https://example.com/very/long/url"
}
</pre>

<h4>Response</h4>

<pre>
{
  "shortUrl": "https://domain/abc123"
}
</pre>

</div>

<br>

<div class="api">

<h3>Redirect to Original URL</h3>

<code>GET /{shortCode}</code>

<p>Example:</p>

<pre>
https://api-domain/abc123
</pre>

<p>Response:</p>

<pre>
302 Redirect → Original URL
</pre>

</div>

</div>

<div class="section">

<h2>Short Code Generation</h2>

<p>The system generates unique short codes using the following steps:</p>

<ol>
<li>Generate <b>UUIDv7</b> (time ordered)</li>
<li>Remove dashes from UUID</li>
<li>Convert hexadecimal string → <b>BigInt</b></li>
<li>Encode into <b>Base62</b></li>
</ol>

<pre>
UUIDv7 → Hex → BigInt → Base62 → Short Code
</pre>

<p>This ensures:</p>

<ul>
<li>Very low collision probability</li>
<li>Time ordered IDs</li>
<li>Short human-friendly URLs</li>
</ul>

</div>

<div class="section">

<h2>CI/CD Pipeline</h2>

<p>Deployment is automated using <b>GitHub Actions</b>.</p>

<pre>
1. Checkout repository
2. Install dependencies
3. Build Lambda using esbuild
4. Package artifact
5. Deploy to AWS Lambda
</pre>

</div>

<div class="section">

<h2>Tech Stack</h2>

<ul>
<li>Node.js 20</li>
<li>TypeScript</li>
<li>AWS Lambda</li>
<li>API Gateway</li>
<li>DynamoDB</li>
<li>AWS SDK v3</li>
<li>esbuild</li>
<li>GitHub Actions</li>
</ul>

</div>

<div class="section">

<h2>Local Development</h2>

<h3>Install Dependencies</h3>

<pre>
npm install
</pre>

<h3>Run Locally</h3>

<pre>
npm run dev
</pre>

<h3>Build</h3>

<pre>
npm run build
</pre>

<h3>Package Lambda</h3>

<pre>
npm run zip
</pre>

</div>

<div class="section">

<h2>Future Improvements</h2>

<ul>
<li>Redis / Valkey caching layer</li>
<li>CloudFront CDN caching</li>
<li>Rate limiting</li>
<li>Analytics for URL clicks</li>
<li>Custom domains</li>
<li>Expiring URLs</li>
</ul>

</div>

<div class="section">

<h2>Example</h2>

<pre>
https://i5tib80qb0.execute-api.eu-west-1.amazonaws.com/dev/32D7Co6
</pre>

</div>

<div class="section">

<h2>Learning Goals</h2>

<ul>
<li>System Design</li>
<li>Serverless Architecture</li>
<li>Scalable URL Shortener Design</li>
<li>AWS Infrastructure</li>
<li>CI/CD Automation</li>
</ul>

</div>

</body>
</html>
