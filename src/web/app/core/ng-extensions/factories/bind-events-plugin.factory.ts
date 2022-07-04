import {EventManager} from '@angular/platform-browser';
import {EMPTY, ObservableInput, switchMap, take} from 'rxjs';

// noinspection JSUnusedGlobalSymbols
class HostBindingRxSupportPlugin {
  public manager!: EventManager;

  public supports(event: string): boolean {
    return event.startsWith('$.');
  }

  public addEventListener(element: HTMLElement, event: string): () => void {
    HostBindingRxSupportPlugin.setValue(element, event, EMPTY);

    const method = this.getMethod(element, event);
    const sub = this.manager
      .getZone()
      .onStable.pipe(
        take(1),
        switchMap(() => HostBindingRxSupportPlugin.getValue<ObservableInput<unknown>>(element, event))
      )
      .subscribe(value => method(value));

    return () => sub.unsubscribe();
  }

  private getMethod(element: HTMLElement, event: string): (v: unknown) => void {
    const [, type, name, unit] = event.split('.');

    switch (type) {
      case 'attr':
        return v => element.setAttribute(name, String(v));
      case 'class':
        return v => element.classList.toggle(name, !!v);
      case 'style':
        return v => element.style.setProperty(name, `${v}${unit}`);
      default:
        return v => HostBindingRxSupportPlugin.setValue(element, name, v);
    }
  }

  private static getValue<T>(element: HTMLElement, key: string): T {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return element[key]
  }

  private static setValue<T>(element: HTMLElement, key: string, value: T): T {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return element[key] = value
  }
}

export const bindEventsPluginFactory = () => new HostBindingRxSupportPlugin();
