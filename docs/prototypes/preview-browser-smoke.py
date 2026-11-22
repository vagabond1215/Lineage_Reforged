#!/usr/bin/env python3
"""Optional visual/interaction smoke test for the standalone Lineage Reforged preview.

Run from any cwd: python3 docs/prototypes/preview-browser-smoke.py [--screenshots]
Requires Python Playwright and a Chromium browser. The test intentionally blocks
remote image requests to exercise the retained-art fallback without network access.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
PREVIEW = ROOT / "docs/prototypes/lineage-reforged-current-interactive-preview.html"
SIZES = [(1440, 900), (1280, 860), (768, 980), (375, 812), (320, 700)]
LINEAGES = [
    "lineage.human", "lineage.dwarf", "lineage.gnome", "lineage.halfling",
    "lineage.elf", "lineage.dark_elf", "lineage.half_troll", "lineage.half_orc",
    "lineage.half_goblin", "lineage.half_merfolk",
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--screenshots", action="store_true", help="save desktop/mobile screenshots beside the preview")
    args = parser.parse_args()
    html = PREVIEW.read_text(encoding="utf-8")
    screenshot_dir = ROOT / "docs/prototypes/review-screenshots"
    if args.screenshots:
        screenshot_dir.mkdir(parents=True, exist_ok=True)
    executable = os.environ.get("CHROMIUM_EXECUTABLE") or shutil.which("chromium") or shutil.which("chromium-browser")
    report = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=executable, args=["--no-sandbox"])
        for width, height in SIZES:
            page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
            errors = []
            page.on("pageerror", lambda err: errors.append(str(err)))
            page.route("**/*", lambda route: route.abort() if route.request.url.startswith("http") else route.continue_())
            page.set_content(html, wait_until="domcontentloaded")

            # Real click-through regression for the new launcher/family review.
            login = page.locator("#previewLoginButton")
            assert login.is_disabled()
            assert page.locator("#previewPassword").is_disabled()
            page.locator("#previewAccountPicker").select_option("preview-adventurer")
            assert login.is_enabled()
            page.locator("#previewPassword").fill("wrong")
            login.click()
            assert "demo" in page.locator("#previewLoginError").inner_text()
            page.locator("#previewPassword").fill("demo")
            page.locator("#previewStayLoggedIn").check()
            login.click()
            page.locator('[data-launch="chronicle"]').click()
            page.locator('[data-launch="selectWorld"]').first.click()
            assert page.locator(".family-card").count() == 2
            assert page.locator('[data-family="starwillow"], [data-family="vale"]').count() == 0
            assert page.locator('[data-launch="openCodex"]').is_visible()
            page.locator('[data-launch="openCodex"]').click()
            assert page.locator(".codex-library .family-card").count() == 2
            assert page.locator('.codex-library [data-family="vale"] [data-launch="familyContinue"]').is_disabled()
            page.locator('.codex-library [data-character-id="maris"][data-launch="expandSave"]').click()
            assert page.locator(".codex-library #family-member-maris .save-statgroup").count() == 3
            page.locator("#dialogbg .dialogfooter button").click()
            assert page.locator('[data-family="ashford"] [data-launch="playSave"]').count() == 2
            ashford = page.locator('[data-family="ashford"]')
            assert ashford.locator(".family-title").inner_text() == "Ashford"
            assert ashford.locator(".family-head .family-tree-button svg").count() == 1
            assert ashford.locator('.family-head [data-launch="familyContinue"]').count() == 1
            assert ashford.locator(".family-metrics, .family-emblem, .family-group-title, [data-launch='familyNewHeir']").count() == 0
            assert ashford.locator(".save-tile").count() == 3
            assert ashford.locator(".heir-slot.named").count() == 2
            assert ashford.locator(".heir-slot.vacant").count() == 3
            assert ashford.locator('[data-heir-id="elara"] [data-launch="confirmSuccession"]').is_disabled()
            assert ashford.locator('[data-heir-id="rowan"] [data-launch="confirmSuccession"]').is_disabled()
            assert page.locator('[data-heir-id="dain"] [data-launch="confirmSuccession"]').is_enabled()
            assert ashford.locator(".family-member-row[id]").evaluate_all("rows=>rows.map(r=>r.id)") == [
                "family-member-edmund", "family-member-aldric", "family-member-celyra", "family-member-elara", "family-member-rowan"]
            root = page.locator("#family-member-edmund").bounding_box()
            child = page.locator("#family-member-aldric").bounding_box()
            grandchild = page.locator("#family-member-celyra").bounding_box()
            assert root["x"] < child["x"] < grandchild["x"]
            header_title = ashford.locator(".family-title").bounding_box()
            header_continue = ashford.locator('[data-launch="familyContinue"]').bounding_box()
            assert header_continue["x"] >= header_title["x"] + header_title["width"] - 1
            assert abs(header_continue["y"] + header_continue["height"]/2 - header_title["y"] - header_title["height"]/2) < 3
            assert page.locator(".launcher-invitation").inner_text() == "Every life has a beginning."
            assert page.locator(".save-detail").count() == 0
            page.locator('[data-launch="playSave"][data-character-id="celyra"]').click()
            assert page.locator("#dialogTitle").inner_text() == "Celyra Ashford"
            page.locator("#dialogbg .dialogfooter button").click()
            page.locator('[data-launch="familyContinue"][data-family-id="ashford"]').click()
            assert page.locator("#dialogTitle").inner_text() == "Celyra Ashford"
            page.locator("#dialogbg .dialogfooter button").click()
            page.locator('[data-launch="openFamilyTree"][data-family-id="ashford"]').click()
            assert page.locator(".family-tree-scroll .tree-person").count() == 5
            page.locator('[data-launch="selectTreePerson"][data-character-id="edmund"]').click()
            assert "Edmund Ashford" in page.locator(".tree-selection").inner_text()
            page.locator('[data-launch="revealFamilyRecord"][data-character-id="edmund"]').click()
            assert page.locator("#family-member-edmund .save-detail").is_visible()
            page.locator('[data-launch="expandSave"][data-character-id="edmund"]').click()
            page.locator('[data-launch="playSave"][data-character-id="aldric"]').click()
            assert page.locator("#dialogTitle").inner_text() == "Aldric Ashford"
            page.locator("#dialogbg .dialogfooter button").click()
            page.locator('[data-launch="expandSave"][data-character-id="aldric"]').click()
            aldric = page.locator("#family-member-aldric .save-tile")
            assert aldric.locator(".save-tabs").count() == 0
            assert aldric.locator(".save-statgroup h3").all_inner_texts() == ["Power", "Prowess", "Mind"]
            portrait = aldric.locator(".save-portrait").bounding_box()
            tile = aldric.bounding_box()
            assert abs(portrait["height"] - tile["height"]) <= 2
            assert portrait["x"] < aldric.locator(".save-record").bounding_box()["x"]
            page.locator('[data-launch="startHeir"][data-character-id="aldric"]').click()
            assert "Aldric Ashford" in page.locator(".heir-context").inner_text()
            assert page.locator('[data-pick="lineage"]').count() == 1
            page.locator("#creatorBack").click()
            page.locator('[data-heir-id="dain"] [data-launch="confirmSuccession"]').click()
            assert page.locator("#dialogTitle").inner_text() == "Activate Dain Ironvein"
            page.locator('[data-launch="succeedHeir"][data-character-id="dain"]').click()
            assert page.locator('[data-launch="playSave"][data-character-id="dain"]').count() == 1
            assert page.locator('[data-family-section="active"] [data-family="ironvein"]').count() == 1
            assert page.locator('[data-heir-id="dain"]').count() == 0
            assert page.locator('[data-family="vale"]').count() == 0
            assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 1")
            page.locator('.launcher-subbar-back [data-launch="worlds"]').click()
            page.locator('[data-launch="newWorld"]').click()
            page.locator("#previewWorldName").fill("Empty test World")
            page.locator('[data-launch="createWorld"]').click()
            assert page.locator(".save-tile").count() == 0
            assert "No characters yet" in page.locator("#launcherMain").inner_text()
            page.locator('[data-launch="startCreator"]').click()
            page.evaluate("state.stage=1;render()")
            for key in ("skin", "hair", "eyes"):
                assert page.locator(f'[data-color="{key}"][aria-pressed="true"]').count() == 1
            assert page.locator("#creatorHeaderName").inner_text() == ""
            assert page.locator("#firstName").input_value() == ""
            assert page.evaluate("stageValid(1)") is False
            counts = [page.locator(f'[data-color="{key}"]').count() for key in ("skin", "hair", "eyes")]
            anchors = page.evaluate("""() => Object.fromEntries(
              ['skin','hair','eyes'].map(key => [key,paletteAnchors(key).length])
            )""")
            assert counts == [anchors["skin"] * 2, anchors["hair"] * 3, anchors["eyes"] * 3]
            assert 6 <= anchors["skin"] <= 16 and anchors["hair"] == anchors["eyes"] == 16
            expected_columns = 16 if width > 900 else 8
            columns = page.locator(".palette-grid.palette-skin").evaluate(
                "e=>getComputedStyle(e).gridTemplateColumns.split(' ').filter(Boolean).length"
            )
            assert columns == expected_columns, (width, columns)
            before = page.locator('[data-color="hair"]').nth(22).evaluate("e=>getComputedStyle(e).backgroundColor")
            page.locator('[data-palette-slider="hair"][data-channel="s"]').fill("20")
            after = page.locator('[data-color="hair"]').nth(22).evaluate("e=>getComputedStyle(e).backgroundColor")
            assert before != after, "Saturation slider did not change color display"
            page.locator("#creatorCalendar summary").click()
            assert page.locator(".creator-month").count() == 13
            assert page.locator(".creator-day").count() == 8
            assert "time" not in page.locator("#creatorCalendar .creator-calendar-panel").inner_text().lower()
            page.locator('.creator-month[data-calendar-month="8"]').click()
            assert "Harvest" in page.locator("#creatorMonthHeading").inner_text()
            page.locator("#creatorWeather summary").click()
            assert page.locator("#creatorWeather").evaluate("e=>e.open")
            assert not page.locator("#creatorCalendar").evaluate("e=>e.open")
            assert "Current weather" in page.locator("#creatorWeatherRows").inner_text()
            rect = page.locator(".creator-weather-panel").bounding_box()
            assert rect["x"] >= -1 and rect["x"] + rect["width"] <= width + 1, (width, rect)
            page.keyboard.press("Escape")
            assert not page.locator("#creatorWeather").evaluate("e=>e.open")
            for lineage in LINEAGES:
                quality = page.evaluate("""lin => {
                  state.lineage = lin;
                  const result = {};
                  for (const key of ['skin','hair','eyes']) {
                    const anchors = paletteAnchors(key), options = paletteOptions(key);
                    const source = paletteCatalog[lin][key];
                    result[key] = {
                      anchors: anchors.length,
                      allSource: anchors.every(a => source.some(c => c.hex === a.hex)),
                      count: options.length,
                      minL: Math.min(...options.map(c => colorLab(c.hex).L)),
                      maxL: Math.max(...options.map(c => colorLab(c.hex).L))
                    };
                  }
                  return result;
                }""", lineage)
                for key, group in quality.items():
                    assert group["allSource"], (width, lineage, key, "non-source hue")
                    assert group["count"] == group["anchors"] * (2 if key == "skin" else 3)
                    assert group["anchors"] >= (6 if key == "skin" else 16)
                    assert group["minL"] > 0.22 and group["maxL"] < 0.95
                for sex in ("male", "female"):
                    got = page.evaluate("""([lin,sex])=>{
                      state.lineage=lin;state.sex=sex;randomName();
                      return {first:state.firstName,last:state.lastName,
                        firstOK:CREATOR_NAME_POOLS[lin][sex].includes(state.firstName),
                        lastOK:CREATOR_NAME_POOLS[lin].surnames.includes(state.lastName)};
                    }""", [lineage, sex])
                    assert got["firstOK"] and got["lastOK"], (width, lineage, sex, got)
            page.locator("#firstName").fill("")
            assert page.locator("#creatorHeaderName").inner_text() == ""
            page.locator("#firstName").fill("Celyra")
            assert "Celyra" in page.locator("#creatorHeaderName").inner_text()
            for stage in range(8):
                page.evaluate("stage=>{state.stage=stage;render()}", stage)
                assert page.locator("#stage").inner_html().strip(), (width, stage)
            metrics = page.evaluate("""() => ({
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              top: document.querySelector('.chrome .top').getBoundingClientRect().height,
              sub: document.querySelector('.chrome .subbar').getBoundingClientRect().height
            })""")
            assert not metrics["overflow"], (width, metrics)
            assert metrics["top"] == 2 * metrics["sub"], (width, metrics)
            assert not errors, (width, errors)
            if args.screenshots and width in (1280, 375):
                page.evaluate("state.stage=1;render()")
                page.screenshot(path=str(screenshot_dir / f"identity-{width}.png"), full_page=True)
            report.append({"width": width, "paletteColumns": columns, "calendarMonths": 13, "daysPerMonth": 8, "allNamePools": "PASS", "creatorStages": 8, "sampleFamilyReview": "PASS", "overflow": False, "pageErrors": 0})
            page.close()
        browser.close()
    print(json.dumps({"status": "PASS", "browserChecks": report}, indent=2))


if __name__ == "__main__":
    main()
