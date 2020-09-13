'use babel';

export default class IdeErlangView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('ide-erlang');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The IdeErlang package is Alive! It\'s really ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);

    const message2 = document.createElement('div');
    message2.textContent = 'KITAS DIVAS';
    message2.classList.add('message');
    this.element.appendChild(message2);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
