/**
 * Allows for recording a sequence of focused cells with the focused line
 * and navigate inside this stack.
 */
export default class History {
  constructor() {
    this.entries = [];
    this.index = -1;
  }

  /**
   * Adds a new cell to the stack.
   *
   * If the stack length is greater than the stack limit,
   * it will remove the oldest entries.
   */
  saveCell(cellId, line) {
    if (this.isTheSameLastEntry(cellId, line)) return;

    if (this.entries[this.index + 1] !== undefined)
      this.entries = this.entries.slice(0, this.index + 1);

    this.entries.push({ cellId, line });
    this.index++;

    if (this.entries.length > 20) {
      this.entries.shift();
      this.index--;
    }
  }

  /**
   * Immediately clears the stack and reset the current index.
   */
  destroy() {
    this.entries = [];
    this.index = -1;
  }

  /**
   * Removes all matching cells with given id from the stack.
   */
  removeAllFromCell(cellId) {
    // We need to make sure the last entry from history
    // doesn't belong to the given cell id that we need
    // to remove from the entries list.
    let currentEntryIndex = this.index;
    let currentEntry = this.entries[currentEntryIndex];

    while (currentEntry.cellId === cellId) {
      currentEntryIndex--;
      currentEntry = this.entries[currentEntryIndex];
    }

    this.entries = this.entries.filter((entry) => entry.cellId !== cellId);
    this.index = this.entries.lastIndexOf(currentEntry);
  }

  /**
   * Checks if the current stack is available to navigate back.
   */
  canGoBack() {
    return this.canGetFromHistory(-1);
  }

  /**
   * Navigates back in the current stack.
   *
   * If the navigation succeeds, it will return the entry from current index.
   * Otherwise, returns null;
   */
  goBack() {
    return this.getFromHistory(-1);
  }

  /** @private **/
  getFromHistory(direction) {
    if (!this.canGetFromHistory(direction)) return null;

    this.index = Math.max(0, this.index + direction);
    return this.entries[this.index];
  }

  /** @private **/
  canGetFromHistory(direction) {
    if (this.index === -1) return false;
    if (this.entries.length === 0) return false;

    const index = Math.max(0, this.index + direction);
    return this.entries[index] !== undefined;
  }

  /** @private **/
  isTheSameLastEntry(cellId, line) {
    const lastEntry = this.entries[this.index];

    return (
      lastEntry !== undefined &&
      cellId === lastEntry.cellId &&
      line === lastEntry.line
    );
  }
}
