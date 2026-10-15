import { reactPortalBridge } from "../../../../common/PortalBridge"

export class LoadingSpinner {
    constructor() {
        //
    }
    async open(text) {
        const portalId = reactPortalBridge.showComponentInTarget('DualRingGlassLoader', 'main-layout', { text: text }, 'loadingspinner')
        return portalId
    }
    close() {
        try {
            reactPortalBridge.closeComponent('loadingspinner', true)
        } catch (err) { }
    }
}

export const loadingspinner = new LoadingSpinner()
