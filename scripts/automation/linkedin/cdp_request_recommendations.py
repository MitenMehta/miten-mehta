#!/usr/bin/env python3
import asyncio
import logging
from playwright.async_api import async_playwright

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Target list
TARGETS = [
    {
        "name": "Manmeet Singh",
        "url": "https://www.linkedin.com/in/manmeetsingh/",
        "message": "Hi Manmeet, hope you are doing great! Following up on your wonderful testimonial for Trust in the Age of Agentic AI, I'm currently refining my profile to reflect our work around enterprise AI frameworks and agentic governance. Would you be open to leaving a brief LinkedIn recommendation highlighting our collaboration on enterprise AI strategy and trust frameworks? I’d be happy to return the favor as well!"
    },
    {
        "name": "Puneet Chandok",
        "url": "https://www.linkedin.com/search/results/people/?keywords=Puneet%20Chandok%20Microsoft",
        "message": "Hi Puneet, hope all is well with you. As we continue building momentum around C-suite AI leadership and Leadership Dharma, I am updating my profile to reflect our strategic focus on enterprise AI transformation. Could you write a brief LinkedIn recommendation speaking to our joint thought leadership and strategic work in the AI space? Appreciate your support!"
    },
    {
        "name": "Greg Coquillo",
        "url": "https://www.linkedin.com/search/results/people/?keywords=Greg%20Coquillo%20AI%20Platform",
        "message": "Hi Greg, I've been following your recent insights on AI Gateways and infrastructure. I’m currently updating my profile to focus strictly on enterprise agentic systems and P&L scale. Would you be open to writing a short recommendation based on our interactions or shared focus in the AI ecosystem? Naturally, I'm glad to write one for you as well."
    },
    {
        "name": "Ujjyaini Mitra",
        "url": "https://www.linkedin.com/search/results/people/?keywords=Ujjyaini%20Mitra%20CEO%20SETU",
        "message": "Hi Ujjyaini, loved your recent breakdowns on MCP agent lifecycle and enterprise architecture. As I align my profile around top-tier AI leadership and multi-agent platforms, I’d really appreciate a brief LinkedIn recommendation speaking to our shared focus in the AI ecosystem. Happy to reciprocate!"
    }
]

async def run():
    try:
        async with async_playwright() as p:
            logger.info("Connecting to Chrome over CDP on port 9222...")
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            contexts = browser.contexts
            if not contexts:
                logger.error("No browser contexts found.")
                return
            context = contexts[0]
            page = await context.new_page()

            for target in TARGETS:
                try:
                    logger.info(f"Processing target: {target['name']}")
                    await page.goto(target['url'], timeout=30000)
                    await page.wait_for_load_state("networkidle")
                    
                    if "search/results" in target['url']:
                        logger.info("Searching for profile...")
                        # Click on the first search result link that has the person's name
                        first_result = page.locator("ul.reusable-search__entity-result-list li.reusable-search__result-container a.app-aware-link").first
                        await first_result.wait_for(state="visible", timeout=10000)
                        await first_result.click()
                        await page.wait_for_load_state("networkidle")
                    
                    logger.info(f"Navigated to profile of {target['name']}")
                    
                    # Click 'More' button
                    # The more button might be inside a dropdown or explicitly visible
                    more_btn = page.locator("button[aria-label^='More actions']").first
                    await more_btn.wait_for(state="visible", timeout=10000)
                    await more_btn.click()
                    
                    # Click 'Request a recommendation'
                    req_btn = page.locator("div[role='button']:has-text('Request a recommendation')").first
                    await req_btn.wait_for(state="visible", timeout=5000)
                    await req_btn.click()
                    
                    # Wait for modal
                    modal = page.locator("div[role='dialog']")
                    await modal.wait_for(state="visible", timeout=10000)
                    
                    # Select relationship
                    relationship_dropdown = page.locator("select[id^='recommendation-request-relationship']")
                    await relationship_dropdown.wait_for(state="visible")
                    # Select generic relationship (e.g. index 1)
                    await relationship_dropdown.select_option(index=1)
                    
                    # Select position
                    position_dropdown = page.locator("select[id^='recommendation-request-position']")
                    await position_dropdown.wait_for(state="visible")
                    
                    # Evaluate the options and select the one matching "Chief AI Officer" and "Tabhi"
                    options = await position_dropdown.locator("option").all_inner_texts()
                    target_option_value = None
                    for idx, text in enumerate(options):
                        if "Chief AI Officer" in text and "Tabhi" in text:
                            target_option_value = await position_dropdown.locator("option").nth(idx).get_attribute("value")
                            break
                    
                    if target_option_value:
                        await position_dropdown.select_option(value=target_option_value)
                    else:
                        logger.warning("Could not find exact 'Chief AI Officer @ Tabhi' option, selecting index 1")
                        await position_dropdown.select_option(index=1)
                    
                    # Click 'Next'
                    next_btn = page.locator("button:has-text('Next')")
                    await next_btn.click()
                    
                    # Inject custom message
                    message_area = page.locator("textarea[name='message']")
                    await message_area.wait_for(state="visible", timeout=5000)
                    await message_area.fill(target['message'])
                    
                    # Click 'Send'
                    send_btn = page.locator("button:has-text('Send')")
                    await send_btn.click()
                    logger.info(f"Successfully drafted recommendation request for {target['name']}")
                    
                    # Dismiss modal if not sending
                    close_btn = page.locator("button[aria-label='Dismiss']")
                    if await close_btn.is_visible():
                        await close_btn.click()
                        
                    await asyncio.sleep(5)
                except Exception as e:
                    logger.error(f"Failed to process target {target['name']}: {str(e)}")
                    try:
                        close_btn = page.locator("button[aria-label='Dismiss']")
                        if await close_btn.is_visible():
                            await close_btn.click()
                    except:
                        pass
                    continue
            
            await page.close()
            logger.info("Workflow completed.")
    except Exception as e:
        logger.error(f"Failed to connect to CDP or execute script: {str(e)}")

if __name__ == "__main__":
    asyncio.run(run())
