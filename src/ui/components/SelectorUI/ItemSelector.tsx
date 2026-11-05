import { useCallback, useEffect, useRef, useState } from 'react';
import { StateManager } from '../../../common/syscore/StatesManager';
import { globalEventBus } from '../../../Globals/eventBus';
import { BookItemInterface } from '../../types/global';
import { SkeletonList } from '../SkeletonList';
import { BookItem } from '../Reader/Book/BookItem';

interface SelectroProps {
    bookItems: BookItemInterface[]
}

export const BookItemSelectorUI: React.FC<SelectroProps> = ({ bookItems = [] }) => {
    const itemSelector = useRef<HTMLDivElement | null>(null)
    const itemSelectorBox = useRef<HTMLDivElement | null>(null)
    const paperContainer = useRef<HTMLUListElement | null>(null)
    const selectorTitle = useRef<HTMLHeadingElement | null>(null)
    const filterContentInputRef = useRef<HTMLInputElement | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const displaySelectorModal = useCallback(() => {
        if (!itemSelector.current) return
        itemSelector.current.classList.remove('hidden', 'animate-exit')
        itemSelector.current.classList.add('animate-enter')
        setTimeout(() => {
            if (!itemSelectorBox.current) return
            itemSelectorBox.current.classList.remove('hidden', 'animate-exit')
            itemSelectorBox.current.classList.add('animate-enter')
        }, 100)
    }, [])

    const hideSelectorModal = useCallback(() => {
        if (!itemSelector.current) return
        itemSelectorBox.current?.classList.remove('animate-enter')
        itemSelectorBox.current?.classList.add('animate-exit')
        setTimeout(() => {
            if (!itemSelectorBox.current || !itemSelector.current) return
            // Set timeout for animation exit
            itemSelectorBox.current.classList.add('hidden')
            itemSelector.current.classList.remove('animate-enter')
            itemSelector.current.classList.add('animate-exit')
        }, 50)

        // hide after animation exit
        setTimeout(() => {
            if (!itemSelector.current) return
            itemSelector.current.classList.add('hidden')
        }, 300)

    }, [])

    const searchPartSections = useCallback((e: InputEvent) => {
        if (!e.target) return
        const value = e.target instanceof HTMLInputElement
            ? e.target.value.trim().toLowerCase()
            : "";
        //if (!value) return;

        // const parts = value.split(/\s+/);
        if (!paperContainer.current) return

        const bookSections = paperContainer.current.childNodes;

        if (!bookSections?.length) return;

        bookSections.forEach((item: any) => {
            // Unhide items hidden by previous chat
            if (!value) return item.classList.remove('hidden')

            //Perform search
            const title = item.dataset?.title?.toLowerCase() || "";
            const datatag = item.dataset?.tag?.toLowerCase() || "";
            const fmatch = title.includes(value) || datatag.includes(value);
            item.classList.toggle('hidden', !fmatch);
        });
    }, []);

    useEffect(() => {
        const onEscape = (e: Event) => {
            if (itemSelector.current && itemSelector.current.classList.contains('hidden')) return
            e.preventDefault()
            hideSelectorModal()
        }
        StateManager.set('paperContainer', paperContainer.current)
        StateManager.set('selectorTitle', selectorTitle.current)
        StateManager.set('filterContentInput', filterContentInputRef.current)

        globalEventBus.on('ui:selector:show', displaySelectorModal)
        globalEventBus.on('ui:selector:hide', hideSelectorModal)
        globalEventBus.on('keydown:escape', (e) => onEscape(e))
        const isLoading = globalEventBus.on('ui:selector:loading', (state) => setLoading(state))

        return () => {
            globalEventBus.off('ui:selector:hide', hideSelectorModal)
            globalEventBus.off('ui:selector:show', displaySelectorModal)
            globalEventBus.off('keydown:escape', (e) => onEscape(e))
            isLoading.unsubscribe()
        }
    })

    return (
        <div
            ref={itemSelector}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    hideSelectorModal()
                }
            }}
            id="itemsSelector"
            className="absolute flex inset-0 z-[50] items-center justify-center backdrop-brightness-50 animate-exit hidden transform transition-all duration-50">
            <div ref={itemSelectorBox} id="itemsSelectorBox" className="relative w-full max-w-xl h-full max-h-[100%] overflow-y-hidden rounded-sm sm:rounded-2xl bg-white dark:bg-zinc-950 shadow-none transform transition-all duration-100 ease-in-out animate-exit hidden z-[60] select-none">
                <div className="relative sticky top-0 w-full p-2 flex items-center justify-center border-b border-gray-200 dark:border-zinc-700 bg-[#282873] dark:bg-zinc-900 shadow-inner shadow-lg transition-colors duration-300">
                    <div className='block'>
                        <h2 ref={selectorTitle} id="selector-part-title" className="text-xl sm:text-2xl font-bold text-gray-200 dark:text-gray-100 overflow-x-hidden mr-12">Select Items</h2>
                        <input
                            ref={filterContentInputRef}
                            id='filterContentInput'
                            type='text'
                            onInput={(e) => searchPartSections(e as any)}
                            className='bg-[#282873]/60 text-gray-50 dark:bg-zinc-900 border border-[#5757ff] dark:border-zinc-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-none font-handwritting rounded-md py-1 px-2 text-[15px]' placeholder="Filter" />
                    </div>
                    <button onClick={hideSelectorModal} className="absolute top-2 right-2 text-gray-200 dark:text-gray-300 hover:text-red-400 dark:hover:text-red-500 transition-colors text-2xl leading-none colors duration-700" aria-label="Close modal" title="Close modal">&times;</button>
                </div>
                <ul
                    ref={paperContainer}
                    data-portal-container='paper-container'
                    id="paper-container"
                    className="divide-y divide-gray-300 dark:divide-zinc-800 px-6 py-1 transition-all duration-700 overflow-y-auto min-h-[75%] max-h-[85%] pb-[10vh] scrollbar-custom">
                    {/* 1. Loading State */}
                    {loading && <SkeletonList />}

                    {/* 2. Empty State (Only show if NOT loading AND length is 0) */}
                    {!loading && bookItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-gray-400 size-full min-h-[200px] gap-2">
                            <h2 className="text-2xl italic">Nothing here</h2>
                            <p className="text-sm">Try adjusting your search or filters if any.</p>
                        </div>
                    )}

                    {/* 3. Data State (Only show if NOT loading AND length > 0) */}
                    {!loading && bookItems.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {bookItems.map((bi, _i) => (
                                <BookItem
                                    key={bi.tag}
                                    part={bi.part}
                                    paper={bi.paper}
                                    section={bi.section}
                                    tag={bi.tag}
                                    title={bi.title}
                                    struct={bi.struct}
                                />
                            ))}
                        </div>
                    )}
                </ul>
            </div>
        </div>
    )
}

