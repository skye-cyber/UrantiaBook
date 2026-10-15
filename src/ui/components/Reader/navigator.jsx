import { reactPortalBridge } from "../../../common/PortalBridge";
import { modalmanager } from "../../../common/Status/Manager";
import { waitForElement } from "../../../common/syscore/dom_utils";
import { StateManager } from "../../../common/syscore/StatesManager";
import { globalEventBus } from "../../../Globals/eventBus";
import { ContentLoader_ins } from "../Panels/content_loader";
import { loadingspinner } from "../StatusUI/Helpers/loader";

export const PART_ID_MAP = {
    0: 'Foreword',
    1: 'SuperUniverse',
    2: 'LocalUniverse',
    3: 'HistoryOfUrantia',
    4: 'JesusTeachings'
}


export class BookNavigator {
    static nextSection() {
        const current_section = StateManager.get('active_section')
        if (!current_section) return modalmanager.showMessage('Activate/Open a section first.', 'info')
        const nextEntry = current_section.nextElementSibling || null;

        nextEntry ? nextEntry.click() : modalmanager.showMessage('End of Chapter!', 'warning')
    }
    static previousSection() {
        const current_section = StateManager.get('active_section')
        if (!current_section) return modalmanager.showMessage('Activate/Open a section first.', 'info')
        const previousEntry = current_section.previousElementSibling || null;

        previousEntry ? previousEntry.click() : modalmanager.showMessage('Reached Beginning of Chapter!', 'warning')
    }
    static loadByPartRef(REF) {
        try {
            const [paper_id, trailing] = REF.split(':')
            const [section_number, paragraph_number] = trailing.split('.')

            let part_id = null;
            if (Number(paper_id) === 0) {
                part_id = 0
            } else if (Number(paper_id) >= 1 && Number(paper_id) < 32) {
                part_id = 1
            } else if (Number(paper_id) >= 32 && Number(paper_id) < 56) {
                part_id = 2
            } else if (Number(paper_id) >= 57 && Number(paper_id) < 119) {
                part_id = 3
            } else if (Number(paper_id) >= 120 && Number(paper_id) < 196) {
                part_id = 4
            }
            const REF_CONTENT = {
                part_id: part_id ?? 0,
                paper_id: Number(paper_id),
                section_number: Number(section_number),
                paragraph_number: Number(paragraph_number),
            }
            const loaderPID = loadingspinner.open('Loading content, please wait...')
            /*
            * STEP1: Prepare part content
            * true no items interface display
            */
            ContentLoader_ins[`set${PART_ID_MAP[REF_CONTENT.part_id]}`](true)

            //STEP2: close Notes page
            globalEventBus.emit('pages::notes:close')

            //STEP3: find and click right section
            waitForElement(`[data-tag="${REF_CONTENT.part_id}-${REF_CONTENT.paper_id}-${REF_CONTENT.section_number}"]`, (e) => {
                e.click()
                reactPortalBridge.closeComponent(loaderPID)
            })
        } catch (err) {
            console.log(err)
        }

    }
}
