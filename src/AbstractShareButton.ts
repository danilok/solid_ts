import EventHandler from "./EventHandler";

export default abstract class AbstractShareButton {
  clazz: string;
  eventHandler: EventHandler;

  constructor(clazz: string) {
    this.clazz = clazz;
    this.eventHandler = new EventHandler();
  }

  abstract createAction(): string;

  // template method
  // montar um algoritmo na superclasse delegar esse método para subclasse
  bind() {
    let action: any = this.createAction();
    this.eventHandler.addEventListenerToClass(this.clazz, "click", action);
  }
}
