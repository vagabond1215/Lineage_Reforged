"""Emit only nonsecret G10D.2 selected backup lineage evidence."""

import hashlib
import json
import sys
from pathlib import Path


def summary(path: Path):
    raw = path.read_bytes()
    archive = json.loads(raw)
    families = archive["families"]
    by_name = {family["name"]: family for family in families}
    return {
        "bytes": len(raw),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "families": [
            {"name": family["name"], "count": family["count"], "sha256": family["sha256"]}
            for family in families
        ],
        "artifactIds": [row["artifactId"] for row in by_name["artifacts"]["rows"]],
        "publicationIds": [
            row["publicationId"] for row in by_name["descendantPublicationRecoveries"]["rows"]
        ],
        "witnessRowsDigest": by_name["witnesses"]["sha256"],
        "heads": [
            {"accountId": row["accountId"], "campaignId": row["campaignId"],
             "artifactId": row["value"]["headArtifactId"],
             "revision": row["value"]["headRevision"]}
            for row in by_name["controls"]["rows"]
        ],
        "accounts": [
            {"accountId": row["accountId"], "revision": row["revision"],
             "runCount": len(row["profile"]["history"]["runRecords"])}
            for row in by_name["accounts"]["rows"]
        ],
    }


def main():
    first = summary(Path(sys.argv[1]))
    second = summary(Path(sys.argv[2]))
    first_artifacts = set(first.pop("artifactIds"))
    second_artifacts = set(second.pop("artifactIds"))
    first_publications = set(first.pop("publicationIds"))
    second_publications = set(second.pop("publicationIds"))
    result = {
        "status": "PASS" if len(first["families"]) == len(second["families"]) == 14
        and first_artifacts <= second_artifacts
        and first_publications <= second_publications
        and len(second_artifacts - first_artifacts) == 1
        and len(second_publications - first_publications) == 1
        and first["witnessRowsDigest"] == second["witnessRowsDigest"] else "FAIL",
        "first": first,
        "second": second,
        "retainedArtifactCount": len(first_artifacts & second_artifacts),
        "addedArtifactIds": sorted(second_artifacts - first_artifacts),
        "retainedDescendantCount": len(first_publications & second_publications),
        "addedDescendantPublicationIds": sorted(second_publications - first_publications),
        "witnessRowsExact": first["witnessRowsDigest"] == second["witnessRowsDigest"],
    }
    print(json.dumps(result, indent=2))
    if result["status"] != "PASS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
