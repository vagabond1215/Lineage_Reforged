$path = 'tools/content-lint/index.mjs'
$text = Get-Content -Raw -Path $path
$old = 'const WORKPLACE_WORKFORCE_ROLES = new Set(["primary", "support", "specialist", "management"]);`nconst WORKPLACE_TOOL_TAG_PATTERN = /^tool\.[a-z0-9]+(?:_[a-z0-9]+)*$/;`nconst WORKPLACE_MISSING_TOOL_PENALTY_MODES = new Set(["reduced_output", "no_output"]);'
$new = "const WORKPLACE_WORKFORCE_ROLES = new Set([\"primary\", \"support\", \"specialist\", \"management\"]);`nconst WORKPLACE_TOOL_TAG_PATTERN = /^tool\\.[a-z0-9]+(?:_[a-z0-9]+)*$/;`nconst WORKPLACE_MISSING_TOOL_PENALTY_MODES = new Set([\"reduced_output\", \"no_output\"]);"
