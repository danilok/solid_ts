import EventHandler from "./EventHandler";

export default abstract class AbstractShareButton {
  url: string;
  clazz: string;
  eventHandler: EventHandler;

  constructor(clazz: string, url: string) {
    this.url = url;
    this.clazz = clazz;
    this.eventHandler = new EventHandler();
  }

  abstract createLink(): string;

  // template method
  // montar um algoritmo na superclasse delegar esse método para subclasse
  bind() {
    let link: string = this.createLink();
    this.eventHandler.addEventListenerToClass(this.clazz, "click", () => window.open(link));
  }
}
