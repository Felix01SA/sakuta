import fs from "node:fs";
import { join } from "node:path";
import { MiniMap } from "lavalink-client";

export class JSONStore<T = unknown> {
  private tempFolder = join(process.cwd(), "src", "tmp");
  private filePath: string;
  private store: MiniMap<keyof T, string> = new MiniMap();

  constructor(fileName: string) {
    this.filePath = `${this.tempFolder}/${fileName}.json`;
    if (!fs.existsSync(this.tempFolder)) {
      fs.mkdirSync(this.tempFolder);
    }

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "[]");
    } else {
      const data = fs.readFileSync(this.filePath, "utf-8");

      if (!data || data === "") {
        fs.promises
          .writeFile(this.filePath, "[]", { encoding: "utf-8" })
          .then(() => (this.store = new MiniMap(JSON.parse(data))));
      } else {
        this.store = new MiniMap(JSON.parse(data));
      }
    }
  }

  public get<K extends keyof T>(key: K): T[K] | undefined {
    const data = this.store.get(key);
    if (data) {
      return JSON.parse(data) as T[K];
    }
    return undefined;
  }

  public getAll() {
    return this.store.toJSON();
  }

  public async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    this.store.set(key, JSON.stringify(value));
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(this.store.toJSON()),
    );
  }
}
