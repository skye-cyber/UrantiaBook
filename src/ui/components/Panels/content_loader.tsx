import { ContentHelper } from '../Reader/Book/utils';
import { BookReader } from '../Reader/Book/Reader';
import { reactPortalBridge } from '../../../common/PortalBridge';
import { StateManager } from '../../../common/syscore/StatesManager';
import { waitForElement } from '../../../common/syscore/dom_utils';
import { modalmanager } from '../../../common/Status/Manager';
import { ubook } from '../../../common/ubook';
import { globalEventBus } from '../../../Globals/eventBus';

export class ContentLoader {
    private selector_title: HTMLElement | null = null;
    private paper_container: HTMLElement | null = null;
    private reader_section: HTMLElement | null = null;
    private notecontent: HTMLElement | null = null;

    constructor() {
        this.init();
    }

    private init() {
        waitForElement('#selector-part-title', (el: HTMLElement) => {
            this.selector_title = el;
        });

        waitForElement('#paper-container', (el: HTMLElement) => {
            this.paper_container = el;
        });

        waitForElement('#reader-content', (el: HTMLElement) => {
            this.reader_section = el;
            StateManager.set('reader_section', el);
        });

        waitForElement('#notecontent', (el: HTMLElement) => {
            this.notecontent = el;
        });
    }

    /**
     * @param silent Items selector interface display stays hidden
     */
    async setForeword(silent = false): Promise<void> {
        // 1. Use the helper to wait for selector_title
        const titleEl = await waitForVariable(() => this.selector_title);

        if (!titleEl) {
            console.warn("Timed out waiting for selector_title. Aborting setForeword.");
            return;
        }

        // 2. Proceed with original logic
        titleEl.textContent = 'Foreword';
        if (!silent) globalEventBus.emit('ui:selector:show');

        if (!this.paper_container || !this.reader_section) {
            console.warn("Container elements not found. Aborting setForeword.");
            return;
        }

        const reader = new BookReader(this.paper_container, this.reader_section);
        reader.load(ContentHelper.getSource('foreword_source'));
    }

    /**
     * @param silent Items selector interface display stays hidden
     */
    async setLocalUniverse(silent = false): Promise<void> {
        const titleEl = await waitForVariable(() => this.selector_title);
        if (!titleEl || !this.paper_container || !this.reader_section) return;

        titleEl.textContent = 'Local Universe';
        if (!silent) globalEventBus.emit('ui:selector:show');

        const reader = new BookReader(this.paper_container, this.reader_section);
        reader.load(ContentHelper.getSource('local_universe_source'));
    }

    /**
     * @param silent Items selector interface display stays hidden
     */
    async setSuperUniverse(silent = false): Promise<void> {
        const titleEl = await waitForVariable(() => this.selector_title);
        if (!titleEl || !this.paper_container || !this.reader_section) return;

        titleEl.textContent = 'Central and Superuniverse';
        if (!silent) globalEventBus.emit('ui:selector:show');

        const reader = new BookReader(this.paper_container, this.reader_section);
        reader.load(ContentHelper.getSource('central_superuniverses_source'));
    }

    /**
     * @param silent Items selector interface display stays hidden
     */
    async setHistoryOfUrantia(silent = false): Promise<void> {
        const titleEl = await waitForVariable(() => this.selector_title);
        if (!titleEl || !this.paper_container || !this.reader_section) return;

        titleEl.textContent = 'History of Urantia';
        if (!silent) globalEventBus.emit('ui:selector:show');

        const reader = new BookReader(this.paper_container, this.reader_section);
        reader.load(ContentHelper.getSource('history_urantia_source'));
    }

    /**
     * @param silent Items selector interface display stays hidden
     */
    async setJesusTeachings(silent = false): Promise<void> {
        const titleEl = await waitForVariable(() => this.selector_title);
        if (!titleEl || !this.paper_container || !this.reader_section) return;

        titleEl.textContent = 'Life and Teachings of Jesus';
        if (!silent) globalEventBus.emit('ui:selector:show');

        const reader = new BookReader(this.paper_container, this.reader_section);
        reader.load(ContentHelper.getSource('jesus_life_teachings_source'));
    }

    /**
     * @param type specifies content to load ie favourites or bookmark
     * @param silent Items selector interface display stays hidden
     */
    async loader(type: 'favourites' | 'bookmarks' = 'favourites', silent = false): Promise<void> {
        let data: any;
        if (type === 'favourites') {
            data = await ubook.favourites.readAll();
        } else {
            data = await ubook.bookmarks.readAll();
        }

        const items = data?.[type === 'favourites' ? 'fav' : 'bookmark'];

        if (!Array.isArray(items) || items.length === 0) {
            return modalmanager.showMessage(`${ContentHelper.capitalize(type)} content is empty`, 'warning');
        }

        const titleEl = await waitForVariable(() => this.selector_title);
        if (titleEl) {
            titleEl.textContent = ContentHelper.capitalize(type);
        }

        const contentFile = 'FN-Combined_Structured_UB.json';

        const fullData = await ubook.content.read(contentFile);
        const PartsDataById = Object.fromEntries(fullData.parts.map((part: any) => [part.id, part]));

        for (const item of items) {
            const part = PartsDataById[item.part_id];
            if (!part) continue;

            const paper = part.papers.find((p: any) => p.paper_id === item.paper_id);
            if (!paper) continue;

            const section = paper.sections.find((s: any) => s.section_number === item.section_number);
            if (!section) continue;

            const title = ContentHelper.prepTitle(section);
            const datatag = `${part.id}-${paper.paper_id}-${section.section_number}`;

            const struct = {
                part_id: part.id,
                paper_id: paper.paper_id,
                section_number: section.section_number,
            };

            reactPortalBridge.showComponentInTarget(
                'BookItem',
                'paper-container',
                {
                    part: part, paper: paper, section: section, title: title, tag: datatag, struct: struct
                },
                'book_section'
            );
        }

        if (!silent) globalEventBus.emit('ui:selector:show');
    }

    async loadFavourites(): Promise<void> {
        await this.loader('favourites');
    }

    async loadBookmarks(): Promise<void> {
        await this.loader('bookmarks');
    }

    /**
     * @param silent Items selector interface display stays hidden
     */
    async renderNotes(silent = false): Promise<void> {
        const notesData = await ubook.notes.readAll();
        const items = notesData?.notes;

        if (!Array.isArray(items) || items.length === 0) {
            return modalmanager.showMessage('Empty! Nothing to show.', 'warning');
        }

        reactPortalBridge.closeComponent('notes', true);

        for (const note of items) {
            reactPortalBridge.showComponentInTarget(
                'NoteCard',
                'notebody',
                {
                    note: note
                },
                'notes'
            );
        }

        if (!silent) globalEventBus.emit('pages::notes:open');
    }
}

/**
 * Polls a getter function until it returns a truthy value or the timeout is reached.
 *
 * @param getter - A function that returns the value (or null/undefined if not ready).
 * @param timeoutMs - How long to wait before giving up (default 5000ms).
 * @param intervalMs - How often to check (default 100ms).
 * @returns The truthy value, or null if it times out.
 */
export async function waitForVariable<T>(
    getter: () => T | null | undefined,
                                         timeoutMs = 5000,
                                         intervalMs = 100
): Promise<T | null> {
    const start = Date.now();

    // Check immediately first
    let value = getter();
    if (value) return value;

    // Poll
    while (Date.now() - start < timeoutMs) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        value = getter();
        if (value) return value;
    }

    return null;
}

export const ContentLoader_ins = new ContentLoader();
