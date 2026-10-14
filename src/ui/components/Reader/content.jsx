import { useCallback, useEffect, useRef } from 'react';
import { selectionhelper } from '../Tooltips/Helpers/selection';
import { hightlightsearch } from './Search/hightlightSearch';
import { StateManager } from '../../../common/syscore/StatesManager';
import { globalEventBus } from '../../../Globals/eventBus';

export const ReaderContent = ({ }) => {
    const readerSection = useRef(null)
    const handle_selectionchange = () => {
        setTimeout(() => {
            const is_valid_selection = selectionhelper.updateAppstate()
            if (is_valid_selection) {
                globalEventBus.emit('selection:change')
                globalEventBus.emit('tooltip:onselect:show')
            }
            globalEventBus.emit('tooltip:onselect:hide')
        }, 300)
    }

    const clearReaderContent = () => {
        readerSection.current.innerHTML = ""
    }

    const contextmenu = useCallback((e) => {
        e.preventDefault();
        readerSection.current.dispatchEvent(new CustomEvent('show-contextmenu-tooltip-menu', {
            detail: {
                width: e.width,
                height: e.height,
                target: e.target,
                screenX: e.screenX,
                screenY: e.screenY,
                pageX: e.pageX,
                pageY: e.pageY,
                x: e.x,
                y: e.y,
                offsetX: e.offsetX,
                offsetY: e.offsetY
            }
        }))
    })
    useEffect(() => {

        StateManager.set('readerSection', readerSection.current)

        // Show context menu on right click
        if (window.innerWidth > 400) {
            readerSection.current.addEventListener('contextmenu', contextmenu)
        }
        globalEventBus.on('keydown:escape', hightlightsearch.removeHighlightedSpans)
        document.addEventListener('selectionchange', handle_selectionchange)
        globalEventBus.on('reader:clear', clearReaderContent)
        return () => {
            if (window.innerWidth > 400) {
                readerSection.current?.removeEventListener('contextmenu', contextmenu)
            }
            document.removeEventListener('selectionchange', handle_selectionchange)
            globalEventBus.off('reader:clear', clearReaderContent)
            globalEventBus.off('keydown:escape', hightlightsearch.removeHighlightedSpans)
            readerSection.current.removeEventListener('click')
        }
    })


    return (
        <article
            ref={readerSection}
            data-portal-container='reader-content'
            id="reader-content"
            className="react-portal-root select-text bg-white dark:bg-[#080819] dark:border-[#18184a] rounded-lg px-2 sm:px-3 selection:bg-[#ff007f]/20 dark:selection:bg-sky-400 leading-loose">
        </article>
    )
}
