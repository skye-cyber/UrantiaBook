import { globalEventBus } from "../Globals/eventBus";

export class ReactPortalBridge {
    constructor() {
        this.portals = new Map();
        this.subscribers = new Map();
        this.portalContainers = new Map(); // For targeted containers
    }

    // Register a target container for specific components
    registerContainer(containerId, domElement) {
        this.portalContainers.set(containerId, domElement);

        // Create a portal root inside the target container if it doesn't exist
        if (!domElement.querySelector('.portal-root')) {
            const portalRoot = document.createElement('div');
            portalRoot.className = 'portal-root';
            domElement.appendChild(portalRoot);
        }
    }

    // Show component in a specific target container
    showComponentInTarget(componentType, containerId, props = {}, portal_prefix = '') {
        const portalId = `${portal_prefix}${portal_prefix ? '-' : ''}portal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        if (!this.portalContainers.has(containerId)) {
            //console.warn(`Container ${containerId} not registered. Falling back to global.`);
            return this.showComponent(componentType, props);
        }

        props.portal_id = portalId
        globalEventBus.emit('portal:show:targeted', portalId, componentType, containerId, props)

        return portalId;
    }

    // Original global show method
    showComponent(componentType, props = {}, portal_prefix = '') {
        const portalId = `${portal_prefix}${portal_prefix ? '-' : ''}portal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        globalEventBus.emit('portal:show', portalId, componentType, props)

        return portalId;
    }

    closeComponent(portalId, prefix = false) {
        const event = new CustomEvent('react-portal-close', {
            detail: { id: portalId, prefix: prefix }
        });
        document.dispatchEvent(event);
        globalEventBus.emit('portal:close', portalId, prefix)
    }

    // Close all components in a specific container
    closeAllInContainer(containerId) {
        globalEventBus.emit('portal:close:container', containerId)
    }

    showComponentAsync(componentType, props = {}) {
        return new Promise((resolve) => {
            this.showComponent(componentType, {
                ...props,
                onResolve: resolve
            });
        });
    }

    showComponentInTargetAsync(componentType, containerId, props = {}) {
        return new Promise((resolve) => {
            this.showComponentInTarget(componentType, containerId, {
                ...props,
                onResolve: resolve
            });
        });
    }
}

export class StreamingPortalBridge {
    constructor() {
        this.portals = new Map();
        this.streamingPortals = new Map(); // Special registry for streaming components
    }

    // Register a component that supports streaming
    registerStreamingComponent(componentName, Component) {
        this.streamingPortals.set(componentName, Component);
    }

    // Create a streaming portal that can be updated
    createStreamingPortal(componentType, containerId, initialProps = {}, portal_prefix = '') {
        const portalId = `${portal_prefix}${portal_prefix ? '-' : ''}stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const streamController = {
            id: portalId,
            update: (newProps) => this.updateStreamingPortal(portalId, newProps),
            close: () => this.closeStreamingPortal(portalId),
            append: (data) => this.appendToStreamingPortal(portalId, data)
        };

        // Initial render
        const event = new CustomEvent('react-portal-stream-create', {
            detail: {
                portalId,
                componentType,
                containerId,
                props: initialProps,
                controller: streamController
            }
        });
        document.dispatchEvent(event);

        return streamController;
    }

    // Update an existing streaming portal
    updateStreamingPortal(portalId, newProps) {
        //console.log("Update portal", portalId, newProps)

        const event = new CustomEvent('react-portal-stream-update', {
            detail: { portalId, props: newProps }
        });
        document.dispatchEvent(event);
    }

    // Append data to a streaming portal (for chat messages, etc.)
    _appendToStreamingPortal(portalId, data) {
        console.log(data)
        const event = new CustomEvent('react-portal-stream-append', {
            detail: { portalId, data }
        });
        document.dispatchEvent(event);
    }


    // Enhanced append with type detection
    appendToStreamingPortal(portalId, data, options = {}) {
        const event = new CustomEvent('react-portal-stream-append', {
            detail: {
                portalId,
                data,
                options: {
                    mergeStrategy: 'append', // 'append' | 'update' | 'replace'
                    target: 'props', // 'props' | 'streamData' | 'auto'
                    ...options
                }
            }
        });
        document.dispatchEvent(event);
    }

    // Specialized methods for common patterns
    updateProps(portalId, props) {
        this.appendToStreamingPortal(portalId, props, {
            mergeStrategy: 'update',
            target: 'props'
        });
    }

    appendStreamData(portalId, data) {
        this.appendToStreamingPortal(portalId, data, {
            mergeStrategy: 'append',
            target: 'streamData'
        });
    }

    replaceProps(portalId, props) {
        this.appendToStreamingPortal(portalId, props, {
            mergeStrategy: 'replace',
            target: 'props'
        });
    }

    // Close a streaming portal
    closeStreamingPortal(portalId, prefix = false) {
        const event = new CustomEvent('react-portal-stream-close', {
            detail: { portalId: portalId, prefix: prefix }
        });
        document.dispatchEvent(event);
    }

    // Batch update multiple portals
    batchUpdate(updates) {
        const event = new CustomEvent('react-portal-batch-update', {
            detail: { updates }
        });
        document.dispatchEvent(event);
    }
}


export function ClosePrefixed() {
    for (let pid of ['user_message', 'ai_message']) {
        reactPortalBridge.closeComponent(pid, true)
        streamingPortalBridge.closeStreamingPortal(pid, true)
    }
}

export const reactPortalBridge = new ReactPortalBridge();

export const streamingPortalBridge = new StreamingPortalBridge();

