---
title: Coolify
description: Coolify Widget Configuration
---

Learn more about [Coolify](https://coolify.io/).

Displays statistics about your Coolify instance, including projects, applications, and databases.

First enable API access in Settings -> Configuration -> API.
Then generate the API Key under Keys & Tokens > API Tokens.
The simple "read" permission is enough.

```yaml
widget:
  type: coolify
  url: http://coolify.host.or.ip
  key: your-api-key
```
