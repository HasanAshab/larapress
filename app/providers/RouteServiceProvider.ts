import ServiceProvider from "~/core/http/routing/RouteServiceProvider";
import Router from "~/core/http/routing/Router";
import URL from "URL";
import { getStatusText } from "http-status-codes";
import JsonResource from "~/core/http/resources/JsonResource";
import ResourceCollection from "~/core/http/resources/ResourceCollection";

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
  
  protected registerRoutes() {
    Router.group({
      prefix: "api/v1",
      as: "v1_"
    }, () => {
      Router.discover("routes/api/v1");
    });
  }

  
  private addHelpers() {
    Router.request.add("file", function(name: string) {
      return this.files?.[name] ?? null;
    });
    
    Router.request.add("hasFile", function(name: string) {
      return !!this.file(name);
    });
    
    Router.request.getter("fullUrl", function() {
      return this.protocol + '://' + this.get('host') + this.originalUrl;
    });
    
    Router.request.getter("fullPath", function() {
      return this.protocol + '://' + this.get('host') + this.path;
    });
   
    Router.request.getter("hasValidSignature", function() {
      if(!this._hasValidSignature) {
        this._hasValidSignature = URL.hasValidSignature(this.fullUrl);
      }
      return this._hasValidSignature;
    });
    
    Router.response.add("json", function(data: string | object) {
      if (!this.get('Content-Type')) {
        this.set('Content-Type', 'application/json');
      }
      
      if(typeof data === "string")
        return this.send(data);
        
      data = JSON.stringify(data, (key, value) => {
        if(value instanceof JsonResource || value instanceof ResourceCollection) {
          value.withResponse(this.req, this);
          return value.transform(this.req);
        }
        return value;
      });
      
      
      this.send(data);
    });
    
    Router.response.add("sendStatus", function(code: number) {
      this.status(code).json({});
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