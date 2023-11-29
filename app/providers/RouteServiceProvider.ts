import ServiceProvider from "~/core/http/routing/RouteServiceProvider";
import Router from "~/core/http/routing/Router";
import URL from "URL";
import { getStatusText } from "http-status-codes";
import JsonResource from "~/core/http/resources/JsonResource";

export default class RouteServiceProvider extends ServiceProvider {
  /**
   * Global middlewares alias with options that
   * will be executed before every request of the app.
   * Execution order depends on the order of declaration.
  */
  protected globalMiddlewares = [
    "maintenance.check",
    "limit:1000,5"
  ];
  
  boot() {
    if(!this.app.runningInWeb()) return;
    super.boot();
    this.addHelpers();
  }
  
  addHelpers() {
    Router.request.add("files", {});
    
    Router.request.getter("fullUrl", function() {
      return this.protocol + '://' + this.get('host') + this.originalUrl;
    });
    
    Router.request.getter("fullPath", function() {
      return this.protocol + '://' + this.get('host') + this.path;
    });
   
    Router.request.getter("hasValidSignature", function() {
      return URL.hasValidSignature(this.fullUrl);
    });
    
    Router.response.add("json", function(obj: object) {
      const data = JSON.stringify(obj, (key, value) => {
        if(value instanceof JsonResource) {
          const resource = value.toObject(this.req);
          return key ? resource : { [value.wrap]: resource };
        }
        return value;
      });
      this.send(data);
    });
    
    Router.response.add("message", function(text?: string) {
      this.json({
        success: this.statusCode >= 200 && this.statusCode < 300,
        message: text || getStatusText(this.statusCode),
      });
    });
    
    Router.response.add("redirectToClient", function(path = '/') {
      this.redirect(URL.client(path));
    });
    
    Router.response.add("sendFileFromStorage", function(storagePath: string) {
      this.sendFile(base("storage", storagePath));
    });
  }
}