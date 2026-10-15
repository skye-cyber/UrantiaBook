import { StateManager } from "../syscore/StatesManager";
import { menuaction } from "../../ui/components/Tooltips/Helpers/action";
import { BookNavigator } from "../../ui/components/Reader/navigator";
import { FontSizeManager_ins } from "../../ui/components/Reader/font_manager";
import { globalEventBus } from "../../Globals/eventBus";

function isInputFocused() {
    const inputFields = [
        StateManager.get('noteComposerComment'),
        StateManager.get('searchInput'),
        StateManager.get('filterContentInput')
    ]

    return inputFields.includes(document.activeElement) || StateManager.get('NoteComposer_open')
}

export function ImplementShortcutKeys() {
    try {
        // shortcut implementations
        document.addEventListener('keydown', (event) => {
            //console.log(document.getElementById("searchInput").focused)

            // 1) if it’s F11, do nothing here and let the browser/Electron handle it
            if (event.key === "F11" || event.code === "F11") {
                focus()
            }
            else if (event.key === 'Escape') {
                event.preventDefault();
                globalEventBus.emit('keydown:escape')
            }
            if (event.ctrlKey && event.key === 'A' || event.ctrlKey && event.key === 'a') {
                const isFocused = isInputFocused();

                if (StateManager.get('NoteComposer_open') || isFocused) return

                event.preventDefault(); // Prevent the default Save action in browsers

                menuaction.selectAll()
            }
            if (event.ctrlKey && event.key === 'S' || event.ctrlKey && event.key === 's') {
                event.preventDefault(); // Prevent the default Save action in browsers
                document.getElementById("search-toggle").click()

            } else if ((event.ctrlKey && event.key === 'P' || event.ctrlKey && event.key === 'p') && !event.shiftKey) {
                event.preventDefault(); // Prevent any default action
                globalEventBus.emit('panel:left:toggle')

            } else if (event.key.toLocaleLowerCase() === 'p' && event.shiftKey) {
                event.preventDefault(); // Prevent any default action
                print()
            } else if (event.key.toLocaleLowerCase() === ' ') {
                const isFocused = isInputFocused()
                if (!isFocused) {
                    event.preventDefault();
                    globalEventBus.emit('player:pause')
                }
                // Next chapter
            } else if (event.key.toLocaleLowerCase() === 'pageup' || (event.ctrlKey && event.key.toLocaleLowerCase() === 'arrowright')) {
                event.preventDefault();
                BookNavigator.nextSection()
                // Previous chapter
            } else if (event.key.toLocaleLowerCase() === 'pagedown' || (event.ctrlKey && event.key.toLocaleLowerCase() === 'arrowleft')) {
                event.preventDefault();
                BookNavigator.previousSection()
                //Increase font
            } else if (event.ctrlKey && event.key.toLocaleLowerCase() === '=') {
                event.preventDefault();
                FontSizeManager_ins.changeFontSize(1)
                // Decrease Font
            } else if (event.ctrlKey && event.key.toLocaleLowerCase() === '-') {
                event.preventDefault();
                FontSizeManager_ins.changeFontSize(-1)
                // Reset font
            } else if (event.ctrlKey && event.key.toLocaleLowerCase() === '0') {
                event.preventDefault();
                FontSizeManager_ins.resetFontSize()
            }
        });
    } catch (err) {
        //
    }
}

function focus() {
    const focused = StateManager.get('isuiFocusOn')
    StateManager.set('isuiFocusOn', !focused)
    globalEventBus.emit('panel:top:toggle')
}

ImplementShortcutKeys()
