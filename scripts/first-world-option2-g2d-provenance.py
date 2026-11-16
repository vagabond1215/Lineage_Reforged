#!/usr/bin/env python3
"""Read-only G2-D Fantasy Map Simulator source/save/build provenance.
Pure Python stdlib. No save decoding, map edits, repository writes or island authority.
Private hashes stay in an external local receipt; share only redacted output.
"""
from __future__ import annotations
import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import sys
import tempfile

SOURCE = {
 "State":("first_world_simulator_option2_2026_11_15/WorldMap_20261115_201735_State.png",14269354,"419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de"),
 "Height":("first_world_simulator_option2_2026_11_15/WorldMap_20261115_201753_Height.png",18484528,"776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce"),
 "Biome":("first_world_simulator_option2_2026_11_15/WorldMap_20261115_201806_Biome.png",17092660,"c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2"),
 "LegacyBiome":("First World Biome.png",2562408,"9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12"),
 "LegacyElevation":("First World Elevation.png",2840400,"02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d"),
}
ASSET_DIR=Path("packages/content/base/world/map_assets")
SAVE_MAGIC=b"NFW_SAVE_BIN"

def sha256(p):
    h=hashlib.sha256()
    with p.open("rb") as stream:
        for chunk in iter(lambda: stream.read(4*1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()

def utc_mtime(p):
    return dt.datetime.fromtimestamp(p.stat().st_mtime,dt.timezone.utc).isoformat()

def verify_sources(repo):
    if repo is None:
        return {"status":"NOT_SUPPLIED","allFiveVerified":False,"files":[]}
    rows=[]
    for role,(rel,size,expected) in SOURCE.items():
        p=repo/ASSET_DIR/rel
        if not p.is_file():
            rows.append({"role":role,"status":"MISSING"})
            continue
        observed=p.stat().st_size
        digest=sha256(p)
        rows.append({"role":role,"bytes":observed,"sha256":digest,
                     "status":"PASS" if observed==size and digest==expected else "MISMATCH_HOLD"})
    valid=len(rows)==5 and all(r["status"]=="PASS" for r in rows)
    return {"status":"PASS" if valid else "MISSING_OR_MISMATCH_HELD",
            "allFiveVerified":valid,"files":rows}

def header(p):
    # Reads at most 24 bytes, not the opaque data payload.
    with p.open("rb") as stream:
        head=stream.read(24)
    if len(head)>=16 and head[:12]==SAVE_MAGIC:
        return {"formatTag":"NFW_SAVE_BIN",
                "versionLeU32At12":int.from_bytes(head[12:16],"little"),
                "versionMeaningValidated":False,"payloadDecoded":False}
    return {"formatTag":"UNKNOWN","versionLeU32At12":None,
            "versionMeaningValidated":False,"payloadDecoded":False}

def inventory_saves(folder):
    if folder is None:
        return {"status":"NOT_SUPPLIED","count":0,"files":[]}
    if not folder.is_dir():
        return {"status":"DIRECTORY_NOT_FOUND","count":0,"files":[]}
    rows=[]
    for p in sorted(folder.iterdir(),key=lambda x:x.name.casefold()):
        if p.is_file() and p.suffix.casefold()==".save":
            rows.append({"name":p.name,"sizeBytes":p.stat().st_size,
                         "modifiedUtc":utc_mtime(p),"sha256":sha256(p),
                         "header":header(p),"sourceOfOption2ExportsProven":False})
    return {"status":"HASHED_ONLY_NO_EXPORT_MATCH" if rows else "NO_SAVES_FOUND",
            "count":len(rows),"files":rows}

def prior_receipt(p):
    if p is None:
        return {"status":"NOT_SUPPLIED","files":[]}
    if not p.is_file():
        return {"status":"NOT_FOUND","files":[]}
    obj=json.loads(p.read_text(encoding="utf-8-sig"))
    rows=obj.get("saveInventory",[])
    if isinstance(rows,dict):
        rows=rows.get("files",[])
    if not isinstance(rows,list):
        raise ValueError("Invalid previous receipt saveInventory")
    result=[]
    for e in rows:
        if not isinstance(e,dict):
            continue
        name=e.get("name"); digest=e.get("sha256")
        size=e.get("size",e.get("sizeBytes"))
        if isinstance(name,str) and isinstance(size,int) and isinstance(digest,str) and re.fullmatch("[0-9a-fA-F]{64}",digest):
            result.append({"name":name,"sizeBytes":size,"sha256":digest.lower()})
    return {"status":"PARSED" if result else "NO_HASHED_SAVES","files":result}

def compare_saves(old,current):
    if old["status"]!="PARSED":
        return {"status":"UNAVAILABLE","sameNameChanged":[],"sameNameExactMatch":[]}
    seen={e["name"].casefold():e for e in current["files"]}
    changed=[]; same=[]
    for previous in old["files"]:
        now=seen.get(previous["name"].casefold())
        if now is None:
            continue
        if now["sha256"]==previous["sha256"] and now["sizeBytes"]==previous["sizeBytes"]:
            same.append(previous["name"])
        else:
            changed.append({"name":previous["name"],
                            "previousSizeBytes":previous["sizeBytes"],
                            "currentSizeBytes":now["sizeBytes"],
                            "previousSha256":previous["sha256"],
                            "currentSha256":now["sha256"],
                            "sameNameIsNotEvidenceOfSameSave":True})
    return {"status":"COMPARISON_NOT_EXPORT_PROOF",
            "sameNameChanged":changed,"sameNameExactMatch":same}

def steam_manifest(p):
    if p is None:
        return {"status":"NOT_SUPPLIED","buildId":None}
    if not p.is_file():
        return {"status":"NOT_FOUND","buildId":None}
    s=p.read_text(encoding="utf-8-sig",errors="replace")
    def val(k):
        m=re.search(r'"'+re.escape(k)+r'"\s*"([^"\r\n]*)"',s,re.IGNORECASE)
        return m.group(1) if m else None
    appid=val("appid"); build=val("buildid")
    if appid!="3035500" or not build or not build.isdecimal():
        return {"status":"UNRECOGNIZED_MANIFEST","buildId":None,"sha256":sha256(p)}
    return {"status":"DISK_MANIFEST_ONLY_NOT_RUNNING_BUILD_PROOF","appId":appid,
            "buildId":build,"sha256":sha256(p)}

def executable(root):
    if root is None:
        return {"status":"NOT_SUPPLIED"}
    p=root/"FantasyMapSimulator.exe"
    if not p.is_file():
        return {"status":"NOT_FOUND"}
    return {"status":"DISK_EXE_HASH_ONLY_NOT_RUNNING_BUILD_PROOF",
            "name":p.name,"bytes":p.stat().st_size,"sha256":sha256(p),
            "modifiedUtc":utc_mtime(p)}

def ensure_output(out,inputs):
    if any(out==p or p in out.parents for p in inputs):
        raise ValueError("OUTPUT_HOLD: output may not be under an input tree")
    if any((p/".git").exists() for p in (out,*out.parents)):
        raise ValueError("OUTPUT_HOLD: output may not be in a Git checkout")

def build(args):
    repo=args.repo_root.resolve() if args.repo_root else None
    saves=args.save_dir.resolve() if args.save_dir else None
    src=verify_sources(repo)
    current=inventory_saves(saves)
    previous=prior_receipt(args.prior_receipt.resolve() if args.prior_receipt else None)
    change=compare_saves(previous,current)
    steam=steam_manifest(args.steam_manifest.resolve() if args.steam_manifest else None)
    exe=executable(args.game_install_dir.resolve() if args.game_install_dir else None)
    active=args.user_declared_active_save
    sem=[]
    for path in args.semantic_export:
        sem.append({"name":path.name,
                    "status":"CANDIDATE_NOT_SCHEMA_VALIDATED" if path.is_file() else "NOT_FOUND",
                    "sha256":sha256(path) if path.is_file() else None})
    holds=["No verified current-build official land/water semantic export or supported save decoder",
           "No verified source pairing between a currently loaded save and 2026-11-15 Option 2 PNGs",
           "No source Voronoi land cells or certified physical island geometries"]
    if not src["allFiveVerified"]:
        holds.append("Five original PNG identities not all checked in this run")
    if change["sameNameChanged"]:
        holds.append("Previously hashed same-name save has changed bytes")
    return {"schemaVersion":1,"kind":"FIRST_WORLD_G2D_PRIVATE_LOCAL_PROVENANCE",
            "auditedUtc":dt.datetime.now(dt.timezone.utc).isoformat(),
            "status":"SEMANTIC_LAND_AUTHORITY_HELD",
            "inputImageVerification":src,"saveInventory":current,
            "priorReceiptStatus":previous["status"],"priorReceiptComparison":change,
            "steamManifest":steam,"gameExecutable":exe,
            "supplementalSemanticExportCandidates":sem,
            "userDeclaration":{"userProvidedActiveSaveName":active,
                "listedSaveNameMatched":bool(active and any(x["name"].casefold()==active.casefold() for x in current["files"])),
                "saveThatProducedOption2ExportsVerified":False},
            "sourceToExportRelation":{"status":"UNVERIFIED",
                "automaticInferenceFromFilename":False},
            "nativeSemanticLandmask":{"status":"NOT_RECOVERED","decoderAttempted":False},
            "holds":holds,"canonicalWritable":False,
            "politicalSovereigntyAssigned":False,
            "traversableRouteApproved":False,"sourceFilesModified":False}

def public_summary(r):
    changes=r["priorReceiptComparison"]["sameNameChanged"]
    tags={}
    for file in r["saveInventory"]["files"]:
        tag=file["header"]["formatTag"]
        tags[tag]=tags.get(tag,0)+1
    return {"schemaVersion":1,"kind":"G2D_SHAREABLE_REDACTED_SUMMARY",
        "status":r["status"],
        "inputImagesAllVerified":r["inputImageVerification"]["allFiveVerified"],
        "verifiedImageCount":sum(f["status"]=="PASS" for f in r["inputImageVerification"]["files"]),
        "saveCount":r["saveInventory"]["count"],"saveFormatTagCounts":tags,
        "priorReceiptStatus":r["priorReceiptStatus"],
        "sameNameDifferentByteCount":len(changes),
        "sameNameDifferentByteSizes":[{"previousSizeBytes":x["previousSizeBytes"],
            "currentSizeBytes":x["currentSizeBytes"]} for x in changes],
        "sameNameExactByteMatchCount":len(r["priorReceiptComparison"]["sameNameExactMatch"]),
        "steamManifestStatus":r["steamManifest"]["status"],
        "steamBuildId":r["steamManifest"].get("buildId"),
        "diskExecutableStatus":r["gameExecutable"]["status"],
        "sourceToExportRelationStatus":r["sourceToExportRelation"]["status"],
        "nativeSemanticLandmaskStatus":r["nativeSemanticLandmask"]["status"],
        "holds":r["holds"],"canonicalWritable":False,
        "privateSaveNamesAndHashesExcluded":True}

def write_receipts(out,r):
    out.mkdir(parents=True,exist_ok=True)
    token=dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    for i in range(100):
        suffix=token+("_"+str(i) if i else "")
        private=out/("g2d_private_provenance_"+suffix+".json")
        public=out/("g2d_shareable_summary_"+suffix+".json")
        if private.exists() or public.exists():continue
        with private.open("x",encoding="utf-8") as stream:
            json.dump(r,stream,indent=2);stream.write("\n")
        with public.open("x",encoding="utf-8") as stream:
            json.dump(public_summary(r),stream,indent=2);stream.write("\n")
        return private,public
    raise RuntimeError("OUTPUT_HOLD: cannot obtain unique report names")

def self_test():
    with tempfile.TemporaryDirectory() as folder:
        root=Path(folder)
        saves=root/"Saves";saves.mkdir()
        p=saves/"March.save";p.write_bytes(SAVE_MAGIC+(1).to_bytes(4,"little")+b"OPAQUE")
        now=inventory_saves(saves)
        assert now["count"]==1
        assert now["files"][0]["header"]["versionLeU32At12"]==1
        assert now["files"][0]["header"]["payloadDecoded"] is False
        old={"status":"PARSED","files":[{"name":"March.save","sha256":"0"*64,"sizeBytes":1}]}
        assert len(compare_saves(old,now)["sameNameChanged"])==1
        manifest=root/"appmanifest_3035500.acf"
        manifest.write_text('"appid" "3035500"\n"buildid" "12345"',encoding="utf8")
        assert steam_manifest(manifest)["buildId"]=="12345"
        try:
            ensure_output(saves/"reports",[saves])
            raise AssertionError("Invalid output path accepted")
        except ValueError:pass
    print("PASS G2-D private save/version metadata and output guards")

def main():
    p=argparse.ArgumentParser(description=__doc__)
    for flag in ("repo-root","save-dir","prior-receipt","steam-manifest","game-install-dir","output-dir"):
        p.add_argument("--"+flag,type=Path)
    p.add_argument("--semantic-export",type=Path,action="append",default=[])
    p.add_argument("--user-declared-active-save")
    p.add_argument("--self-test",action="store_true")
    a=p.parse_args()
    if a.self_test:return self_test()
    if not a.output_dir:p.error("--output-dir is required")
    out=a.output_dir.resolve()
    roots=[v.resolve() for v in (a.repo_root,a.save_dir,a.game_install_dir) if v and v.exists()]
    ensure_output(out,roots)
    receipt=build(a)
    private,shareable=write_receipts(out,receipt)
    print(json.dumps({"status":receipt["status"],
        "verifiedFiveSources":receipt["inputImageVerification"]["allFiveVerified"],
        "saveCount":receipt["saveInventory"]["count"],
        "sameNameChangedCount":len(receipt["priorReceiptComparison"]["sameNameChanged"]),
        "steamBuildId":receipt["steamManifest"].get("buildId"),
        "privateLocalReceipt":str(private),"shareableSummary":str(shareable),
        "canonicalWritable":False},indent=2))

if __name__=="__main__":
    try:main()
    except (OSError,ValueError,RuntimeError,json.JSONDecodeError) as error:
        print("G2-D PROVENANCE HOLD:",str(error),file=sys.stderr)
        raise SystemExit(2) from error
