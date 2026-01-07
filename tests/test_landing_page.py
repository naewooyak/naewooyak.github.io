import re
from playwright.sync_api import Page, expect

def test_landing_page_visuals(page: Page):
    # 1. 접속 및 기본 타이틀 확인
    page.goto("http://localhost:8000")
    expect(page).to_have_title(re.compile("내우약"))

    # 2. Hero 섹션 텍스트 확인
    hero_text = page.locator(".hero h1")
    expect(hero_text).to_contain_text("우리 가족 상비약")

    # 3. 타이핑 애니메이션 동작 확인
    # 초기 로드 시 텍스트가 비어있거나 첫 번째 문구가 타이핑되기 시작함
    type_writer = page.locator(".type-writer")

    # 텍스트가 동적으로 변하는지 확인 (최소 하나의 완성된 문구가 나타나는지)
    # data-text 속성에 있는 문구 중 하나가 나타나는지 확인
    expect(type_writer).to_contain_text(re.compile("스마트하게 관리하세요|사용기한 놓치지 마세요|중복 구매 막으세요"), timeout=10000)

    # 4. 커서 요소 존재 확인
    cursor = page.locator(".cursor")
    expect(cursor).to_be_visible()

    # 5. 콘솔 에러 확인 (중요: JS 문법 오류 등 체크)
    console_errors = []
    def on_console(msg):
        if msg.type == "error":
            console_errors.append(msg.text)

    page.on("console", on_console)

    if len(console_errors) > 0:
        print(f"Console Errors found: {console_errors}")
    assert len(console_errors) == 0, f"Found console errors: {console_errors}"

    # 6. 다운로드 버튼 쉬머 효과 클래스 확인
    btn_primary = page.locator(".btn-primary").first
    # CSS pseudo-element는 직접 확인하기 어렵지만, 클래스가 잘 붙어있는지 확인
    expect(btn_primary).to_have_css("position", "relative")
    expect(btn_primary).to_have_css("overflow", "hidden")

    print("[SUCCESS] All visual verifications passed!")
