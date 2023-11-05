import StorageManager from "./StorageManager";

export type { default as StorageDriver } from "./StorageDriver";

export default resolve<StorageManager>("Storage");
