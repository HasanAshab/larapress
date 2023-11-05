import SocialiteManager from "./SocialiteManager";

export { default as SocialiteProvider } from "./SocialiteProvider";
export type { default as ExternalUser } from "./ExternalUser";

export default resolve<SocialiteManager>("Socialite");