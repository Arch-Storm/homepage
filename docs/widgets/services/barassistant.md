---
title: Bar Assistant
description: Bar Assistant Widget Configuration
---

Learn more about [Bar Assistant](https://github.com/karlomikus/bar-assistant).

Displays statistics about your bar, including cocktails, ingredients, and shelf information.

Requires your Bar Assistant login credentials and bar ID.

If you only have one bar, it's id will be `1`.
To find the id of a specific bar:

> User Icon (Top Right) -> Bars -> Edit (Bar of your choice) -> Check Url for `id={barid}`

Allowed fields: `["total_cocktails", "total_ingredients", "total_favorited_cocktails", "total_shelf_cocktails", "total_shelf_ingredients", "total_bar_shelf_ingredients", "total_bar_shelf_cocktails", "total_bar_members", "total_collections"]`.

Default fields: `["total_shelf_cocktails", "total_shelf_ingredients", "total_bar_shelf_ingredients", "total_bar_shelf_cocktails"]`.

```yaml
widget:
  type: barassistant
  url: http://barassistant.host.or.ip
  username: your-email
  password: your-password
  barid: your-bar-id
  fields:
    - total_shelf_cocktails
    - total_shelf_ingredients
```
