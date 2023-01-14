import { Library } from "classes/Library";

export type LibraryManagerConfig = {
  version: string;
  libraries: string[];
};

export class LibraryManager {
  static isLoaded: boolean = false;
  static configLoaded: boolean = false;

  private static _config?: LibraryManagerConfig = undefined;
  private static _libraries: Map<string, Library> = new Map<string, Library>();

  public static _getDefaultConfig(): LibraryManagerConfig {
    return {
      version: "1.0.0",
      libraries: ["/library/stock", "/library/drzoid"],
    };
  }

  public static async loadConfig(): Promise<boolean> {
    //todo: load from local storage the libraries setup. else return default setup
    this._config = this._getDefaultConfig();
    this.configLoaded = true;
    return this.configLoaded;
  }

  public static getConfig(): LibraryManagerConfig | undefined {
    return this._config;
  }

  //TODO: fetch each library's files and return true if all loaded?
  public static async loadLibraries(): Promise<boolean> {
    if (!this._config) return false;
    for (const url of this._config.libraries) {
      const library = new Library(url);
      try {
        await library.fetchManifest();
        await library.fetchFiles();
        this.addLibrary(library);
      } catch (e) {
        console.error(e);
      }
    }
    this.isLoaded = true;
    return this.isLoaded;
  }

  public static addLibrary(library: Library): boolean {
    if (!library.manifest) return false;
    this._libraries.set(library.manifest.name, library);
    return true;
  }

  public static getLibrary(name: string): Library | undefined {
    return this._libraries.get(name);
  }

  public static getLibraries(libtype?: string): Map<string, Library> {
    if (!libtype) return this._libraries;
    const libraries: Map<string, Library> = new Map<string, Library>();
    this._libraries.forEach((library, name) => {
      //check files
      if (library.files.length === 0) {
        console.warn("Library " + name + " has no files");
        return;
      }

      //filter files by type
      const typeFiles = library.files.filter((file) => {
        return file.type === libtype;
      });

      //check if any files of type
      if (typeFiles.length === 0) {
        console.log("Library " + name + " has no " + libtype + " files");
        return;
      }
      //add to fontLibraries
      libraries.set(name, library);
    });
    return libraries;
  }

  public static getAnimationTree(): void {
    throw new Error("Method not implemented.");
  }

  public static getImagesTree(): void {
    throw new Error("Method not implemented.");
  }
}
