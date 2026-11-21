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
            page.evaluate("route.screen='creator';state.stage=1;render()")
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
            report.append({"width": width, "paletteColumns": columns, "calendarMonths": 13, "daysPerMonth": 8, "allNamePools": "PASS", "creatorStages": 8, "overflow": False, "pageErrors": 0})
            page.close()
        browser.close()
    print(json.dumps({"status": "PASS", "browserChecks": report}, indent=2))


if __name__ == "__main__":
    main()
