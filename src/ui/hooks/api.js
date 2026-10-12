import { ubook } from "../../common/ubook";

let globalIsDev = false;

export const appIsDev = async () => {
    try {
        globalIsDev = await ubook.system.isDev();
        return globalIsDev || false;
    } catch (error) {
        console.error('Error checking dev mode:', error);
        return false;
    }
};
