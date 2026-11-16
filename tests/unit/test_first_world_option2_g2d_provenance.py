"""G2-D provenance: no save decoding, same-name alias, or quiet island promotion."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

MODULE=Path(__file__).resolve().parents[2]/"scripts/first-world-option2-g2d-provenance.py"
spec=importlib.util.spec_from_file_location("g2d",MODULE)
g2d=importlib.util.module_from_spec(spec)
spec.loader.exec_module(g2d)

class ProvenanceTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        self.saves=self.root/"Saves"
        self.saves.mkdir()
        self.save=self.saves/"20260315141309.save"
        self.save.write_bytes(b"NFW_SAVE_BIN"+(1).to_bytes(4,"little")+b"OPAQUE_NOT_READ")

    def test_header_is_metadata_only(self):
        inv=g2d.inventory_saves(self.saves)
        self.assertEqual(inv["count"],1)
        f=inv["files"][0]
        self.assertEqual(f["header"]["formatTag"],"NFW_SAVE_BIN")
        self.assertEqual(f["header"]["versionLeU32At12"],1)
        self.assertFalse(f["header"]["versionMeaningValidated"])
        self.assertFalse(f["header"]["payloadDecoded"])
        self.assertFalse(f["sourceOfOption2ExportsProven"])

    def test_changed_same_named_save_not_a_match(self):
        old={"status":"PARSED","files":[{"name":self.save.name,
            "sha256":"0"*64,"sizeBytes":1235224}]}
        c=g2d.compare_saves(old,g2d.inventory_saves(self.saves))
        self.assertEqual(len(c["sameNameChanged"]),1)
        self.assertTrue(c["sameNameChanged"][0]["sameNameIsNotEvidenceOfSameSave"])

    def test_same_bytes_does_not_prove_export_identity(self):
        inv=g2d.inventory_saves(self.saves)
        file=inv["files"][0]
        old={"status":"PARSED","files":[{"name":file["name"],
             "sha256":file["sha256"],"sizeBytes":file["sizeBytes"]}]}
        c=g2d.compare_saves(old,inv)
        self.assertEqual(c["sameNameExactMatch"],[file["name"]])
        self.assertFalse(file["sourceOfOption2ExportsProven"])

    def test_manifest_requires_real_app_id(self):
        p=self.root/"appmanifest_3035500.acf"
        p.write_text('"appid" "0000"\n"buildid" "1234"',encoding="utf8")
        self.assertEqual(g2d.steam_manifest(p)["status"],"UNRECOGNIZED_MANIFEST")
        p.write_text('"appid" "3035500"\n"buildid" "1234"',encoding="utf8")
        self.assertEqual(g2d.steam_manifest(p)["buildId"],"1234")

    def test_output_rejects_save_and_git_folders(self):
        with self.assertRaisesRegex(ValueError,"OUTPUT_HOLD"):
            g2d.ensure_output(self.saves/"reports",[self.saves])
        repo=self.root/"repo";repo.mkdir()
        (repo/".git").write_text("gitdir: /tmp/example")
        with self.assertRaisesRegex(ValueError,"OUTPUT_HOLD"):
            g2d.ensure_output(repo/"reports",[])

    def test_missing_sources_never_pass(self):
        x=g2d.verify_sources(self.root/"empty")
        self.assertFalse(x["allFiveVerified"])
        self.assertEqual(len(x["files"]),5)

    def test_private_and_redacted_reports_are_separate(self):
        r={"status":"SEMANTIC_LAND_AUTHORITY_HELD",
           "inputImageVerification":{"allFiveVerified":False,"files":[]},
           "saveInventory":{"count":1,"files":[{"name":"SECRET_TEST.save",
             "sha256":"f"*64,"header":{"formatTag":"NFW_SAVE_BIN"}}]},
           "priorReceiptStatus":"NOT_SUPPLIED",
           "priorReceiptComparison":{"sameNameChanged":[],"sameNameExactMatch":[]},
           "steamManifest":{"status":"NOT_SUPPLIED"},
           "gameExecutable":{"status":"NOT_SUPPLIED"},
           "sourceToExportRelation":{"status":"UNVERIFIED"},
           "nativeSemanticLandmask":{"status":"NOT_RECOVERED"},
           "holds":[]}
        private,public=g2d.write_receipts(self.root/"out",r)
        self.assertTrue(private.is_file() and public.is_file())
        safe=public.read_text()
        self.assertNotIn("SECRET_TEST.save",safe)
        self.assertNotIn("f"*64,safe)
        self.assertTrue(json.loads(safe)["privateSaveNamesAndHashesExcluded"])

    def test_unrecognized_save_does_not_guess_header(self):
        self.save.write_bytes(b"UNKNOWN_FILE_TYPE")
        self.assertEqual(g2d.header(self.save)["formatTag"],"UNKNOWN")

if __name__=="__main__":
    unittest.main()
