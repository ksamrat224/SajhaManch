class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  data: any = null;
}

export class Trie {
  private root: TrieNode = new TrieNode();

  insert(word: string, data: any): void {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
    node.data = data;
  }

  search(prefix: string, limit: number = 10): any[] {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }
    return this.collectWords(node, limit);
  }

  private collectWords(node: TrieNode, limit: number): any[] {
    const results: any[] = [];
    const queue: TrieNode[] = [node];

    while (queue.length > 0 && results.length < limit) {
      const current = queue.shift()!;
      if (current.isEndOfWord) {
        results.push(current.data);
      }
      for (const child of current.children.values()) {
        queue.push(child);
      }
    }
    return results;
  }
}
